const mongoose = require('mongoose');

// Schema for Service Provider Reviews & Ratings
const reviewSchema = new mongoose.Schema({
    reviewerName: {
        type: String,
        required: true
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
    adminId: {  // Add the adminId (serviceProviderId)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile', // Reference the service profile collection
        required: true
    }
});

const reviewModel = mongoose.model('reviews', reviewSchema);

module.exports = reviewModel;
