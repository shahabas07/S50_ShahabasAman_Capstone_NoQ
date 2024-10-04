const express = require('express');
const router = express.Router();
const Section = require('../Schemas/availabilitySchema');

// Helper function for validating time ranges
const isValidTimeRange = (start, end) => {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timePattern.test(start) && timePattern.test(end) && start < end;
};

// GET all sections
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve sections', error: err.message });
  }
});

// GET a specific section
router.get('/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    res.json(section);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve section', error: err.message });
  }
});

// PUT update an existing section
router.put('/:id', async (req, res) => {
  const { daysOfWeek, availability, fromMonth, toMonth } = req.body;

  // Log the request body for debugging
  console.log('Received update payload:', req.body);

  // Validate data formats
  if (typeof daysOfWeek !== 'object' || typeof fromMonth !== 'string' || typeof toMonth !== 'string' || 
      (availability && typeof availability !== 'object')) {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  // Validate the days of the week keys
  const validDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const invalidDays = Object.keys(daysOfWeek).filter(day => !validDays.includes(day));
  if (invalidDays.length) {
    return res.status(400).json({ message: `Invalid days of week: ${invalidDays.join(", ")}` });
  }

  // Validate availability structure (ensure start and end are present)
  if (availability) {
    for (const [day, slots] of Object.entries(availability)) {
      if (!slots.start || !slots.end || !isValidTimeRange(slots.start, slots.end)) {
        return res.status(400).json({ message: `Invalid start or end time for ${day}` });
      }
    }
  }

  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Update the section with new data
    section.daysOfWeek = daysOfWeek;
    section.availability = availability; // Update availability
    section.fromMonth = fromMonth; // Update from month
    section.toMonth = toMonth; // Update to month

    const updatedSection = await section.save();
    res.json(updatedSection);
  } catch (err) {
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
    console.log(err.message);
  }
});


// DELETE a section
router.delete('/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }
    await section.remove();
    res.json({ message: 'Section deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete section', error: err.message });
  }
});

module.exports = router;
