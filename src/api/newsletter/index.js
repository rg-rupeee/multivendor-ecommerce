const express = require("express");
const NewsLetter = require("../../models/NewsLetter");
const User = require("../../models/User");
const router = express.Router();
const factory = require("../_util/handlerFactory");
const { protect } = require("../_util/middlewares/authMiddlewares");
const newsletterController = require("./controller/newsletterController")

router.post(
    "/subscribe",
    protect(User),
    newsletterController.subscribe
);

router.delete(
    "/unsubscribe",
    protect(User),
    newsletterController.unsubscribe
);

router.post(
    "send",
    newsletterController.sendNewsLetter
)
module.exports = router;
