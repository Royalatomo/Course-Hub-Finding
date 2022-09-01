const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  img: {
    type: String,
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  info: {
    type: Object,
    required: true,
  },

  instructors: {
    type: Array,
    required: true,
  },

  lastUpdated: {
    type: String,
    required: true,
  },

  topics: {
    type: Array,
    required: true,
  },

  links: {
    type: Object,
    required: true,
  },

  trailer: {
    type: String,
    required: true,
  },

  content: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("course", Schema);
