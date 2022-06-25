const express = require("express");
const router = express.Router();

const factory = require("../_util/handlerFactory");
const Category = require("../../models/Category");
const OrgUser = require("../../models/OrgUser");

const { protect } = require("../_util/middlewares/authMiddlewares");
const { requiredFields } = require("../_util/check");

router.get("/", factory.getAll(Category, "categories"));

router.get("/:id", factory.getOne(Category, "category"));

router.delete(
  "/:id",
  protect(OrgUser),
  factory.deleteOne(Category, "category")
);

router.post("/", protect(OrgUser), factory.createOne(Category, "category"));

router.post("/search",requiredFields("searchKey"), factory.search(Category,'name'));
module.exports = router;
