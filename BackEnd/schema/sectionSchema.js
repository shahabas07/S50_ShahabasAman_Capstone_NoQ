const mongoose = require('mongoose');

// Schema for individual time slots
const timeSlotSchema = new mongoose.Schema({
  time: { type: String, required: true }
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  daysOfWeek: {
    type: Map,
    of: Boolean,
    // required: true
  },
  availability: {
    type: Map,
    of: new mongoose.Schema({
      start: { type: String, required: true },
      end: { type: String, required: true },
    }),
    // required: true
  }
});



// Check if the model already exists before defining it
const Section = mongoose.models.Section || mongoose.model('Section', sectionSchema);
module.exports = Section;
