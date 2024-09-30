const express = require('express');
const router = express.Router();
const DisabledDate = require('../schema/disabledDateSchema'); 

// POST - Create a new disabled date
// POST - Create a new disabled date
router.post('/', async (req, res) => {
  try {
    const { DisabledDate: date, adminId, startTime, endTime, DisabledDay } = req.body;

    // Log incoming data
    console.log("Incoming data:", req.body);

    // Check if the date is provided and valid
    if (!date) {
      return res.status(400).json({ error: 'DisabledDate is required' });
    }

    // Convert the DisabledDate string to a Date object
    const disabledDate = new Date(date);
    
    // Validate the date
    if (isNaN(disabledDate.getTime())) {
      return res.status(400).json({ error: 'Invalid DisabledDate' });
    }

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
    console.error("Error saving disabled date:", error); // Log error for debugging
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
// GET - Get a disabled date by adminId and DisabledDate
// GET - Get disabled dates by adminId
router.get('/:adminId', async (req, res) => {
  try {
    const { adminId } = req.params; // Extract adminId from the URL parameters

    // Log incoming data
    console.log("Fetching disabled dates for adminId:", adminId);

    // Validate the input
    if (!adminId) {
      return res.status(400).json({ error: 'adminId is required' });
    }

    // Find all disabled dates for the given adminId
    const disabledDates = await DisabledDate.find({ adminId });

    if (!disabledDates || disabledDates.length === 0) {
      return res.status(404).json({ message: 'No disabled dates found for this admin' });
    }

    res.status(200).json(disabledDates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch disabled dates', details: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the request parameters
    const deletedDate = await DisabledDate.findByIdAndDelete(id); // Delete the document by ID

    if (!deletedDate) {
      return res.status(404).json({ error: 'Disabled date not found' });
    }

    res.status(200).json({ message: 'Disabled date deleted successfully', deletedDate });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete disabled date', details: error.message });
  }
});


module.exports = router;
