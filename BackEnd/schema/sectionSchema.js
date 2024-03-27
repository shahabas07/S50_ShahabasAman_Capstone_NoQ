const mongoose = require('mongoose');

//schema for specific time slots
const specificTimeSchema = new mongoose.Schema({
  startTime: {
    type: String, 
    required: true
  },
  available: {
    type: Boolean,
    default: true 
  },
});

// schema for calendar availability
const availabilitySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  specificTimes: [specificTimeSchema]
});

// schema for Service Provider section of each service points
const sectionSchema = new mongoose.Schema({
  sectionName: String,
  note: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile' 
  },
  availability: [availabilitySchema] 
});

const SectionModel = mongoose.model('Section', sectionSchema);

module.exports = SectionModel;
