const Order = require("../../../models/Order");
const VendorOrder = require("../../../models/VendorOrder");
const Coupon = require("../../../models/Coupon");
const Cart = require("../../../models/Cart");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/appError");
const APIFeatures = require("../../_util/apiFeatures");
const { ValidateCart } = require("../../user/cart/controller/cartController");

const _getCart = async (userId) => {
  await ValidateCart(userId);

  const cart = await Cart.findOne({ userId }).populate(
    "products.productId",
    "_id name mrp offeredPrice quantityInStock retailPrice vendorId"
  );

  return cart;
};

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Order.find({ userId: req.user.id }).populate("vendorOrders"),
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

exports.createOrderFromCart = catchAsync(async (req, res, next) => {
  // get user's cart
  const cart = await _getCart(req.user.id);

  // seperate all products according to vendor
  const products = cart.products;
  const vendors = {};
  for (const product of products) {
    const vendorId = product.productId.vendorId;
    const productId = product.productId._id;
    const price = product.productId.retailPrice;

    if (!vendors[vendorId]) {
      vendors[vendorId] = {
        _id: vendorId,
        products: [],
      };
    }

    vendors[vendorId].products.push({
      productId,
      price,
      quantity: product.quantity,
      isCustom: product.isCustom,
      customDescription: product.customDescription,
      color: product.color,
    });

    console.log(vendors[vendorId]);
  }

  // validate vendor and create vendor order
  const vendorIds = Object.keys(vendors);
  const vendorOrders = [];
  const vendorOrderDetails = [];
  for (const id of vendorIds) {
    // console.log(vendors[id]);
    const vendorOrder = await VendorOrder.create({
      userId: req.user.id,
      vendorId: id,
      products: vendors[id].products,
    });

    vendorOrders.push(vendorOrder._id);
    vendorOrderDetails.push(vendorOrder);

    console.log(vendorOrder);
  }

  // create user order on basis of vendor order
  const order = await Order.create({
    userId: req.user.id,
    vendorOrders,
  });

  return res.json({
    success: true,
    order,
    vendorOrders: vendorOrderDetails,
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findById({ _id: orderId }).populate("vendorOrders");

  if (!order) {
    return next(new AppError("No order found with that id", 404));
  }

  if (!order.userId.equals(req.user.id)) {
    return next(new AppError("Forbidden! can access on the user's order", 403));
  }

  return res.json({
    success: true,
    order,
  });
});

exports.applyCoupon = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;
  const { couponCode } = req.body;

  const order = await Order.findById({ _id: orderId }).populate("vendorOrders");

  if (!order) {
    return next(new AppError("No order found with that id", 404));
  }

  if (!order.userId.equals(req.user.id)) {
    return next(new AppError("Forbidden! can access on the user's order", 403));
  }

  const coupon = await Coupon.findOne({ code: couponCode });

  if (!coupon) {
    return next(new AppError("No coupon found", 404));
  }

  if (Coupon.isValid(coupon, order.vendorOrdersTotal)) {
    order.couponCode = couponCode;
    order.coupon = coupon;
    order.couponDiscount = Coupon.calcualteDiscount(
      coupon,
      order.vendorOrdersTotal
    );
  }

  const updated = await order.save();

  return res.json({
    success: true,
    discountAmount: order.couponDiscount,
    discountCode: order.couponCode,
    order: updated,
  });
});
