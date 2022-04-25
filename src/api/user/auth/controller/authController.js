const jwt = require("jsonwebtoken");
const validator = require("validator");

const catchAsync = require("../../../../utils/catchAsync");
const AppError = require("../../../../utils/appError");
const User = require("../../../../models/User");

const { createSendToken } = require("../../../_util/token");
const { emailSignin } = require("../../../_util/auth");
const { sendMailViaTemplate } = require("../../../../utils/email");

exports.emailSignin = emailSignin(User);

exports.emailSignup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!validator.isEmail(email)) {
    return next(new AppError("Please provide a valid email", 400));
  }

  const user = await User.findOne({ email });

  if (user) {
    return next(new AppError("User already exists", 400));
  }

  const newUser = await User.create({
    name,
    email,
    password,
  });

  if (!name) name = "New User";
  const to = {
    email,
    name,
  };
  await sendMailViaTemplate(to, 2);

  createSendToken(newUser, 201, req, res);
});
