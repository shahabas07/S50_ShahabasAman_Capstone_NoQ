const express = require('express');
const router = express.Router();
const DisabledDate = require('../Schemas/disabledDateSchema'); 

router.post('/', async (req, res) => {
  try {
    const { DisabledDate: date, adminId, startTime, endTime, DisabledDay } = req.body;

    if (!date) {
      return res.status(400).json({ error: 'DisabledDate is required' });
    }

    const disabledDate = new Date(date);
    
    if (isNaN(disabledDate.getTime())) {
      return res.status(400).json({ error: 'Invalid DisabledDate' });
    }

    const newDisabledDate = new DisabledDate({
      DisabledDate: disabledDate,
      adminId,
      startTime,
      endTime,
      DisabledDay
    });

    const savedDisabledDate = await newDisabledDate.save();
    res.status(201).json(savedDisabledDate);
  } catch (error) {
    console.error("Error saving disabled date:", error); // Log error for debugging
    res.status(500).json({ error: 'Failed to create the disabled date', details: error.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const disabledDates = await DisabledDate.find();
    res.status(200).json(disabledDates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch disabled dates', details: error.message });
  }
});

router.get('/:adminId', async (req, res) => {
  try {
    const { adminId } = req.params; 

    if (!adminId) {
      return res.status(400).json({ error: 'adminId is required' });
    }

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
    const { id } = req.params; 
    const deletedDate = await DisabledDate.findByIdAndDelete(id); 

    if (!deletedDate) {
      return res.status(404).json({ error: 'Disabled date not found' });
    }

    res.status(200).json({ message: 'Disabled date deleted successfully', deletedDate });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete disabled date', details: error.message });
  }
});


module.exports = router;