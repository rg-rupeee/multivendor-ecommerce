const Category = require("../../../models/Category");
const Product = require("../../../models/Product");
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
