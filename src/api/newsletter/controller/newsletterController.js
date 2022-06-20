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
  const id = req.user.id;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User with this email do not exists", 404));
  }

  const email = user.email;
  let newsLetter = await NewsLetter.findOne({ email: email });

  if (newsLetter != null)
    return res.json({
      status: "success",
      message: "Already subscribed to newsletter",
    });

  newsletter = new NewsLetter({ email });

  await newsletter.save();

  return res.json({
    status: "success",
    message: "Subscribed to newsletter",
  });
});

exports.unsubscribe = catchAsync(async (req, res, next) => {
  const id = req.user.id;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("User with this email do not exists", 404));
  }

  const email = user.email;
  await NewsLetter.deleteOne({ email: email });

  return res.json({
    status: "success",
    message: "Unsubscribed to newsletter",
  });
});
