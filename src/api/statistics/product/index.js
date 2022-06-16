const express = require('express');
const router = express.Router();
const controller = require("./controller/productsStatsController")

router.get(
    "/",
    controller.productWeeklyStats
)
module.exports = router;