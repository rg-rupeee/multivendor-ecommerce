const catchAsync = require("../../../utils/catchAsync");
const factory = require("../../_util/handlerFactory");
const { sendMail } = require("../../../utils/email");
const NewsLetter = require("../../../models/NewsLetter");
const User = require("../../../models/User");
const AppError = require("../../../utils/appError");

exports.sendNewsLetter = catchAsync(async (req, res, next) => {
  const { htmlContent, subject } = req.body;

  const newsletters = await NewsLetter.find();

  for (const document of newsletters) {
    await sendMail(
      {
        email: document.email,
        name: "user",
      },
      subject,
      htmlContent
    );
  }

  return res.json({
    status: "success",
    message: "NewsLetters sent",
  });
});

exports.subscribe = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  let newsLetter = await NewsLetter.findOne({ email: email });

  if (!newsLetter) {
    newsLetter = await NewsLetter.create({ email });
  }

  const subject = "Varnudais | Subscribed to Newsletter!";
  const htmlContent = "Thank you for signing up for the newsletter!";

  await sendMail(
    {
      email,
      name: "user",
    },
    subject,
    htmlContent
  );

  return res.json({
    status: "success",
    message: "Subscribed to newsletter",
  });
});

exports.unsubscribe = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const newsLetter = await NewsLetter.findOne({ email: email });

  if (newsLetter) {
    await NewsLetter.deleteOne({ email: email });
  }

  return res.json({
    status: "success",
    message: "Unsubscribed to newsletter",
  });
});
