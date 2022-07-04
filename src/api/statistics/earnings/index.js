const express = require('express');
const OrgUser = require('../../../models/OrgUser');
const { protect } = require('../../_util/middlewares/authMiddlewares');
const router = express.Router();
const controller = require("./controller/earningsStatsController")

router.get(
    "/yearly",
    protect(OrgUser),
    controller.earningsYearlyStats
)

router.get(
    "/monthly",
    protect(OrgUser),
    controller.earningsMonthlyStats
)

router.get(
    "/daily",
    protect(OrgUser),
    controller.earningsDailyStats
);

module.exports = router;