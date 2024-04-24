const express = require('express');
const router = express.Router();
const Appointment = require('../schema/appointmentSchema'); // Corrected typo here
const moment = require('moment')

// Create a new appointment
router.post('/', async (req, res, next) => {
    try {
        req.body.date = moment(req.body.date, 'DD-MM-YYYY').add(1, 'day').toISOString();
        let reqBody = req.body;
        let appointment = new Appointment(reqBody); // Corrected typo here
        await appointment.save();
        res.setHeader("Content-Type", "application/json");
        res.status(201).json({ message: "Appointment successfully booked", isError: false, data: { appointment: appointment } });
    } catch (error) {
        console.log(error);
        next(error);
    }
});

// Get all appointments
router.get('/', async (req, res) => {
    try {
        const appointments = await Appointment.find();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Middleware to get a single appointment by ID
async function getAppointment(req, res, next) {
    let appointment;
    try {
        appointment = await Appointment.findById(req.params.id);
        if (appointment == null) {
            return res.status(404).json({ message: 'Cannot find appointment' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
    res.appointment = appointment;
    next();
}

// Get a single appointment
router.get('/:id', getAppointment, (req, res) => {
    res.json(res.appointment);
});

// Delete an appointment
router.delete('/:id', getAppointment, async (req, res) => {
    try {
        await Appointment.deleteOne({ _id: req.params.id });
        res.json({ message: 'Appointment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
