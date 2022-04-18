const Category = require("../../../models/Category");
const Product = require("../../../models/Product");
const catchAsync = require("../../../utils/catchAsync");

exports.getProductsByCategory = catchAsync(async (req, res, next) => {
  const { categoryId } = req.params;
  const products = await Product.find({ category: categoryId });
  return res.json({
    status: "success",
    products,
  });
});
