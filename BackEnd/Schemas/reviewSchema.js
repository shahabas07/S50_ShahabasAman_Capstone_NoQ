const mongoose = require('mongoose');

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
    adminId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true
    }
});

const reviewModel = mongoose.model('reviews', reviewSchema);

module.exports = reviewModel;