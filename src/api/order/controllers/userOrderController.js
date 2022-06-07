const Order = require("../../../models/Order");
const VendorOrder = require("../../../models/VendorOrder");
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
  const vendorSet = new Set();
  const vendors = {};
  for (const product of products) {
    const vendorId = product.productId.vendorId;
    const productId = product.productId._id;
    console.log({ productId, vendorId });
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
    });

    console.log(vendors[vendorId]);
  }

  // 4. create vendor order
  // 5 create user order on basis of vendor order
  return res.json({
    message: "hello",
    vendors,
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
