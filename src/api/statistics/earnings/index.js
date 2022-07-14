const express = require('express');
const router = express.Router();

adminEarningsStatsRoute = require("./admin/index");
router.use("/admin", adminEarningsStatsRoute);

vendorEarningsStatsRoute = require("./vendor/index");
router.use("/vendor", vendorEarningsStatsRoute);

module.exports = router;