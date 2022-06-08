const express = require("express");
const OrgUser = require("../../../models/OrgUser");
const { protect } = require("../../_util/middlewares/authMiddlewares");
const router = express.Router();
const profileController = require("./profile/controller/profileController");
const factory = require("../../_util/handlerFactory")

router.get(
    "/profile",
    protect(OrgUser,"orgUser"),
    profileController.getMyProfile
);

router.patch(
    "/profile",
    protect(OrgUser,"orgUser"),
    profileController.updateProfile
);

module.exports = router;