const mongoose = require('mongoose');

const DisabledDateSchema = new mongoose.Schema({
  DisabledDate: {
    type: Date,
    required: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  startTime: {
    type: String, // You can store times as strings or Dates if they include date components
    required: true
  },
  endTime: {
    type: String,
    required: true
  },
  DisabledDay: {
    type: String, // e.g., 'Sunday', 'Monday', etc.
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DisabledDate', DisabledDateSchema);
