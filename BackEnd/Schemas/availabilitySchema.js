const mongoose = require('mongoose');

// Schema for individual time slots
const timeSlotSchema = new mongoose.Schema({
  time: { type: String, required: true }
}, { _id: false });

const availabilitySchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  daysOfWeek: {
    type: Map,
    of: Boolean,
  },
  availability: {
    type: Map,
    of: availabilitySchema, // Use the defined availability schema
  },
  fromMonth: {
    type: String,
  },
  toMonth: {
    type: String,
  },
});

// Check if the model already exists before defining it
const Section = mongoose.models.Section || mongoose.model('Section', sectionSchema);
module.exports = Section;