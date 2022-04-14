const express = require("express");
const router = express.Router();

const authRouter = require("./auth/index");
router.use("/auth", authRouter);

const cartRouter = require("./cart/index");
router.use("/cart", cartRouter);

const wishlistRouter = require("./wishlist/index");
router.use("/wishlist", wishlistRouter);

module.exports = router;
