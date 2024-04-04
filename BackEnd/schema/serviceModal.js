const mongoose = require("mongoose");

//Schema for Service Provider SignUP/SignIn 
const serviceSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  email: { 
    type: String,
    required: true,
    unique: true
  },
  timezone: {
    type: String, 
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'serviceProfile'
  }
});

const serviceModal = mongoose.model("service", serviceSchema);
module.exports = serviceModal;