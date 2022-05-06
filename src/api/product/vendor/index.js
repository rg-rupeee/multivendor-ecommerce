const express = require("express");
const { protect } = require("../../_util/middlewares/authMiddlewares");
const router = express.Router();
const controller = require("../controller/productController");
const factory = require("../../_util/handlerFactory");
const Vendor = require("../../../models/Vendor");
const Product = require("../../../models/Product");

//  GET - get vendor’s products <V>
router.get(
    "/",
    protect(Vendor),
    controller.getProducts
)
// GET - get by id <V> (check)
router.get(
    "/:id",
    protect(Vendor),
    controller.getProductById
)
// POST - create <V>
router.post(
    "/",
    protect(Vendor),
    controller.createProduct
)
// DELETE - delete <V, A> (check)
router.delete(
    "/:id",
    protect(Vendor),
    factory.deleteOne(Product,"product")
)
// PATCH - update <V> (check)
router.patch(
    "/:id",
    protect(Vendor),
    factory.updateOne(Product,"product")
)

module.exports = router;