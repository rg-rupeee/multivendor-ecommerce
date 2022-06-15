const express = require("express");
const OrgUser = require("../../../models/OrgUser");
const { protect } = require("../../_util/middlewares/authMiddlewares");
const router = express.Router();
const orgUserController = require("./controller/orgUserController");
const factory = require("../../_util/handlerFactory");
const { requiredFields } = require("../../_util/check");

router.get(
  "/:id",
  protect(OrgUser, "orgUser"),
  factory.getOne(OrgUser, "orgUser")
);

router.post(
  "/",
  requiredFields("email", "name", "password"),
  protect(OrgUser, "orgUser"),
  orgUserController.createOrgUser
);

module.exports = router;