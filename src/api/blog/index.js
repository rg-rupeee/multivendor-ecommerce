const express = require("express");
const router = express.Router();
const { protect } = require("../_util/middlewares/authMiddlewares");
const factory = require("../_util/handlerFactory");
const Blog = require("../../models/Blog");
const OrgUser = require("../../models/OrgUser");

router.get("/:id", factory.getOne(Blog, "blog"));

// GET - get all <A>
router.get("/", protect(OrgUser), factory.getAll(Blog, "blogs"));

// GET - get by id < A>
router.get("/:id", protect(OrgUser), factory.getOne(Blog, "blogs"));

// POST - create <A>
router.post("/", protect(OrgUser), factory.createOne(Blog, "blogs"));

// DELETE - delete < A>
router.delete("/:id", protect(OrgUser), factory.deleteOne(Blog, "blogs"));

// PATCH - update <A>
router.patch("/:id", protect(OrgUser), factory.updateOne(Blog, "blogs"));

module.exports = router;
