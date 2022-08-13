const mongoose = require("mongoose");
const Vendor = require("./Vendor");
const { sendMail } = require("./../utils/email");

const vendorOrderSchema = new mongoose.Schema(
  {
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
        quantity: {
          type: Number,
          default: 1,
        },
        isCustom: {
          type: Boolean,
          default: false,
        },
        customDescription: String,
        color: String,
      },
    ],
    total: {
      type: Number,
      default: 0,
      min: 0,
    },
    orderStatus: {
      type: String,
      enum: ["Placed", "Completed", "Transistioning"],
      default: "Placed",
      required: true,
    },
    partner: String,
    trackingId: String,
  },
  {
    timestamps: true,
  }
);

vendorOrderSchema.pre("save", function (next) {
  let total = 0;
  for (const product of this.products) {
    total = total + product.price * product.quantity;
  }
  this.total = total;

  next();
});

vendorOrderSchema.post("save", async function () {
  console.log(this);

  const vendor = await Vendor.findOne({ _id: this.vendorId });

  if (!vendor) return;

  await sendMail(
    { email: vendor.email, name: vendor.name },
    "ORDER RECEIVED",
    `You have an order with order id ${this._id}! please check dashboard.`
  );
});

vendorOrderSchema.post("save", async function () {
  // TODO: check if
});

const VendorOrder = mongoose.model("VendorOrder", vendorOrderSchema);

module.exports = VendorOrder;
