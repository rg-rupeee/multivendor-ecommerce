const express = require('express');
const router = express.Router();

const earningsStatistics = require('./earnings/index');
router.use('/earnings', earningsStatistics);

const productStatsRouter = require("./product/index");
router.use("/product",productStatsRouter);

const userStatsRouter = require("./user/index");
router.use("/user",userStatsRouter);

module.exports = router;
