const express = require("express");
const OrgUser = require("../../../models/OrgUser");
const { protect } = require("../../_util/middlewares/authMiddlewares");
const router = express.Router();
const orgUserController = require("./controller/orgUserController");
const factory = require("../../_util/handlerFactory");
const { requiredFields } = require("../../_util/check");

router.get("/:id", protect(OrgUser), factory.getOne(OrgUser, "orgUser"));

router.delete("/:id", protect(OrgUser), factory.deleteOne(OrgUser, "orgUser"));

router.post(
  "/",
  requiredFields("email", "name", "password"),
  protect(OrgUser),
  orgUserController.createOrgUser
);

router.get("/", protect(OrgUser), factory.getAll(OrgUser, "orgUser"));

module.exports = router;
