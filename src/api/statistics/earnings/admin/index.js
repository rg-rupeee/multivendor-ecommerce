const express = require('express');
const OrgUser = require('../../../../models/OrgUser');
const { protect } = require('../../../_util/middlewares/authMiddlewares');
const router = express.Router();
const controller = require("./controller/adminEarningsStatsController")

router.get(
    "/yearly",
    protect(OrgUser),
    controller.earningsYearlyStats
)

router.post(
    "/monthly",
    protect(OrgUser),
    controller.earningsMonthlyStats
)

router.post(
    "/daily",
    protect(OrgUser),
    controller.earningsDailyStats
);

module.exports = router;