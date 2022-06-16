const express = require('express');
const router = express.Router();

const productStatsRouter = require("./product/index")
router.use("/products",productStatsRouter);
module.exports = router;