const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  name: {
    type: String,
    default: "user",
  },

  admin: {
    type: Boolean,
    default: false,
  },

  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("user", Schema);
