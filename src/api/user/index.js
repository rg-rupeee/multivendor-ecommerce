const express = require("express");
const router = express.Router();

const meRouter = require("./me/index");
router.use("/me", meRouter);

const authRouter = require("./auth/index");
router.use("/auth", authRouter);

const cartRouter = require("./cart/index");
router.use("/cart", cartRouter);

const wishlistRouter = require("./wishlist/index");
router.use("/wishlist", wishlistRouter);

module.exports = router;
