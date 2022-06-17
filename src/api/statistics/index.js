const express = require('express');
const router = express.Router();

const productStatsRouter = require("./product/index")
router.use("/product",productStatsRouter);
module.exports = router;