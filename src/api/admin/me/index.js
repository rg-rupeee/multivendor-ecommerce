const express = require("express");
const OrgUser = require("../../../models/OrgUser");
const { protect } = require("../../_util/middlewares/authMiddlewares");
const { requiredFields } = require("../../_util/check");
const router = express.Router();

const profileController = require("./controller/profileController");
const { changePassword } = require("../../_util/auth");

router.get(
  "/profile",
  protect(OrgUser, "orgUser"),
  profileController.getMyProfile
);

router.patch(
  "/profile",
  protect(OrgUser, "orgUser"),
  profileController.updateProfile
);

router.patch(
  "/changePassword",
  protect(OrgUser),
  requiredFields("oldPassword", "newPassword"),
  changePassword(OrgUser)
);

module.exports = router;
