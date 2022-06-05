const mongoose = require("mongoose");

const vendorOrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vendorId: {
    type: mongoose.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
      price: { type: Number, min: 0 },
    },
  ],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  orderStatus: {
    type: String,
    enum: ["Placed", "Completed", "Transistioning"],
    default: "Placed",
    required: true,
  },
});

VendorOrderSchema.pre("save", async function (next) {
  const total = 0;
  for (const product of this.products) {
    total = total + product.price;
  }
  this.total = total;

  next();
});

const VendorOrder = mongoose.model("VendorOrder", vendorOrderSchema);

module.exports = VendorOrder;
