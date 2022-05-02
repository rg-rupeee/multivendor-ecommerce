const jwt = require("jsonwebtoken");
const validator = require("validator");

const catchAsync = require("../../../../utils/catchAsync");
const AppError = require("../../../../utils/appError");
const User = require("../../../../models/User");

const { createSendToken } = require("../../../_util/token");
const { emailSignin } = require("../../../_util/auth");
const { sendMail, sendMailViaTemplate } = require("../../../../utils/email");
const { findOneAndUpdate } = require("../../../../models/User");

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

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError(`No user exists with email: ${email}`, 400));
  }

  const otp = Math.floor(1000 + Math.random() * 9000);
  const passwordResetExpires = Date.now() + 60 * 60 * 60;

  await User.findOneAndUpdate(
    { _id: user._id },
    {
      passwordResetOTP: otp,
      passwordResetExpires,
      passwordResetAttempts: 0,
    }
  );

  // send mail
  await sendMail(
    { name: user.name, email },
    "Password Reset Token",
    `<p>Your Password Reset code is <b>${otp}</b><p><br><p><i>The OTP is valid only for 10 minutes</i></p>`
  );

  return res.json({
    status: "success",
    message: "OTP sent on mail",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { email, password, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return next(new AppError(`No user exists with email: ${email}`, 400));
  }

  if (user.passwordResetOTP == otp) {
    if (user.passwordResetExpires < Date.now()) {
      return res.status(401).json({
        status: "fail",
        message: "OTP expired",
      });
    }

    user.password = password;
    user.passwordResetOTP = undefined;
    await user.save();
  } else {
    if (user.passwordResetAttempts > 5) {
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          $unset: { passwordResetOTP: 1 },
        }
      );
      return res.status(400).json({
        status: "fail",
        message: "Invalid OTP. Password reset attemp exeeded!!!",
      });
    } else {
      await User.findOneAndUpdate(
        { _id: user._id },
        {
          passwordResetAttempts: user.passwordResetAttempts + 1,
        }
      );
      return res.status(400).json({
        status: "fail",
        message: "invalid otp",
      });
    }
  }

  createSendToken(user, 200, req, res);
});
