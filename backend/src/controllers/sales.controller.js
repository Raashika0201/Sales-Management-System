const { fetchSales } = require("../services/sales.services");

const getSales = async (req, res) => {
  try {
    console.log("Sales API - Query params:", JSON.stringify(req.query, null, 2));
    const result = await fetchSales(req.query);
    
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Sales Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sales data",
    });
  }
};

module.exports = { getSales };
