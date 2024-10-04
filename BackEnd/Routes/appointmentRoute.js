const Appointment = require('../Schemas/appointmentSchema');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find(); // Fetch all appointments

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }

    res.status(200).json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ message: 'Failed to fetch appointments', error: err.message });
  }
});

router.post('/create', async (req, res) => {
  const { appointmentDate, location, time, email, customerName, adminName, adminId } = req.body;

  if (!appointmentDate || !location || !time || !email || !customerName || !adminName || !adminId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!mongoose.Types.ObjectId.isValid(adminId)) {
    return res.status(400).json({ message: 'Invalid admin ID format' });
  }

  try {
    const appointment = new Appointment({
      appointmentDate,
      location,
      time,
      email,
      customerName,
      adminName,
      adminId
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment created successfully', appointment });
  } catch (err) {
    console.error('Error creating appointment:', err);
    res.status(500).json({ message: 'Failed to create appointment', error: err.message });
  }
});


router.get('/admin/:adminId/:appointmentDate', async (req, res) => {
  const { adminId, appointmentDate } = req.params;
  
  const date = new Date(appointmentDate);
  
  if (isNaN(date.getTime())) {
    return res.status(400).json({ message: 'Invalid date format' });
  }
  
  try {
    const appointments = await Appointment.find({
      adminId: adminId,
      appointmentDate: {
        $gte: date.setHours(0, 0, 0, 0),
        $lt: date.setHours(23, 59, 59, 999)
      }
    });

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: err.message });
  }
});

router.get('/admin/:adminId', async (req, res) => {
  const { adminId } = req.params;

  try {
    const appointments = await Appointment.find({ adminId: adminId });

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: 'No appointments found' });
    }

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: err.message });
  }
});
  

module.exports = router;