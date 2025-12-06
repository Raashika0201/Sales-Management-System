const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema({
  transactionId: Number,

  date: String,

  customerId: String,
  customerName: { type: String, index: true },
  phoneNumber: { type: String, index: true },
  gender: { type: String, index: true },
  age: Number,
  customerRegion: { type: String, index: true },
  customerType: String,

  productId: String,
  productName: String,
  brand: String,
  productCategory: { type: String, index: true },
  tags: [String],

  quantity: Number,
  pricePerUnit: Number,
  discountPercentage: Number,
  totalAmount: Number,
  finalAmount: Number,

  paymentMethod: { type: String, index: true },
  orderStatus: String,
  deliveryType: String,

  storeId: String,
  storeLocation: String,

  salespersonId: String,
  employeeName: String,
});

module.exports = mongoose.model("Sale", salesSchema);
