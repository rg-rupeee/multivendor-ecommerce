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

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
