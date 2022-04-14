const express = require("express");
const router = express.Router();

const authController = require("./controller/authController");
const { requiredFields } = require("../../../controllers/check");
const { validatePassword } = require("../../_util/middlewares/validation");

router.post(
  "/signup",
  requiredFields("name", "email", "password"),
  validatePassword,
  authController.emailSignup
);

router.post(
  "/signin",
  requiredFields("email", "password"),
  authController.emailSignin
);

module.exports = router;
