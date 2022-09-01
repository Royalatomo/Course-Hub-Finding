const mongoose = require("mongoose");

const Schema = mongoose.Schema({
  carousel: {
    type: Array,
    default: [],
  },

  categories: {
    type: Array,
    default: [],
  },

  topCat: {
    type: Array,
    default: [],
  },

  section: {
    type: Array,
    default: []
  }
});

module.exports = mongoose.model("information", Schema);
