const express = require("express");
const router = express.Router();

const authRouter = require("./auth/index");
router.use("/auth", authRouter);

const orgUserRouter = require("./orgUser/index");
router.use("/orguser", orgUserRouter);

const meRouter = require("./me/index");
router.use("/me", meRouter);

module.exports = router;
