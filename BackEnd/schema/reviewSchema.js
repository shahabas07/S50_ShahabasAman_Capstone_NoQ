const mongoose = require('mongoose');

//Schema for Service Provider Reviews&Ratings.
const reviewSchema = new mongoose.Schema({
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customer' 
    },
    rating: {
      type: Number,
      required: true
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    },
    
  });

const reviewModel = mongoose.model('reviews', reviewSchema);

module.exports = reviewModel;