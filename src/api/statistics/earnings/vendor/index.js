const express = require('express');
const Vendor = require('../../../../models/Vendor');
const { protect } = require('../../../_util/middlewares/authMiddlewares');
const router = express.Router();
const controller = require("./controller/vendorEarningsStatsController")

router.get(
    "/yearly",
    protect(Vendor),
    controller.earningsYearlyStats
)

router.post(
    "/monthly",
    protect(Vendor),
    controller.earningsMonthlyStats
)

router.post(
    "/daily",
    protect(Vendor),
    controller.earningsDailyStats
);

module.exports = router;