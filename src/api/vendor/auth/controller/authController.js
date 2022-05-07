const jwt = require("jsonwebtoken");
const validator = require("validator");

const catchAsync = require("../../../../utils/catchAsync");
const AppError = require("../../../../utils/appError");
const Vendor = require("../../../../models/Vendor");

const {
  emailSignin,
  emailSignup,
  forgetPassword,
  resetPassword,
} = require("../../../_util/auth");

exports.emailSignin = emailSignin(Vendor);

exports.emailSignup = emailSignup(Vendor, 2);

exports.forgetPassword = forgetPassword(Vendor, "vendor");

exports.resetPassword = resetPassword(Vendor);
