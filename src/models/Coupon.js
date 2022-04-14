const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    trim: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  discountPercent: {
    type: Number,
  },
  discountAmount: {
    type: Number,
  },
  minPurchase: {
    type: Number,
    required: true,
  },
  maxDiscount: {
    type: Number,
    required: true,
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
