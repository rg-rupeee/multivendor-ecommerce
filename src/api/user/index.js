const express = require("express");
const router = express.Router();

const { protect } = require("../_util/middlewares/authMiddlewares");
const factory = require("../_util/handlerFactory");
const OrgUser = require("../../models/OrgUser");
const User = require("../../models/User");
const { requiredFields } = require("../_util/check");

router.get("/all", protect(OrgUser), factory.getAll(User));

router.get("/all/:id", protect(OrgUser), factory.getOne(User));

router.post(
  "/search",
  requiredFields("searchKey"),
  factory.search(User, "email")
);

const meRouter = require("./me/index");
router.use("/me", meRouter);

const authRouter = require("./auth/index");
router.use("/auth", authRouter);

const cartRouter = require("./cart/index");
router.use("/cart", cartRouter);

const wishlistRouter = require("./wishlist/index");
router.use("/wishlist", wishlistRouter);

module.exports = router;
