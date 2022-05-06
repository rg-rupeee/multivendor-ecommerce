const jwt = require("jsonwebtoken");
const validator = require("validator");

const catchAsync = require("../../../../utils/catchAsync");
const AppError = require("../../../../utils/appError");
const OrgUser = require("../../../../models/OrgUser");

const {
  emailSignin,
  emailSignup,
  forgetPassword,
  resetPassword,
} = require("../../../_util/auth");
const { sendMail, sendMailViaTemplate } = require("../../../../utils/email");

exports.emailSignin = emailSignin(OrgUser);

exports.emailSignup = emailSignup(OrgUser, 2);

exports.forgetPassword = forgetPassword(OrgUser, "orgUser");

exports.resetPassword = resetPassword(OrgUser);
