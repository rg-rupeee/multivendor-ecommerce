const express = require("express");
const OrgUser = require("../../models/OrgUser");
const { protect } = require("../_util/middlewares/authMiddlewares");
const router = express.Router();
const factory = require("../_util/handlerFactory");

const authRouter = require("./auth/index");
const Vendor = require("../../models/Vendor");
router.use("/auth", authRouter);

// GET - get all <A>
router.get(
    "/",
    protect(OrgUser),
    factory.getAll(Vendor,"vendor")
);
// GET - get by id < A>
router.get(
    "/:id",
    protect(OrgUser),
    factory.getOne(Vendor,"vendor")
);
// DELETE - delete < A>
router.delete(
    "/:id",
    protect(OrgUser),
    factory.deleteOne(Vendor,"vendor")
);

module.exports = router;
