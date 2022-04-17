const express = require("express");
const router = express.Router();

const factory = require("../_util/handlerFactory");
const Product = require("../../models/Product");

router.get("/", factory.getAll(Product, "products"));

router.get("/:id", factory.getOne(Product, "product"));

router.post("/", factory.createOne(Product, "product"));

module.exports = router;
