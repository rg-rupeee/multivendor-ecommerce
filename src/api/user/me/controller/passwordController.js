const User = require("../../../../models/User");

const { changePassword } = require("../../../_util/auth");

exports.changePassword = changePassword(User);
