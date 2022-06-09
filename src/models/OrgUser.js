const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const orgUserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  role : {
    type : [String],
    enum : ["Vendor","User","Product","Blog","Admin","Newsletter","Payout","Order","Coupon","Category",""],
    default : ["Vendor"],
    required : true
  },
  profile: {
    type: String,
  },
  password: {
    type: String,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetOTP: Number,
  passwordResetExpires: Date,
  passwordResetAttempts: Number,
});

orgUserSchema.pre("save", async function (next) {
  // If password is not modified return
  if (!this.isModified("password")) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 8);

  next();
});

orgUserSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

orgUserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

orgUserSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const OrgUser = mongoose.model("OrgUser", orgUserSchema);

module.exports = OrgUser;
