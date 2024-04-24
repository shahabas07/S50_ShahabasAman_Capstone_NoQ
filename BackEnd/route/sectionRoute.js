const express = require('express');
const router = express.Router();
const Section = require('../schema/sectionSchema');

// GET all availability sections
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific availability section
router.get('/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (section == null) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST create a new availability section
router.post('/', async (req, res) => {
  const section = new Section({
    ServiceProvider_id: req.body.ServiceProvider_id, // Corrected field name
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    daysOfWeek: req.body.daysOfWeek,
    bookedHours: req.body.bookedHours
  });

  try {
    const newSection = await section.save();
    res.status(201).json(newSection);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(422).json({ message: err.message });
    } else {
      res.status(400).json({ message: err.message });
    }
  }  
});

// PUT update an existing availability section
router.put('/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (section == null) {
      return res.status(404).json({ message: 'Section not found' });
    }
    section.ServiceProvider_id = req.body.ServiceProvider_id; // Corrected field name
    section.startTime = req.body.startTime;
    section.endTime = req.body.endTime;
    section.daysOfWeek = req.body.daysOfWeek;
    section.bookedHours = req.body.bookedHours;

    const updatedSection = await section.save();
    res.json(updatedSection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// DELETE an availability section
router.delete('/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (section == null) {
      return res.status(404).json({ message: 'Section not found' });
    }
    await section.remove();
    res.json({ message: 'Section deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
