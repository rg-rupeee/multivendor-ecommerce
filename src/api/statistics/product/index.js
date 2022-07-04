const express = require('express');
const { protect } = require('../../_util/middlewares/authMiddlewares');
const router = express.Router();

const vendorSpecific = require("./vendor/index");
router.use("/vendor", vendorSpecific);

const adminSpecific = require("./admin/index");
router.use("/admin", adminSpecific);

module.exports = router;
