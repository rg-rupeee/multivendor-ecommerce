const express = require('express');
const OrgUser = require('../../../../models/OrgUser');
const { protect } = require('../../../_util/middlewares/authMiddlewares');
const router = express.Router();
const controller = require("./controller/productsStatsController")

router.get(
    "/yearly",
    protect(OrgUser),
    controller.productYearlyStats
)

router.get(
    "/monthly",
    protect(OrgUser),
    controller.productMonthlyStats
)

router.get(
    "/daily",
    protect(OrgUser),
    controller.productDailyStats
);

module.exports = router;
