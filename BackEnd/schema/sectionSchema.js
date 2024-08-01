// sectionSchema.js
const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  daysOfWeek: {
    type: Map,
    of: Boolean,
    required: true
  },
  // This will hold references to service profiles linked to this section
  serviceProfiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  }]
});

const Section = mongoose.model('Section', sectionSchema);
module.exports = Section;
