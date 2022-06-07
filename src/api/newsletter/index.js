const express = require("express");
const NewsLetter = require("../../models/NewsLetter");
const router = express.Router();
const factory = require("../_util/handlerFactory")
const newsletterController = require("./controller/newsletterController")

router.post(
    "/subscribe",
    factory.createOne(NewsLetter,"newsletter")
);

router.delete(
    "/unsubscribe",
    factory.deleteOne(NewsLetter,"newsletter")
);

router.post(
    "send",
    newsletterController.sendNewsLetter
)
module.exports = router;