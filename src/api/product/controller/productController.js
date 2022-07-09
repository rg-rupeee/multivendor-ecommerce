const Cart = require("../../../models/Cart");
const Wishlist = require("../../../models/Wishlist");
const Product = require("../../../models/Product");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const APIFeatures = require("../../_util/apiFeatures");

exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;

  const features = new APIFeatures(
    Product.find({ category: categoryId }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  return res.json({
    status: "success",
    products,
  });
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  let products = await features.query;

  const hasProduct = (products, product) => {
    for (const pdt of products) {
      if (pdt._id.equals(product._id)) return true;
    }

    return false;
  };

  if (req.user) {
    let userCart = await Cart.findOne({ userId: req.user.id });
    if (!userCart) {
      userCart = await Cart.create({ userId: req.user.id });
    }

    let userWishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!userWishlist) {
      userWishlist = await Wishlist.create({ userId: req.user.id });
    }

    const cartProducts = userCart.products;
    const wishlistProducts = userWishlist.products;

    for (const product of products) {
      if (hasProduct(cartProducts, product)) {
        product.inCart = true;
      }

      if (hasProduct(wishlistProducts, product)) {
        product.inWishlist = true;
      }
    }
  }

  return res.json({
    status: "success",
    results: products.length,
    products,
  });
});

exports.getOneProduct = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Product.findOne({ _id: req.params.id }),
    req.query
  ).limitFields();

  let product = await features.query;

  const hasProduct = (products, product) => {
    for (const pdt of products) {
      if (pdt._id.equals(product._id)) return true;
    }

    return false;
  };

  if (req.user) {
    let userCart = await Cart.findOne({ userId: req.user.id });
    if (!userCart) {
      userCart = await Cart.create({ userId: req.user.id });
    }

    let userWishlist = await Wishlist.findOne({ userId: req.user.id });
    if (!userWishlist) {
      userWishlist = await Wishlist.create({ userId: req.user.id });
    }

    const cartProducts = userCart.products;
    const wishlistProducts = userWishlist.products;

    if (hasProduct(cartProducts, product)) {
      product.inCart = true;
    }

    if (hasProduct(wishlistProducts, product)) {
      product.inWishlist = true;
    }
  }

  return res.json({
    status: "success",
    product,
  });
});

exports.getMultipleProducts = catchAsync(async (req, res, next) => {
  if (!Array.isArray(req.body.products)) {
    return next(new AppError("products must be an array", 400));
  }

  const features = new APIFeatures(
    Product.find({ _id: { $in: req.body.products } }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const products = await features.query;

  return res.json({
    status: "success",
    results: products.length,
    products,
  });
});

exports.searchVendorProduct =(searchField) => catchAsync(async (req, res, next) => {
  const { searchKey } = req.body;
  
  const features = new APIFeatures(
    Product.find({ [searchField]: new RegExp(searchKey, "i"), vendorId : req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const items = await features.query;

  return res.json({
    status: "success",
    results: items.length,
    items,
  });
});

exports.createVendorProduct = catchAsync(async (req, res, next) => {
  req.body.vendorId = req.user.id;

  const product = await Product.create(req.body);

  return res.status(201).json({
    status: "success",
    product,
  });
});

exports.getProductsByVendor = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    Product.find({ vendorId: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  let products = await features.query;

  return res.status(201).json({
    status: "success",
    products,
  });
});
