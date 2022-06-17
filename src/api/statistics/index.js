const express = require('express');
const router = express.Router();

const productStatsRouter = require("./product/index");
router.use("/product",productStatsRouter);

const userStatsRouter = require("./user/index");
router.use("/user",userStatsRouter);

module.exports = router;
