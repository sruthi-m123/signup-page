
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    uname:String,
  email: {
    type: String,
    required: true,
    unique:true
  },
  password: {
    type: String,
    required: true,
  },
  uname:{
    type:String,
    required:true
  }
});

module.exports = mongoose.model("User", userSchema);
