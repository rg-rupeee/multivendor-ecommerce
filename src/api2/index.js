const express = require("express");
const router = express.Router();

const productRoutes = require("./product/index");
const userRoutes = require("./user/index");
const blogRoutes = require("./blog/index");

router.use("/test", (req, res, next) => {
  res.json({
    status: "success",
    message: "Hello from server",
  });
});

router.use("/products", productRoutes);

router.use("/user", userRoutes);

router.use("/blog", blogRoutes);

module.exports = router;
