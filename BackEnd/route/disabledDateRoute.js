const express = require('express');
const router = express.Router();
const DisabledDate = require('../schema/disabledDateSchema'); 

// POST - Create a new disabled date
router.post('/', async (req, res) => {
  try {
    const { DisabledDate: date, adminId, startTime, endTime, DisabledDay } = req.body;

    // Convert the DisabledDate string to a Date object
    const disabledDate = new Date(date);

    // Create a new DisabledDate document
    const newDisabledDate = new DisabledDate({
      DisabledDate: disabledDate,
      adminId,
      startTime,
      endTime,
      DisabledDay
    });

    // Save the document to the database
    const savedDisabledDate = await newDisabledDate.save();
    res.status(201).json(savedDisabledDate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create the disabled date', details: error.message });
  }
});

// GET - Get all disabled dates
router.get('/', async (req, res) => {
  try {
    const disabledDates = await DisabledDate.find();
    res.status(200).json(disabledDates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch disabled dates', details: error.message });
  }
});

// GET by ID - Get a disabled date by its ID
router.get('/:id', async (req, res) => {
  try {
    const disabledDate = await DisabledDate.findById(req.params.id);

    if (!disabledDate) {
      return res.status(404).json({ message: 'Disabled date not found' });
    }

    res.status(200).json(disabledDate);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch the disabled date', details: error.message });
  }
});

// Optional: DELETE or PUT routes could also be added if needed.

// Export the router
module.exports = router;
