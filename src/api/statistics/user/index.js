const express = require('express');
const OrgUser = require('../../../models/OrgUser');
const { protect } = require('../../_util/middlewares/authMiddlewares');
const router = express.Router();
const controller = require("./controller/userStatsController")

router.get(
    "/yearly",
    protect(OrgUser),
    controller.userYearlyStats
)

router.post(
    "/monthly",
    protect(OrgUser),
    controller.userMonthlyStats
)

router.post(
    "/daily",
    protect(OrgUser),
    controller.userDailyStats
);

module.exports = router;
