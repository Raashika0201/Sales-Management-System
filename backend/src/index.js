const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const salesRoutes = require("./routes/sales.routes");

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.get("/", (req, res) => {
  res.send("TruEstate Backend is Running");
});

app.use("/api/sales", salesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
