const { default: mongoose } = require("mongoose");
const Category = require("../../../models/Category");
const Product = require("../../../models/Product");
const AppError = require("../../../utils/appError");
const catchAsync = require("../../../utils/catchAsync");
const APIFeatures = require("../../_util/apiFeatures");


// exports.crea
exports.getProductById = catchAsync(async(req,res,next)=>{
  const product_id = req.params;
  const product =await Product.findById(mongoose.Types.ObjectId(product_id));

  if(!product){
    next(new AppError("Product do not exits"))
  }
  return res.status(200).json({
    "status" : "success",
    "product" : product
  });
})

exports.getProducts = catchAsync(async(req,res,next)=>{
  const vendor_id = req.user.id;
  const features = new APIFeatures(
    Product.find({vendor_id}),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const products =await features.query;

  if(!products){
    next(new AppError("Products do not exits"));
  }
  return res.json({
    "status" : "success",
    "product" : products
  })
})

exports.createProduct = catchAsync(async(req,res,next)=>{
  const data = req.body;
  data.vendorId = req.user.id
  const product = new Product(data)
  product.validateData(data,next);
  // const product = await Product.create(data);
  
  await product.save();

  return res.json({
    "status" : "success",
    "product" : product
  })

})

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
