const express = require("express");
const router = express.Router();

const authRouter = require("./auth/index");
router.use("/auth", authRouter);

const profileRouter = require("./profile/index");
router.use("profile",profileRouter);

module.exports = router;
