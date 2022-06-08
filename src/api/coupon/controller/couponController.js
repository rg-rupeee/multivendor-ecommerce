const Coupon = require("../../../models/Coupon");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/appError");

exports.getCouponByName = catchAsync(async (req, res, next) => {
  const { couponCode } = req.params;

  const coupon = await Coupon.findOne({ code: couponCode });

  if (!coupon) {
    return next(new AppError("No coupon found", 404));
  }

  return res.json({
    success: true,
    coupon,
  });
});
