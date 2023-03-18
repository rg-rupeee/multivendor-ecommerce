const Order = require("../../../models/Order");
const catchAsync = require("../../../utils/catchAsync");
const APIFeatures = require("../../_util/apiFeatures");

exports.getOrders = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Order.find({
      orderStatus: { $ne: "Initiated" },
    }).populate('userId'),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query;

  return res.json({
    success: true,
    results: orders.length,
    order: orders,
  });
});
