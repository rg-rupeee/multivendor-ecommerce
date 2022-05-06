const User = require("../../../../models/User");

const {
  emailSignin,
  emailSignup,
  forgetPassword,
  resetPassword,
} = require("../../../_util/auth");

exports.emailSignin = emailSignin(User);

exports.emailSignup = emailSignup(User, 2);

exports.forgetPassword = forgetPassword(User, "user");

exports.resetPassword = resetPassword(User);
