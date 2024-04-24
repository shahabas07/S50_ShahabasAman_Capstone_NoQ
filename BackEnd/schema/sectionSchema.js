const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  // Reference to the service provider profile
  ServiceProvider_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  // Days of the week when the availability repeats
  // You can adjust this based on your requirements
  daysOfWeek: {
    type: [Number], // 0: Sunday, 1: Monday, ..., 6: Saturday
    required: true
  },
  // Maximum number of appointments that can be scheduled in this slot
  bookedHours: {
    type: [Date],
    default: [] 
  }
});

const section = mongoose.model('section', sectionSchema);

module.exports = section;
