const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  isPrimitive: {
    type: Boolean,
    default: true,
  },
  parentType: {
    type: mongoose.Types.ObjectId,
    ref: "Category",
  },
});

const Category = mongoose.model(categorySchema, "Category");

module.exports = Category;
