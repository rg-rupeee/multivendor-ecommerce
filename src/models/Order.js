const mongoose = require("mongoose");
const VendorOrder = require("./VendorOrder");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vendorOrders: [
      {
        type: mongoose.Types.ObjectId,
        ref: "VendorOrder",
        required: true,
      },
    ],
    vendorOrdersTotal: {
      type: Number,
      default: 0,
      required: true,
    },
    coupon: {
      type: mongoose.Types.ObjectId,
      ref: "Coupon",
    },
    couponCode: {
      type: String,
    },
    couponDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },
    finalAmount: {
      type: Number,
      default: 0,
      required: true,
    },
    paymentStage: {
      type: String,
      enum: ["Done", "Initiated", "Cancelled", "Not Started"],
      default: "Not Started",
      required: true,
    },
    orderStatus: {
      type: String,
      enum: ["Placed", "Completed", "Initiated"],
      default: "Initiated",
      required: true,
    },
    razorpayOrderId: String,
    address: {
      type: String,
      required: false,
      default: "NA"
    },
    mobile: {
      type: Number,
      required: false,
      default: 0
    },
    billingAddress: {
      type: String,
      required: false,
      default: "NA"
    },
    billingMobile: {
      type: Number,
      required: false,
      default: 0
    },
  },
  { timestamps: true }
);

OrderSchema.pre("save", async function (next) {
  let total = 0;
  // console.log("...");
  // console.log(this);

  for (const order of this.vendorOrders) {
    const vendorOrder = await VendorOrder.findOne({ _id: order });
    total = total + vendorOrder.total;
  }
  this.vendorOrdersTotal = total;

  next();
});

OrderSchema.pre("save", async function (next) {
  this.finalAmount =
    this.vendorOrdersTotal > this.couponDiscount
      ? this.vendorOrdersTotal - this.couponDiscount
      : 0;

  next();
});

const Order = mongoose.model("Order", OrderSchema);

module.exports = Order;
