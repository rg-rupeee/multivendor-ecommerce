const express = require("express");
const router = express.Router();

const controller = require("./controllers/blogController");

/* get all blogs */
router.get("/", controller.getAllBlogs);

/* get all blogs by categories */
router.get("/category/:categoryId", controller.getBlogsByCategory);

/* get single blog */
router.get("/:blogId", controller.getBlogById);

module.exports = router;
