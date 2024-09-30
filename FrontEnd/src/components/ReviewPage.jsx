// src/ReviewPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ReviewPage = () => {
  const { id: serviceProviderId } = useParams(); // Extracting the serviceProviderId from route params
  const [reviews, setReviews] = useState([]);
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`http://localhost:2024/review/${serviceProviderId}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [serviceProviderId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerName || rating === 0 || !comment) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const newReview = { reviewerName, rating, comment };
      await axios.post(`http://localhost:2024/review/${serviceProviderId}`, newReview);
      setReviews([...reviews, newReview]);
      setReviewerName('');
      setRating(0);
      setComment('');
    } catch (error) {
      console.error('Error posting review:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Share Your Experience</h1>

      <div className="space-y-4 mb-6">
        {reviews.map((review, index) => (
          <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-md">
            <h2 className="font-bold">{review.reviewerName}</h2>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-${i < review.rating ? 'yellow' : 'gray'}-500`}>
                  ★
                </span>
              ))}
            </div>
            <p className="text-gray-700">{review.comment}</p>
            <p className="text-gray-500 text-sm">{new Date(review.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          type="text"
          value={reviewerName}
          onChange={(e) => setReviewerName(e.target.value)}
          placeholder="Your Name"
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <div className="flex items-center">
          <span className="mr-2">Rating:</span>
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`cursor-pointer text-${index < rating ? 'yellow' : 'gray'}-500`}
              onClick={() => setRating(index + 1)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ReviewPage;
