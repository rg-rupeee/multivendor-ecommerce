const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  summary: {
    type: String,
    trim: true,
    required: true,
  },
  description: String,
  vendorId: {
    type: mongoose.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  quantityInStock: {
    type: String,
    required: true,
  },
  mainImage: {
    type: String,
    required: true,
  },
  alternateImages: [String],
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
});

const Product = mongoose.model(productSchema, "Product");

module.exports = Product;
