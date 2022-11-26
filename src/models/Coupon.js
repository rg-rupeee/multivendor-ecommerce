const mongoose = require("mongoose");
const AppError = require("../utils/appError");

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

couponSchema.statics.isValid = function (coupon, orderAmount) {
  if (coupon.minPurchase > orderAmount) {
    throw new AppError(
      `Coupon not applicable! Minimum purchase should be ${coupon.minPurchase}`,
      400
    );
  }

  return true;
};

couponSchema.statics.calcualteDiscount = function (coupon, orderAmount) {
  let discount;
  if (coupon.discountPercent) {
    const couponDiscountByPerc = (orderAmount * coupon.discountPercent) / 100;
    if (coupon.discountAmount) {
      if (coupon.discountAmount > couponDiscountByPerc) {
        discount = coupon.discountAmount;
      } else {
        discount = couponDiscountByPerc;
      }
    } else {
      discount = couponDiscountByPerc;
    }
  } else if (coupon.discountAmount) {
    discount = coupon.discountAmount;
  } else {
    discount = 0;
  }

  if (discount > orderAmount) {
    discount = orderAmount;
  }

  if (discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }

  return discount;
};

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
