const express = require("express");
const router = express.Router();
const factory = require("../_util/handlerFactory");
const { protect } = require("../_util/middlewares/authMiddlewares");
const { requiredFields } = require("../_util/check");
const OrgUser = require("../../models/OrgUser");
const User = require("../../models/User");
const Coupon = require("../../models/Coupon");
const couponController = require("./controller/couponController");

router.get(
  "/user/:couponCode",
  protect(User),
  couponController.getCouponByName
);

// GET - get all <A>
router.get("/", protect(OrgUser), factory.getAll(Coupon, "coupon"));

// GET - get by id < A>
router.get("/:id", protect(OrgUser), factory.getOne(Coupon, "coupon"));

// POST - create <A>
router.post(
  "/",
  protect(OrgUser),
  requiredFields("code", "description", "minPurchase", "maxDiscount"),
  factory.createOne(Coupon, "coupon")
);

// DELETE - delete < A>
router.delete("/:id", protect(OrgUser), factory.deleteOne(Coupon, "coupon"));

// PATCH - update <A>
router.patch("/:id", protect(OrgUser), factory.updateOne(Coupon, "coupon"));

module.exports = router;
