const express = require("express");
const router = express.Router();

const authRouter = require("./auth/index");
router.use("/auth", authRouter);

const profileRouter = require("./profile/index");
router.use("/profile",profileRouter);

const meRouter = require("./me/index");
router.use("/me",meRouter);

module.exports = router;
