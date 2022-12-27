const express = require("express");
const router = express.Router();

const { protect } = require("../_util/middlewares/authMiddlewares");
const User = require("../../models/User");
const paymentController = require("./controllers/paymentController");

router.post(
  "/:orderId/pay",
  protect(User),
  paymentController.intiateRazorpayPayment
);

router.post("/capturedwebhook", paymentController.paymentCapturedWebhook);

module.exports = router;
