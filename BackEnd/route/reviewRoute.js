const express = require('express');
const router = express.Router();
const Review = require('../schema/reviewSchema');
const Profile = require('../schema/serviceProfile');

// Route to create a new review
router.post('/:serviceProviderId', async (req, res) => {
  try {
    const { reviewerName, rating, comment } = req.body;
    const { serviceProviderId } = req.params;

    // Check if the service provider exists
    const serviceProvider = await Profile.findById(serviceProviderId);
    if (!serviceProvider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    // Create a new review
    const newReview = new Review({
      reviewerName,
      rating,
      comment
    });

    // Save the review
    const savedReview = await newReview.save();

    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to get all reviews
router.get('/:serviceProviderId', async (req, res) => {
  try {
    const { serviceProviderId } = req.params;

    // Check if the service provider exists
    const serviceProvider = await Profile.findById(serviceProviderId);
    if (!serviceProvider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    // Find all reviews
    const reviews = await Review.find();

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
