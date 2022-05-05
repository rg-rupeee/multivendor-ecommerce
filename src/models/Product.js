const mongoose = require("mongoose");
const AppError = require("../utils/appError");
const category = require("../models/Category")

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    mrp: {
      type: Number,
      required: true,
    },
    retailPrice: {
      type: Number,
      required: true,
    },
    summary: {
      type: String,
      trim: true,
      required: true,
    },
    description: String,
    tableData: [
      {
        key: {
          type: String,
          required: true,
        },
        value: {
          type: String,
          required: true,
        },
      },
    ],
    vendorId: {
      type: mongoose.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    quantityInStock: {
      type: String,
      required: true,
    },
    thumbnail: [
      {
        type: String,
        required: true,
      },
    ],
    images: [{ type: String, required: true }],
    onSale: {
      type: Boolean,
      default: false,
    },
    canBeCustomised: {
      type: Boolean,
      default: false,
    },
    isVariable: {
      type: Boolean,
      default: false,
    },
    variableColors: [
      {
        type: String,
      },
    ],
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    keyword: [String],
    relatedProducts: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

productSchema.methods.validateData =async function(data,next){
  // const data = req.body;
  // data.vendorId = req.user.id;
  // const product = new Product(data);
  // req.body = data
  var hex_re = /^#([0-9a-f]{3}){1,2}$/i;

  if(data.retailPrice > data.mrp){
    next(new AppError("Retail Price cannot be more than MRP",400));
  }

  if(!data.vendorId){
     next(new AppError("Vendor Id cannot be null",400));
  }

  // quantity shoudl be more than 1
  if(parseInt(data.quantityInStock) < 1){
    next(new AppError("Quantity of the product cannot be less than 1",400));
  }

  for(i in data.images){
    if(data.images[i].length<1){
      next(new AppError("Invalide image size",400));
    }
  }
 
  // checking the variable colors are hex format or not 
  for(i in data.variableColors){
    if(!hex_re.test(data.variableColors[i])){
      next(new AppError("variable data should be in hexadecimal format",400));
    }
  }
  
  // check for category existence
  const requestedCategory = await category.findById(data.category);
  if(!requestedCategory){
    next(new AppError("Requested Category do not exists",400))
  } 
  //   relatedProducts: [
  //     {
  //       type: mongoose.Types.ObjectId,
  //       ref: "Product",
  //     },
  //   ],
}
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
