const express = require("express");
const OrgUser = require("../../../models/OrgUser");
const { protect } = require("../../_util/middlewares/authMiddlewares");
const router = express.Router();
const profileController = require("./controller/profileController");
const factory = require("../../_util/handlerFactory")

router.get(
    "/me",
    protect(OrgUser,"orgUser"),
    profileController.getMyProfile
);

router.patch(
    "/me",
    protect(OrgUser,"orgUser"),
    profileController.updateProfile
);

router.get(
    "/:id",
    protect(OrgUser,"orgUser"),
    factory.getOne(OrgUser,"orgUser")
);

router.post(
    "/",
    protect(OrgUser,"orgUser"),
    profileController.creatAdminProfile
)
module.exports = router;