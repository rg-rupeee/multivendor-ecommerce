const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
      price: Number,
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  coupon: {
    type: mongoose.Types.ObjectId,
    ref: "Coupon",
  },
  checkoutAmount: {
    type: Number,
    required: true,
  },
  paymentStage: {
    type: String,
    enum: ["Done", "Initiated", "Cancelled", "Not Started"],
    default: "Not Started",
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["Placed", "Completed", "Not Placed"],
    default: "Not Placed",
    required: true,
  },
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
