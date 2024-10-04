// serviceModal.js
const mongoose = require('mongoose');

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
    unique: true
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  }
});

const Service = mongoose.model("Service", serviceSchema);
module.exports = Service;
