// sectionRoutes.js
const express = require('express');
const router = express.Router();
const Section = require('../schema/sectionSchema');

// GET all sections
router.get('/', async (req, res) => {
  try {
    const sections = await Section.find();
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a specific section
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

// POST create a new section
router.post('/', async (req, res) => {
  const section = new Section({
    daysOfWeek: req.body.daysOfWeek
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

// PUT update an existing section
router.put('/:id', async (req, res) => {
  try {
    const section = await Section.findById(req.params.id);
    if (section == null) {
      return res.status(404).json({ message: 'Section not found' });
    }

    section.daysOfWeek = req.body.daysOfWeek;

    const updatedSection = await section.save();
    res.json(updatedSection);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a section
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
