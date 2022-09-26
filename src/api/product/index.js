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
const Vendor = require("../../models/Vendor");
router.use("/review", reviewRouter);

router.get("/", optionalProtect(User), productController.getAllProducts);

router.post("/count", productController.getCount);

router.post(
  "/multiple",
  requiredFields("products"),
  productController.getMultipleProducts
);

router.post(
  "/search",
  requiredFields("searchKey"),
  factory.search(Product, "name")
);

router.post(
  "/vendor/search",
  protect(Vendor),
  requiredFields("searchKey"),
  productController.searchVendorProduct("name")
);

// router
router.get(
  "/vendor/my",
  protect(Vendor),
  productController.getProductsByVendor
);

router.get("/:id", optionalProtect(User), productController.getOneProduct);

router.get("/category/:categoryId", productController.getProductsByCategory);

router.get("/category/slug/:slug", productController.getProductsByCategorySlug);

router.post("/", protect(Vendor), productController.createVendorProduct);

router.patch("/:id", protect(Vendor), factory.updateOne(Product, "product"));

router.delete(
  "/:id",
  protect(OrgUser, Vendor),
  factory.deleteOne(Product, "product")
);

module.exports = router;
