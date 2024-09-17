
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phone_number: String
});

module.exports = mongoose.model("user", userSchema);