const express = require("express");
const router = express.Router();

const controller = require("./controllers/authController");

/* signin using email */
router.post("/signin/email", controller.emailSignin);

/* signin using otp */
router.post("/signin/otp", controller.mobileSignin);

/* signup using email */
router.post("/signup/email", controller.emailSignup);

/* signup using otp */
router.post("/signup/otp", controller.moblieSignup);

/* forget password */
router.post("/forgetPassword", controller.forgetPassword);

/* change password */
router.post("/changePassword", controller.changePassword);

module.exports = router;
