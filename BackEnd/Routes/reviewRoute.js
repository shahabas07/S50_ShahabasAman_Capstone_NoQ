const express = require('express');
const router = express.Router();
const Review = require('../Schemas/reviewSchema');
const Profile = require('../Schemas/profileSchema');

router.post('/:serviceProviderId', async (req, res) => {
  try {
    const { reviewerName, rating, comment } = req.body;
    const { serviceProviderId } = req.params;

    const serviceProvider = await Profile.findById(serviceProviderId);
    if (!serviceProvider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    const newReview = new Review({
      reviewerName,
      rating,
      comment,
      adminId: serviceProviderId 
    });

    const savedReview = await newReview.save();

    res.status(201).json(savedReview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:serviceProviderId', async (req, res) => {
  try {
    const { serviceProviderId } = req.params;

    const serviceProvider = await Profile.findById(serviceProviderId);
    if (!serviceProvider) {
      return res.status(404).json({ error: 'Service provider not found' });
    }

    const reviews = await Review.find({ adminId: serviceProviderId });

    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
