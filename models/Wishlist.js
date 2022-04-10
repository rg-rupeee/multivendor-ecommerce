const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  products: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
      price: Number,
    },
  ],
});

const Wishlist = mongoose.model(wishlistSchema, "Wishlist");

module.exports = Wishlist;
