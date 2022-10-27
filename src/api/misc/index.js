const express = require("express");
const router = express.Router();
const catchAsync = require("../../utils/catchAsync");
const { requiredFields } = require("../_util/check");
const { sendMail } = require("../../utils/email");

router.post(
  "/sendContactMessage",
  requiredFields("body"),
  catchAsync(async (req, res, next) => {
    const { body } = req.body;
    // console.log(body);

    const data = String(body);

    const response = await sendMail(
      { email: process.env.CONTACT_EMAIL, name: "admin" },
      "Contact Query",
      data
    );

    // console.log(response.data);

    return res.json({
      status: "success",
    });
  })
);

module.exports = router;
