const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  productsId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  review: {
    type: String,
  },
  ratings: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true,
  },
});

const Review = mongoose.model(reviewSchema, "Review");

module.exports = Review;
