const express = require("express");
const router = express.Router();
const { getSales } = require("../controllers/sales.controller");

router.get("/", getSales);

module.exports = router;
