const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
    unique: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
        required: true,
      },
      isCustom: {
        type: Boolean,
        default: false,
      },
      customDescription: String,
      color: String,
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
