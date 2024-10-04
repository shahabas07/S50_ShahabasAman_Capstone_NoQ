const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  appointmentDate: { type: Date, required: true },
  location: { type: String, required: true },
  time: { type: String, required: true },
  email: { type: String, required: true },
  customerName: { type: String, required: true },
  adminName: { type: String, required: true },
  adminId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment;