const Order = require("../../../models/Order");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/appError");
const crypto = require("crypto");
const razorpay = require("../../../config/razorpay");
const { sendMessage } = require("../../../utils/sms");
const { sendMail } = require("../../../utils/email");
const VendorOrder = require("../../../models/VendorOrder");
const Vendor = require("../../../models/Vendor");
const User = require("../../../models/User");
const { clearCart } = require("../../order/controllers/userOrderController");

exports.intiateRazorpayPayment = catchAsync(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findOne({ _id: orderId });

  if (order.paymentStage === "Done") {
    return next(new AppError("Transaction already completed"));
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: order.finalAmount * 100,
    currency: "INR",
    receipt: orderId,
    payment_capture: 1,
  });

  const updatedOrder = await Order.findOneAndUpdate(
    { _id: orderId },
    {
      razorpayOrderId: razorpayOrder.id,
      paymentStage: "Initiated",
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.json({
    razorpayOrder,
    updatedOrder,
  });
});

const sendUpdates = async (order) => {
  const user = await User.findOne({ _id: order.userId });
  // send email to user for payment done and order received
  await sendMail(
    { email: user.email, name: user.name },
    "Payment done",
    "Your payment was successfully captured. Thank you for shopping with us. Kindly visit the user profile to view all of your orders."
  );

  // send sms to user for order
  await sendMessage(
    order.billingMobile,
    `Your order has been placed. Kindly visit the user profile to view all of your orders. Thank you`
  );

  for (const vo of order.vendorOrders) {
    const vendorOrder = await VendorOrder.findOneAndUpdate(
      { _id: vo },
      { orderStatus: "Placed" },
      { new: true, runValidators: true }
    );
    const vendor = await Vendor.findOne({ _id: vendorOrder.vendorId });
    //  send email to vendor for order
    await sendMail(
      { email: vendor.email, name: vendor.name },
      "Order received | You have new order",
      "You have received an order please visit your dashboard to view order"
    );
  }
};

exports.paymentCapturedWebhook = catchAsync(async (req, res, next) => {
  console.log("Payment Captured");
  console.log(req.body.payload.payment);

  const shasum = crypto.createHmac(
    "sha256",
    process.env.RAZORPAY_WEBHOOK_SECRET
  );
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");
  // console.log({ digest, header: req.headers["x-razorpay-signature"] });

  if (digest == req.headers["x-razorpay-signature"]) {
    console.log("request is legit");
    // process it
    const updatedOrder = await Order.findOneAndUpdate(
      {
        razorpayOrderId: req.body.payload.payment.entity.order_id,
      },
      {
        paymentStage: "Done",
        orderStatus: "Placed",
        razorpayPaymentId: req.body.payload.payment.entity.id,
      },
      {
        runValidators: true,
        new: true,
      }
    );

    clearCart(updatedOrder.userId);
    sendUpdates(updatedOrder);
  } else {
    // pass it
    console.log(
      "***********Someone is making invalid Payment Capture Request************************"
    );
  }

  return res.json({ status: "ok" });
});
