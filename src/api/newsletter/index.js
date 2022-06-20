const express = require("express");
const NewsLetter = require("../../models/NewsLetter");
const User = require("../../models/User");
const router = express.Router();
const factory = require("../_util/handlerFactory");
const { protect } = require("../_util/middlewares/authMiddlewares");
const { requiredFields } = require("../_util/check");
const newsletterController = require("./controller/newsletterController");
const OrgUser = require("../../models/OrgUser");

router.post("/subscribe", newsletterController.subscribe);

router.delete("/unsubscribe", newsletterController.unsubscribe);

router.post(
  "/send",
  protect(OrgUser),
  requiredFields("subject", "htmlContent"),
  newsletterController.sendNewsLetter
);

module.exports = router;
