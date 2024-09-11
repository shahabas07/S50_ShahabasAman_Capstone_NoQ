const Appointment = require('../schema/appointmentSchema');
const express = require('express');
const router = express.Router();

router.post('/create', async (req, res) => {
    try {
      const { appointmentDate, location, time, email, customerName, adminName, adminId } = req.body;
  
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
      
      // Return the created appointment with its _id
      res.status(201).json({ message: 'Appointment created successfully', appointment });
    } catch (err) {
      res.status(500).json({ message: 'Failed to create appointment', error: err.message });
    }
  });
  

// GET route to fetch all appointments
router.get('/', async (req, res) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: err.message });
  }
});

// GET route to fetch an appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.status(200).json(appointment);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch appointment', error: err.message });
  }
});

router.get('/adminId/:adminId', async (req, res) => {
    const { adminId } = req.params;
    const { appointmentDate } = req.query;  // Optional query parameter for filtering by date
    
    try {
      // Build query object to filter by adminId and optionally by appointmentDate
      const query = { adminId };
      
      if (appointmentDate) {
        query.appointmentDate = appointmentDate;
      }
  
      const appointments = await Appointment.find(query);
      
      if (!appointments || appointments.length === 0) {
        return res.status(404).json({ message: 'No appointments found' });
      }
      
      res.status(200).json(appointments);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch appointments', error: err.message });
    }
  });
  

module.exports = router;