const mongoose = require("mongoose");

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
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'serviceProfile'
  }
});

const serviceModal = mongoose.model("service", serviceSchema);
module.exports = serviceModal;
