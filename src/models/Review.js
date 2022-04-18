const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  productId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  review: {
    type: String,
  },
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
  },
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
