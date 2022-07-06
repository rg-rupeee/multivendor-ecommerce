const Order = require("../../../models/Order");
const catchAsync = require("../../../utils/catchAsync");
const AppError = require("../../../utils/appError");
const crypto = require("crypto");
const razorpay = require("../../../config/razorpay");

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

    console.log(updatedOrder);
  } else {
    // pass it
    console.log(
      "***********Someone is making invalid Payment Capture Request************************"
    );
  }

  return res.json({ status: "ok" });
});
