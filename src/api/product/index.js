const express = require("express");
const router = express.Router();

const factory = require("../_util/handlerFactory");
const Product = require("../../models/Product");
const productController = require("./controller/productController");

const reviewRouter = require("./review/index");
const { requiredFields, restrictedFields } = require("../_util/check");
const { protect } = require("../_util/middlewares/authMiddlewares");
const OrgUser = require("../../models/OrgUser");
router.use("/review", reviewRouter);

router.get("/", factory.getAll(Product, "products"));

router.post(
  "/multiple",
  requiredFields("products"),
  productController.getMultipleProducts
);

router.post("/search", requiredFields("searchKey"), productController.search);

router.get("/:id", factory.getOne(Product, "product"));

router.get("/category/:categoryId", productController.getProductsByCategory);

router.post("/", protect(OrgUser), factory.createOne(Product, "product"));

router.delete("/:id", protect(OrgUser), factory.deleteOne(Product, "product"));

module.exports = router;
