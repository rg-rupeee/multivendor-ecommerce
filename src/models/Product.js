const mongoose = require("mongoose");

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
    offeredPrice: {
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
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
