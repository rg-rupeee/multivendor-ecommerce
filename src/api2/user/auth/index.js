const express = require("express");
const router = express.Router();

const authController = require("./controllers/authController");
const passwordController = require("./controllers/passwordController");
const check = require("../../../controllers/middlewares/check");

/* signin using email */
router.post(
  "/signin/email",
  check.requiredFields("email", "password"),
  authController.emailSignin
);

/* signup using email */
router.post("/signup/email", authController.emailSignup);

/* forget password */
router.post("/forgetPassword", passwordController.forgetPassword);

/* change password */
router.post("/changePassword", passwordController.changePassword);

module.exports = router;
