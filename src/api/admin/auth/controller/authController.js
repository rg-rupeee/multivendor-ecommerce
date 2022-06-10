const jwt = require("jsonwebtoken");
const validator = require("validator");

const catchAsync = require("../../../../utils/catchAsync");
const AppError = require("../../../../utils/appError");
const OrgUser = require("../../../../models/OrgUser");

const {
  emailSignin,
  forgetPassword,
  resetPassword,
} = require("../../../_util/auth");
const { sendMail, sendMailViaTemplate } = require("../../../../utils/email");

exports.emailSignin = emailSignin(OrgUser);

exports.forgetPassword = forgetPassword(OrgUser, "orgUser");

exports.resetPassword = resetPassword(OrgUser);
