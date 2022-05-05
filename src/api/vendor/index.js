const express = require("express");
const Vendor = require("../../models/Vendor");
const { protect } = require("../_util/middlewares/authMiddlewares");
const router = express.Router();
const factory = require("../_util/handlerFactory")
const controller = require("../product/controller/productController")
const authRouter = require("./auth/index");
const Product = require("../../models/Product");
router.use("/auth", authRouter);


//  GET - get vendor’s products <V>
router.get(
    "/getVendorProducts",
    protect(Vendor),
    controller.getProducts
)
// GET - get by id <V> (check)
router.get(
    "/getProductById/:id",
    protect(Vendor),
    controller.getProductById
)
// POST - create <V>
router.post(
    "/addProduct",
    protect(Vendor),
    controller.createProduct
)
// DELETE - delete <V, A> (check)
router.delete(
    "/deleteProduct/:id",
    protect(Vendor),
    factory.deleteOne(Product,"product")
)
// PATCH - update <V> (check)
router.patch(
    "/updateProduct/:id",
    protect(Vendor),
    factory.updateOne(Product,"product")
)

module.exports = router;
