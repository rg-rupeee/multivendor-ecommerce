const express = require("express");
const router = express.Router();

const factory = require("../_util/handlerFactory");
const Category = require("../../models/Category");

router.get("/", factory.getAll(Category, "categories"));

router.get("/:id", factory.getOne(Category, "category"));

// TO be removed
router.post("/", factory.createOne(Category, "category"));

module.exports = router;
