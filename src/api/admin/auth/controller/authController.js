const OrgUser = require("../../../../models/OrgUser");

const {
  emailSignin,
  emailSignup,
  forgetPassword,
  resetPassword,
} = require("../../../_util/auth");

exports.emailSignin = emailSignin(OrgUser);

exports.emailSignup = emailSignup(OrgUser, 2);

exports.forgetPassword = forgetPassword(OrgUser, "orgUser");

exports.resetPassword = resetPassword(OrgUser);
