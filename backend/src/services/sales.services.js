const Sale = require("../models/sales.model");
const buildQuery = require("../utils/buildQuery.util");
const buildSort = require("../utils/sort.util");
const getPagination = require("../utils/pagination.util");

const fetchSales = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    sortBy = "transactionIdAsc",
  } = queryParams;

  const query = buildQuery(queryParams);
  const sort = buildSort(sortBy);
  
  const convertRegexForAggregation = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof RegExp) {
      return { $regex: obj.source, $options: obj.flags || 'i' };
    }
    if (Array.isArray(obj)) return obj.map(item => convertRegexForAggregation(item));
    const converted = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        converted[key] = convertRegexForAggregation(obj[key]);
      }
    }
    return converted;
  };
  
  const aggregationQuery = convertRegexForAggregation(query);
  
  let total;
  if (queryParams.searchField === "phoneNumber" && queryParams.search) {
    const searchDigits = queryParams.search.replace(/\D/g, "");
    const countPipeline = [
      {
        $addFields: {
          phoneNumberStr: {
            $cond: [
              { $ne: [{ $type: "$Phone Number" }, "missing"] },
              { $toString: { $ifNull: ["$Phone Number", ""] } },
              ""
            ]
          }
        }
      },
      {
        $match: {
          $or: [
            { phoneNumberStr: { $regex: searchDigits, $options: "i" } },
            { phoneNumber: { $regex: searchDigits, $options: "i" } }
          ]
        }
      },
      { $count: "total" }
    ];
    const countResult = await Sale.aggregate(countPipeline).allowDiskUse(true);
    total = countResult.length > 0 ? countResult[0].total : 0;
  } else {
    total = await Sale.countDocuments(query);
  }
  const totalPages = Math.ceil(total / limit) || 1;
  
  let validPage = Number(page);
  if (isNaN(validPage) || validPage < 1) validPage = 1;
  if (totalPages > 0 && validPage > totalPages) validPage = totalPages;
  
  const { skip } = getPagination(validPage, limit);

  let data = [];
  if (total > 0 && validPage >= 1 && validPage <= totalPages) {
    try {
      const isPhoneSearch = queryParams.searchField === "phoneNumber" && queryParams.search;
      
      let pipeline;
      
      if (isPhoneSearch) {
        const searchDigits = queryParams.search.replace(/\D/g, "");
        pipeline = [
          {
            $addFields: {
              phoneNumberStr: {
                $cond: [
                  { $ne: [{ $type: "$Phone Number" }, "missing"] },
                  { $toString: { $ifNull: ["$Phone Number", ""] } },
                  ""
                ]
              }
            }
          },
          {
            $match: {
              phoneNumberStr: { $regex: searchDigits, $options: "i" }
            }
          },
          { $sort: sort },
          { $skip: skip },
          { $limit: Number(limit) },
          { $project: { phoneNumberStr: 0 } } 
        ];
      } else {
        pipeline = [
          { $match: aggregationQuery },
          { $sort: sort },
          { $skip: skip },
          { $limit: Number(limit) }
        ];
      }
      
      data = await Sale.aggregate(pipeline).allowDiskUse(true);
    } catch (err) {
      data = await Sale.find(query)
        .sort(sort)
        .skip(skip)
        .limit(Number(limit))
        .lean();
    }
  }

  const cloneQuery = (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof RegExp) return new RegExp(obj);
    if (Array.isArray(obj)) return obj.map(item => cloneQuery(item));
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = cloneQuery(obj[key]);
      }
    }
    return cloned;
  };
  const statsQuery = cloneQuery(query); 
  
  const completedFilter = {
    $or: [
      { orderStatus: "Completed" },
      { "Order Status": "Completed" }
    ]
  };
  
  let finalStatsQuery;
  
  if (Object.keys(statsQuery).length === 0) {
    finalStatsQuery = completedFilter;
  } else {
    const andConditions = [];
    
    if (statsQuery.$and) {
      andConditions.push(...statsQuery.$and);
    } else if (statsQuery.$or) {
      andConditions.push({ $or: statsQuery.$or });
    } else {
      andConditions.push(statsQuery);
    }
    
    Object.keys(statsQuery).forEach(key => {
      if (key !== "$or" && key !== "$and") {
        andConditions.push({ [key]: statsQuery[key] });
      }
    });
    
    andConditions.push(completedFilter);
    
    finalStatsQuery = { $and: andConditions };
  }
  
  
  
  const finalStatsAggregationQuery = convertRegexForAggregation(finalStatsQuery);
  
  const isPhoneSearchForStats = queryParams.searchField === "phoneNumber" && queryParams.search;
  
  let statsPipeline;
  
  if (isPhoneSearchForStats) {
    const searchDigits = queryParams.search.replace(/\D/g, "");
    statsPipeline = [
      {
        $addFields: {
          phoneNumberStr: {
            $cond: [
              { $ne: [{ $type: "$Phone Number" }, "missing"] },
              { $toString: { $ifNull: ["$Phone Number", ""] } },
              ""
            ]
          },
          orderStatusField: {
            $ifNull: ["$orderStatus", "$Order Status"]
          }
        }
      },
      {
        $match: {
          $and: [
            { phoneNumberStr: { $regex: searchDigits, $options: "i" } },
            { orderStatusField: "Completed" }
          ]
        }
      },
      {
        $addFields: {
          qty: { $ifNull: ["$quantity", "$Quantity"] },
          total: { $ifNull: ["$totalAmount", "$Total Amount"] },
          final: { $ifNull: ["$finalAmount", "$Final Amount"] }
        }
      },
      {
        $group: {
          _id: null,
          totalUnitsSold: { $sum: { $ifNull: ["$qty", 0] } },
          totalAmount: { $sum: { $ifNull: ["$total", 0] } },
          totalDiscount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$total", null] },
                    { $ne: ["$final", null] }
                  ]
                },
                { $subtract: ["$total", "$final"] },
                0
              ]
            }
          },
        },
      },
    ];
  } else {
    statsPipeline = [
      { $match: finalStatsAggregationQuery },
      {
        $addFields: {
          qty: { $ifNull: ["$quantity", "$Quantity"] },
          total: { $ifNull: ["$totalAmount", "$Total Amount"] },
          final: { $ifNull: ["$finalAmount", "$Final Amount"] }
        }
      },
      {
        $group: {
          _id: null,
          totalUnitsSold: { $sum: { $ifNull: ["$qty", 0] } },
          totalAmount: { $sum: { $ifNull: ["$total", 0] } },
          totalDiscount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$total", null] },
                    { $ne: ["$final", null] }
                  ]
                },
                { $subtract: ["$total", "$final"] },
                0
              ]
            }
          },
        },
      },
    ];
  }

  let stats = {
    totalUnitsSold: 0,
    totalAmount: 0,
    totalDiscount: 0,
  };

  try {
    const statsResult = await Sale.aggregate(statsPipeline).allowDiskUse(true);
    
    if (statsResult.length > 0 && statsResult[0]) {
      stats = {
        totalUnitsSold: statsResult[0].totalUnitsSold || 0,
        totalAmount: statsResult[0].totalAmount || 0,
        totalDiscount: statsResult[0].totalDiscount || 0,
      };
    }
  } catch (err) {
    console.error("Error calculating stats:", err.message); 
  }

  return {
    data,
    pagination: {
      totalRecords: total,
      currentPage: validPage,
      totalPages: totalPages,
    },
    stats,
  };
};

module.exports = { fetchSales };
