const express = require("express");
const router = express.Router();

const factory = require("../_util/handlerFactory");
const Product = require("../../models/Product");
const productController = require("./controller/productController");

const reviewRouter = require("./review/index");
const { requiredFields, restrictedFields } = require("../_util/check");
const {
  protect,
  optionalProtect,
} = require("../_util/middlewares/authMiddlewares");
const OrgUser = require("../../models/OrgUser");
const User = require("../../models/User");
router.use("/review", reviewRouter);

router.get("/", optionalProtect(User), productController.getAllProducts);

router.post(
  "/multiple",
  requiredFields("products"),
  productController.getMultipleProducts
);

router.post("/search", requiredFields("searchKey"), factory.search(Product,'name'));

router.get("/:id", optionalProtect(User), productController.getOneProduct);

router.get("/category/:categoryId", productController.getProductsByCategory);

router.post("/", protect(OrgUser), factory.createOne(Product, "product"));

router.delete("/:id", protect(OrgUser), factory.deleteOne(Product, "product"));

module.exports = router;
