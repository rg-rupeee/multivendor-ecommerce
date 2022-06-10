const express = require("express");
const router = express.Router();

const authController = require("./controller/authController");
const { requiredFields } = require("../../_util/check");

router.post(
  "/signin",
  requiredFields("email", "password"),
  authController.emailSignin
);

router.post(
  "/signup",
  requiredFields("email", "password", "name"),
  authController.emailSignup
);

// send forget password otp
router.post(
  "/forgetPassword",
  requiredFields("email"),
  authController.forgetPassword
);

// verify otp and change password
router.post(
  "/resetPassword",
  requiredFields("email", "otp", "password"),
  authController.resetPassword
);

module.exports = router;
