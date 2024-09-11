const express = require('express');
const router = express.Router();
const Section = require('../schema/sectionSchema');

// Helper function for validating time ranges
const isValidTimeRange = (start, end) => {
  const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!timePattern.test(start) || !timePattern.test(end)) {
    return false;
  }
  return start < end;
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
  const { daysOfWeek, availability } = req.body;

  // Log the request body for debugging
  console.log('Received update payload:', req.body);

  // Validate daysOfWeek and availability
  if (typeof daysOfWeek !== 'object' || (availability && typeof availability !== 'object')) {
    return res.status(400).json({ message: 'Invalid data format' });
  }

  if (availability) {
    for (const [day, slots] of Object.entries(availability)) {
      if (!slots.timeSlots || !Array.isArray(slots.timeSlots)) {
        return res.status(400).json({ message: `Missing timeSlots for ${day}` });
      }

      for (const slot of slots.timeSlots) {
        if (!slot.time) {
          return res.status(400).json({ message: `Missing time field in slot for ${day}` });
        }
        // Optional: You can validate the time format here as well
      }
    }
  }

  try {
    const section = await Section.findById(req.params.id);
    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    // Update section with new data
    section.daysOfWeek = daysOfWeek;
    section.availability = availability;

    const updatedSection = await section.save();
    res.json(updatedSection);
  } catch (err) {
    // Handle specific errors based on error type
    if (err.name === 'ValidationError') {
      res.status(422).json({ message: 'Validation error', error: err.message });
    } else {
      res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
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




// POST create a new section
// router.post('/', async (req, res) => {
//   const { daysOfWeek, availability } = req.body;

//   // Validate daysOfWeek and availability
//   if (typeof daysOfWeek !== 'object' || (availability && typeof availability !== 'object')) {
//     return res.status(400).json({ message: 'Invalid data format' });
//   }

//   if (availability) {
//     for (const [day, timeSlots] of Object.entries(availability)) {
//       if (!Array.isArray(timeSlots)) {
//         return res.status(400).json({ message: `Invalid time slots for ${day}` });
//       }
//       for (const slot of timeSlots) {
//         if (!isValidTime(slot.time)) {
//           return res.status(400).json({ message: `Invalid time slot: ${slot.time} for ${day}` });
//         }
//       }
//     }
//   }

//   const section = new Section({
//     daysOfWeek,
//     availability
//   });

//   try {
//     const newSection = await section.save();
//     res.status(201).json(newSection);
//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       res.status(422).json({ message: 'Validation error', error: err.message });
//     } else {
//       res.status(400).json({ message: 'Failed to create section', error: err.message });
//     }
//   }
// });

// // Helper function to validate time format
// function isValidTime(time) {
//   const timeFormat = /^(0?[1-9]|1[0-2])(am|pm)$/; // Regex for "1am", "2pm", etc.
//   return timeFormat.test(time);
// }
