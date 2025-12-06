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
  
  const total = await Sale.countDocuments(query);
  const totalPages = Math.ceil(total / limit) || 1;
  
  let validPage = Number(page);
  if (isNaN(validPage) || validPage < 1) validPage = 1;
  if (totalPages > 0 && validPage > totalPages) validPage = totalPages;
  
  const { skip } = getPagination(validPage, limit);

  let data = [];
  if (total > 0 && validPage >= 1 && validPage <= totalPages) {
    try {
      const pipeline = [
        { $match: query },
        { $sort: sort },
        { $skip: skip },
        { $limit: Number(limit) }
      ];
      
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
  
  
  try {
    const testCount = await Sale.countDocuments(finalStatsQuery);
  } catch (testErr) {
    console.error("Error testing stats query:", testErr.message);
  }
  
  const statsPipeline = [
    { $match: finalStatsQuery },
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
    } else {
      const matchCount = await Sale.countDocuments(finalStatsQuery);
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
