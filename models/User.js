const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
  },
  phone: {
    type: Number,
  },
  profile: {
    type: String,
  },
  password: {
    type: String,
  },
});

const User = mongoose.model(userSchema, "User");

module.exports = User;
