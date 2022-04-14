const express = require("express");
const router = express.Router();

const orderController = require("./controllers/orderController");
const razorpayController = require("./controllers/razorpayController");

/* create order */
router.post("/order", orderController.createOrder);

/* initiate payment - create razorpay payment order */
router.post("/payment/start", razorpayController.createRazorpayOrder);

/*  payment callback */
router.post(
  "/callback/paymentCaptured",
  razorpayController.callbackRazorpayPaymentCaptured
);

/* get razorpay payment order details */
router.get(
  "/razorpayOrder/:razorpayOrderId",
  razorpayController.getRazorpayPaymentOrderDetails
);

/* get razorpay payment order payment details */
router.get(
  "/razorpayOrder/:razorpayOrderId/payments",
  razorpayController.getRazorpayPaymentOrderPaymentDetails
);

module.exports = router;
