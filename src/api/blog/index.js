const express = require("express");
const router = express.Router();
const { protect } = require("../_util/middlewares/authMiddlewares");
const { requiredFields } = require("../_util/check");
const factory = require("../_util/handlerFactory");
const Blog = require("../../models/Blog");
const OrgUser = require("../../models/OrgUser");

router.get("/:id", factory.getOne(Blog, "blog"));

// GET - get all <A>
router.get("/", factory.getAll(Blog, "blogs"));

// GET - get by id < A>
router.get("/:id", factory.getOne(Blog, "blogs"));

// POST - create <A>
router.post(
  "/",
  protect(OrgUser),
  requiredFields(
    "title",
    "publishingDate",
    "coverImage",
    "thumbnailImage",
    "blogData",
    "slug"
  ),
  factory.createOne(Blog, "blogs")
);

// DELETE - delete < A>
router.delete("/:id", protect(OrgUser), factory.deleteOne(Blog, "blogs"));

// PATCH - update <A>
router.patch("/:id", protect(OrgUser), factory.updateOne(Blog, "blogs"));

module.exports = router;
