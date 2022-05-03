const Category = require("../../../models/Category");
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

exports.search = catchAsync(async (req, res, next) => {
  const { searchKey } = req.body;

  const features = new APIFeatures(
    Product.find({ name: new RegExp(searchKey, "i") }),
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
