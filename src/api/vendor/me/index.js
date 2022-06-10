const express = require("express");
const OrgUser = require("../../../models/OrgUser");
const Vendor = require("../../../models/Vendor");
const { restrictedFields } = require("../../_util/check");
const { protect } = require("../../_util/middlewares/authMiddlewares");
const router = express.Router();
const factory = require("../../_util/handlerFactory");
const profileController = require("./controller/profileController");

router.patch(
  "/profile",
  restrictedFields("isVerified", "password"),
  protect(Vendor),
  profileController.updateProfile
);

router.get("/profile", protect(Vendor), profileController.getMyProfile);

module.exports = router;
