const jwt = require("jsonwebtoken");
const validator = require("validator");

const catchAsync = require("../../../../utils/catchAsync");
const AppError = require("../../../../utils/AppError");
const User = require("../../../../models/User");

const { createSendToken } = require("../../../_util/token");
const { emailSignin } = require("../../../_util/auth");

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

  //TODO: send welcome email

  createSendToken(newUser, 201, req, res);
});
