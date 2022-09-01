const mongoose = require("mongoose");

// 0 - Delete Course
// 1 - Register Admin User
// 2 - Reset Password Admin User

const Schema = mongoose.Schema({
  verifyFor: {
    type: Number,
    required: true
  },

  email: {
    type: String,
    required: true,
  },

  code: {
    type: String,
    required: true,
  },

  tried: {
    type: Number,
    default: 5,
  }
});

module.exports = mongoose.model("verify", Schema);
