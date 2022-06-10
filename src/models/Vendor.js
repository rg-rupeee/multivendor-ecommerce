const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const vendorSchema = new mongoose.Schema({
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
  isVerified : {
    type : Boolean,
    require : true,
    default : false
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

vendorSchema.pre("save", async function (next) {
  // If password is not modified return
  if (!this.isModified("password")) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 8);

  next();
});

vendorSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

vendorSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

vendorSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
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

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
