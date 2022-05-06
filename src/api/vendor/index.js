const express = require("express");
const { protect } = require("../_util/middlewares/authMiddlewares");
const router = express.Router();
const authRouter = require("./auth/index");

router.use("/auth", authRouter);

module.exports = router;
