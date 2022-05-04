const jwt = require("jsonwebtoken");
const validator = require("validator");

const catchAsync = require("../../../../utils/catchAsync");
const AppError = require("../../../../utils/appError");
const OrgUser = require("../../../../models/OrgUser");

const { createSendToken } = require("../../../_util/token");
const { emailSignin } = require("../../../_util/auth");
const { sendMail, sendMailViaTemplate } = require("../../../../utils/email");

exports.emailSignin = emailSignin(OrgUser);

exports.emailSignup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!validator.isEmail(email)) {
    return next(new AppError("Please provide a valid email", 400));
  }

  const orgUser = await OrgUser.findOne({ email });

  if (orgUser) {
    return next(new AppError("User already exists", 400));
  }

  const newOrgUser = await OrgUser.create({
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

  createSendToken(newOrgUser, 201, req, res);
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
  
    const orgUser = await OrgUser.findOne({ email });
  
    if (!orgUser) {
      return next(new AppError(`No user exists with email: ${email}`, 400));
    }
  
    const otp = Math.floor(1000 + Math.random() * 9000);
    const passwordResetExpires = Date.now() + 60 * 60 * 60;
  
    await OrgUser.findOneAndUpdate(
      { _id: orgUser._id },
      {
        passwordResetOTP: otp,
        passwordResetExpires,
        passwordResetAttempts: 0,
      }
    );
  
    // send mail
    await sendMail(
      { name: orgUser.name, email },
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
  
    const orgUser = await OrgUser.findOne({ email });
  
    if (!orgUser) {
      return next(new AppError(`No user exists with email: ${email}`, 400));
    }
  
    if (orgUser.passwordResetOTP == otp) {
      if (orgUser.passwordResetExpires < Date.now()) {
        return res.status(401).json({
          status: "fail",
          message: "OTP expired",
        });
      }
  
      orgUser.password = password;
      orgUser.passwordResetOTP = undefined;
      await orgUser.save();
    } else {
      if (orgUser.passwordResetAttempts > 5) {
        await OrgUser.findOneAndUpdate(
          { _id: orgUser._id },
          {
            $unset: { passwordResetOTP: 1 },
          }
        );
        return res.status(400).json({
          status: "fail",
          message: "Invalid OTP. Password reset attemp exeeded!!!",
        });
      } else {
        await OrgUser.findOneAndUpdate(
          { _id: orgUser._id },
          {
            passwordResetAttempts: orgUser.passwordResetAttempts + 1,
          }
        );
        return res.status(400).json({
          status: "fail",
          message: "invalid otp",
        });
      }
    }
  
    createSendToken(orgUser, 200, req, res);
  });