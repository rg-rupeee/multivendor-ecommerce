const express = require("express");
const Vendor = require("../../models/Vendor");
const { protect } = require("../_util/middlewares/authMiddlewares");
const router = express.Router();
const factory = require("../_util/handlerFactory")
const Order = require("../../models/Order");
const OrgUser = require("../../models/OrgUser");

// GET - get all <V,>
router.get(
    "/",
    protect(Vendor),
    factory.getAll(Order,"Order")
);

// GET - get vendors orders <V>


// GET - get by id <V, A> (check)
router.get(
    "/:id",
    protect(Vendor,OrgUser),
    factory.getOne(Order,"Order")
);

// POST - create <V>
router.post(
    "/",
    protect(Vendor),
    factory.createOne(Order,"Order")
);
// PATCH - update <V, A,> (check)

module.exports = router;
