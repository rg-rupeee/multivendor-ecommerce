const express = require("express");
const OrgUser = require("../../models/OrgUser");
const { protect } = require("../_util/middlewares/authMiddlewares");
const { restrictedFields } = require("../_util/check");
const router = express.Router();
const factory = require("../_util/handlerFactory");

const authRouter = require("./auth/index");
const meRoute = require("./me/index");
const Vendor = require("../../models/Vendor");

router.use("/auth", authRouter);

router.use("/me", meRoute);

// GET - get all <A>
router.get("/", protect(OrgUser), factory.getAll(Vendor, "vendor"));

// GET - get by id < A>
router.get("/:id", protect(OrgUser), factory.getOne(Vendor, "vendor"));

router.patch(
  "/:id",
  protect(OrgUser),
  restrictedFields("password"),
  factory.updateOne(Vendor, "vendor")
);

// DELETE - delete < A>
// TODO: all products should mark vendor as not verified and all of its products as unpublished
router.delete("/:id", protect(OrgUser), factory.deleteOne(Vendor, "vendor"));

module.exports = router;
