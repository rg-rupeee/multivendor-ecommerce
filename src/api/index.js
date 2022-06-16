const express = require("express");
const router = express.Router();

router.use("/test", (req, res, next) => {
  res.json({
    status: "success",
    message: "Hello from server",
  });
});

const productRoutes = require("./product/index");
router.use("/product", productRoutes);

const adminRoutes = require("./admin/index");
router.use("/admin", adminRoutes);

const blogRoutes = require("./blog/index");
router.use("/blog", blogRoutes);

const categoryRoutes = require("./category/index");
router.use("/category", categoryRoutes);

const orderRoutes = require("./order/index");
router.use("/order", orderRoutes);

const couponRoutes = require("./coupon/index");
router.use("/coupon",couponRoutes);

const payoutRoutes = require("./payout/index");
router.use("/payout", payoutRoutes);

const userRoutes = require("./user/index");
router.use("/user", userRoutes);

const vendorRoutes = require("./vendor/index");
router.use("/vendor", vendorRoutes);

const newsletterRoutes = require("./newsletter/index");
router.use("/newsLetter",newsletterRoutes);

const uploadRoutes = require("./upload/index");
router.use("/upload",uploadRoutes);

module.exports = router;
