const express = require('express');
const OrgUser = require('../../../models/OrgUser');
const Vendor = require('../../../models/Vendor');
const { restrictedFields } = require('../../_util/check');
const { protect } = require('../../_util/middlewares/authMiddlewares');
const router = express.Router();
const factory = require("../../_util/handlerFactory");

router.patch(
    "/:id",
    protect(OrgUser),
    restrictedFields("password"),
    factory.updateOne(Vendor,"vendor")
)

router.get(
    "/:id",
    protect(Vendor,OrgUser),
    factory.getOne(Vendor,"vendor")
)

module.exports = router;
