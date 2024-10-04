const mongoose = require('mongoose');

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
    of: availabilitySchema, 
  },
  fromMonth: {
    type: String,
  },
  toMonth: {
    type: String,
  },
});

const Section = mongoose.models.Section || mongoose.model('Section', sectionSchema);
module.exports = Section;