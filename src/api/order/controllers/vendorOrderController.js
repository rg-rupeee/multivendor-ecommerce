const Order = require("../../../models/Order");
const VendorOrder = require("../../../models/VendorOrder");
const catchAsync = require("../../../utils/catchAsync");
const APIFeatures = require("../../_util/apiFeatures");
const AppError = require("../../../utils/appError");
const User = require("../../../models/User");
const { sendMail } = require("../../../utils/email");
const { sendMessage } = require("../../../utils/sms");
const { partnerMapping } = require("../../../utils/deliveryPartnerMapping");

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

  const vendorOrder = await VendorOrder.findById({ _id: orderId }).populate(
    "products.productId",
    "name _id mrp retailPrice"
  );

  if (!vendorOrder) {
    return next(new AppError("No vendor order found with that id", 404));
  }

  if (!vendorOrder.vendorId.equals(req.user.id)) {
    return next(new AppError("Forbidden! can access on the user's order", 403));
  }

  const order = await Order.findOne({ vendorOrder: vendorOrder._id }).populate(
    "userId"
  );

  return res.json({
    success: true,
    order: vendorOrder,
    userDetails: {
      name: order?.userId?.name,
      _id: order?.userId?._id,
      email: order?.userId?.email,
      address: order.address,
      userPhone: order.mobile,
    },
  });
});

exports.updateOrderStatus = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const { orderStatus, trackingId, partner } = req.body;

  const vendorOrder = await VendorOrder.findById({ _id: orderId }).populate(
    "userId"
  );

  if (!vendorOrder) {
    return next(new AppError("No vendor order found with that id", 404));
  }

  if (!vendorOrder.vendorId.equals(req.user.id)) {
    return next(new AppError("Forbidden! can access on the user's order", 403));
  }

  if ((trackingId && !partner) || (partner && !trackingId)) {
    return next(
      new AppError("TrackingId and partner both needs to be provided")
    );
  }

  const updatedVendorOrder = await VendorOrder.findOneAndUpdate(
    {
      _id: vendorOrder._id,
    },
    { orderStatus, trackingId, partner },
    {
      new: true,
      runValidators: true,
    }
  );

  res.json({
    success: true,
    order: updatedVendorOrder,
  });

  if (trackingId && partner) {
    // send user mail and otp regarding same

    const email = vendorOrder.userId.email;
    const name = vendorOrder.userId.name;

    // send mail to user for order status update
    await sendMail(
      { email, name },
      "ORDER Dispatched",
      `Your order with order id ${this._id} has been dispatched using ${partner}. You can track your order on the following link ${partnerMapping[partner]}. Your order tracking reference number is ${trackingId}`
    );

    const order = await Order.findOne({ vendorOrders: updatedVendorOrder._id });

    // send sms to user for order status update
    await sendMessage(
      order.mobile,
      `Your order with order id ${this._id} has been dispatched using ${partner}. You can track your order on the following link ${partnerMapping[partner]}. Your order tracking reference number is ${trackingId}`
    );
  }
});
