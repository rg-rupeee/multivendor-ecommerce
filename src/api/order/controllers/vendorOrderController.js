const Order = require("../../../models/Order");
const VendorOrder = require("../../../models/VendorOrder");
const catchAsync = require("../../../utils/catchAsync");
const APIFeatures = require("../../_util/apiFeatures");
const AppError = require("../../../utils/appError");

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    VendorOrder.find({ vendorId: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const orders = await features.query;

  return res.json({
    success: true,
    orders,
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  const vendorOrder = await VendorOrder.findById({ _id: orderId });

  if (!vendorOrder) {
    return next(new AppError("No vendor order found with that id", 404));
  }

  if (!vendorOrder.vendorId.equals(req.user.id)) {
    return next(new AppError("Forbidden! can access on the user's order", 403));
  }

  return res.json({
    success: true,
    order: vendorOrder,
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  const vendorOrder = await VendorOrder.findById({ _id: orderId });

  if (!vendorOrder) {
    return next(new AppError("No vendor order found with that id", 404));
  }

  if (!vendorOrder.vendorId.equals(req.user.id)) {
    return next(new AppError("Forbidden! can access on the user's order", 403));
  }

  const updatedVendorOrder = await VendorOrder.findOneAndUpdate(
    {
      _id: vendorOrder._id,
    },
    { orderStatus: req.body.orderStatus },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.json({
    success: true,
    order: updatedVendorOrder,
  });
});
