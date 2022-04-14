const jwt = require("jsonwebtoken");

const catchAsync = require("../../../../utils/catchAsync");
const AppError = require("../../../../utils/AppError");
const User = require("../../../../models/User");

const createSendToken = (user, statusCode, req, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

exports.emailSignin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = User.findOne({ email });

  if (!user) {
    return next(new AppError("User does not exists", 400));
  }

  createSendToken(user, 200, req, res);
});

exports.emailSignup = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne(email);

  if (user) {
    return next(new AppError("User already exists", 400));
  }

  const newUser = await User.create({
    email,
    password,
  });

  //TODO: send welcome email

  createSendToken(newUser, 201, req, res);
});

