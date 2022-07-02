const express = require('express');
const OrgUser = require('../../../models/OrgUser');
const { protect } = require('../../_util/middlewares/authMiddlewares');
const router = express.Router();
const Vendor = require("../../../models/Vendor")
const controller = require("./controller/vendorProductStatisticsController")

router.get(
    "/yearly",
    protect(OrgUser,Vendor),
    controller.vendorProductYearlyStats
)

router.get(
    "/monthly",
    protect(OrgUser,Vendor),
    controller.vendorProductMonthlyStats
)

router.get(
    "/daily",
    protect(OrgUser,Vendor),
    controller.vendorProductDailyStats
);

module.exports = router;
