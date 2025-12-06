require("dotenv").config({ path: require("path").resolve(__dirname, "../../.env") });

const connectDB = require("../config/db");
const Sale = require("../models/sales.model");

const runNormalization = async () => {
  try {
    await connectDB();

    const sales = await Sale.find({});

    for (let doc of sales) {
      const updated = {
        transactionId: doc["Transaction ID"],
        date: doc["Date"],

        customerId: doc["Customer ID"],
        customerName: doc["Customer Name"],
        phoneNumber: String(doc["Phone Number"]),
        gender: doc["Gender"],
        age: Number(doc["Age"]),
        customerRegion: doc["Customer Region"],
        customerType: doc["Customer Type"],

        productId: doc["Product ID"],
        productName: doc["Product Name"],
        brand: doc["Brand"],
        productCategory: doc["Product Category"],
        tags: doc["Tags"] ? doc["Tags"].split(",") : [],

        quantity: Number(doc["Quantity"]),
        pricePerUnit: Number(doc["Price per Unit"]),
        discountPercentage: Number(doc["Discount Percentage"]),
        totalAmount: Number(doc["Total Amount"]),
        finalAmount: Number(doc["Final Amount"]),

        paymentMethod: doc["Payment Method"],
        orderStatus: doc["Order Status"],
        deliveryType: doc["Delivery Type"],

        storeId: doc["Store ID"],
        storeLocation: doc["Store Location"],

        salespersonId: doc["Salesperson ID"],
        employeeName: doc["Employee Name"],
      };

      await Sale.findByIdAndUpdate(doc._id, updated, { new: true });
    }
    process.exit();
  } catch (error) {
    console.error("Normalization Failed:", error);
    process.exit(1);
  }
};

runNormalization();
