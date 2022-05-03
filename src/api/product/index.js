const express = require("express");
const router = express.Router();

const factory = require("../_util/handlerFactory");
const Product = require("../../models/Product");
const productController = require("./controller/productController");

const reviewRouter = require("./review/index");
const { requiredFields } = require("../_util/check");
router.use("/review", reviewRouter);

router.get("/", factory.getAll(Product, "products"));

router.get(
  "/multiple",
  requiredFields("products"),
  productController.getMultipleProducts
);

router.get("/:id", factory.getOne(Product, "product"));

router.get("/category/:categoryId", productController.getProductsByCategory);

// TO be removed
router.post("/", factory.createOne(Product, "product"));

module.exports = router;
