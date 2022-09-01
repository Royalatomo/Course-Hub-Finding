const mongoose = require("mongoose");

const Schema = mongoose.Schema({
    token: "",
    userId: ""
});

module.exports = mongoose.model("session", Schema);