const express = require("express");
const router = express.Router();

const profileController = require("./controller/profileController");
const passwordController = require("./controller/passwordController");
const { restrictedFields, requiredFields } = require("../../_util/check");
const { protect } = require("../../_util/middlewares/authMiddlewares");

const User = require("../../../models/User");

router.patch(
  "/changePassword",
  protect(User),
  requiredFields("oldPassword", "newPassword"),
  passwordController.changePassword
);

// TODO
// router.post("/forgetPassword");

router.patch(
  "/profile",
  protect(User),
  restrictedFields(
    "password",
    "passwordChangedAt",
    "passwordResetToken",
    "passwordResetExpires"
  ),
  profileController.updateProfile
);

router.get("/profile", protect(User), profileController.getMyProfile);

module.exports = router;
