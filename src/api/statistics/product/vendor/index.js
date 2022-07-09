const express = require('express');
const OrgUser = require('../../../../models/OrgUser');
const { protect } = require('../../../_util/middlewares/authMiddlewares');
const router = express.Router();
const Vendor = require("../../../../models/Vendor")
const controller = require("./controller/vendorProductStatisticsController")

router.get(
    "/yearly",
    protect(Vendor),
    controller.vendorProductYearlyStats
)

router.post(
    "/monthly",
    protect(Vendor),
    controller.vendorProductMonthlyStats
)

router.post(
    "/daily",
    protect(Vendor),
    controller.vendorProductDailyStats
);

module.exports = router;
