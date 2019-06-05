const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String },
  password: { type: String, required: true },
  state: { type: String }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
