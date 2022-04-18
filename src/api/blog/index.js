const express = require("express");
const router = express.Router();

const factory = require("../_util/handlerFactory");
const Blog = require("../../models/Blog");

router.get("/", factory.getAll(Blog, "blogs"));

router.get("/:id", factory.getOne(Blog, "blog"));

// TO be removed
router.post("/", factory.createOne(Blog, "blog"));

module.exports = router;
