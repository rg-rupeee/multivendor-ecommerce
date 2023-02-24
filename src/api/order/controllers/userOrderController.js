const Order = require("../../../models/Order");
const VendorOrder = require("../../../models/VendorOrder");
const Coupon = require("../../../models/Coupon");
const Cart = require("../../../models/Cart");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/appError");
const APIFeatures = require("../../_util/apiFeatures");
const { ValidateCart } = require("../../user/cart/controller/cartController");
const { mapState } = require("../../../utils/statesShippingChargesMapping");

const _getCart = async (userId) => {
  await ValidateCart(userId);

  const cart = await Cart.findOne({ userId }).populate(
    "products.productId",
    "_id name mrp offeredPrice quantityInStock retailPrice vendorId"
  );

  return cart;
};

const calculateShippingCharges = async (order, state = "") => {
  let weight;
  let quantity;
  let cost = 0;

  state = state.toLowerCase();
  if (!mapState[state]) {
    state = "other";
  }

  for (const vo of order.vendorOrders) {
    const o = await VendorOrder.findOne({ _id: vo }).populate(
      "products.productId"
    );
    for (const pdt of o.products) {
      const p = pdt.productId;

      const td = p.tableData?.find((obj) => {
        return obj.key === "Weight";
      });

      console.log(td);

      weight = parseFloat(td.value);
      quantity = parseInt(pdt.quantity);

      console.log(weight);
      console.log(quantity);

      cost +=
        weight * weight > 2
          ? (mapState[state][2] + (weight - 2) * 80) * quantity
          : mapState[state][weight] * quantity;
    }
  }
  return cost;
};

exports.clearCart = async (userId) => {
  await Cart.findOneAndUpdate({ userId }, { $set: { products: [] } });
};

exports.getMyOrders = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Order.find({
      userId: req.user.id,
      orderStatus: { $ne: "Initiated" },
    }).populate("vendorOrders"),
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
  }

  // validate vendor and create vendor order
  const vendorIds = Object.keys(vendors);
  const vendorOrders = [];
  const vendorOrderDetails = [];
  for (const id of vendorIds) {
    const vendorOrder = await VendorOrder.create({
      userId: req.user.id,
      vendorId: id,
      products: vendors[id].products,
    });

    vendorOrders.push(vendorOrder._id);
    vendorOrderDetails.push(vendorOrder);
  }

  // create user order on basis of vendor order
  const order = await Order.create({
    userId: req.user.id,
    vendorOrders,
  });

  // empty cart
  // clearCart(req.user.id);

  return res.json({
    success: true,
    order,
    vendorOrders: vendorOrderDetails,
  });
});

exports.updateUserContactDetails = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  const { address, mobile, billingAddress, billingMobile, state } = req.body;

  // calculate shippingCharges based on state also update final amount

  const order = await Order.findOne({ _id: orderId });
  const shippingCharges = await calculateShippingCharges(order, state);

  /*
   * Not providing finalAmount so that it will be automatically calculated in pre save hook
   */
  order.address = address;
  order.mobile = mobile;
  order.billingAddress = billingAddress;
  order.billingMobile = billingMobile;
  order.shippingCharges = shippingCharges;

  await order.save();

  return res.json({
    success: true,
    order,
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findById({ _id: orderId }).populate({
    path: "vendorOrders",
    populate: {
      path: "products.productId",
      select: { name: 1, images: 1, description: 1 },
    },
  });

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
