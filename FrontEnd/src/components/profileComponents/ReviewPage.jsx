import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const API_URI = import.meta.env.VITE_API_URI;

const ReviewPage = () => {
  const { '*': params } = useParams();
  const paramArray = params ? params.split('/') : []; 
  
  const serviceProviderId = paramArray.length > 0 ? paramArray[paramArray.length - 1] : null; 
  const serviceProviderName = paramArray.length > 1 ? paramArray[paramArray.length - 2] : null; 

  const [reviews, setReviews] = useState([]);
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState(null);

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = decodeURIComponent(atob(base64Url).split('').map(c => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`).join(''));
      return JSON.parse(base64);
    } catch (error) {
      console.error('Invalid token', error);
      return null;
    }
  };

  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.username) {
        setUsername(decoded.username);
      }
    }
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${API_URI}/review/${serviceProviderId}`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (serviceProviderId) {
      fetchReviews();
    }
  }, [serviceProviderId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewerName || rating === 0 || !comment) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      setIsLoading(true);
      const newReview = { reviewerName, rating, comment };
      await axios.post(`${API_URI}/review/${serviceProviderId}`, newReview);
      setReviews([...reviews, newReview]);
      setReviewerName('');
      setRating(0);
      setComment('');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error posting review:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='dotbg h-screen'>
      <a href="/" className="logo text-black pl-6">
        NoQ
      </a>
      <div className="w-2/3 mx-auto p-6 bg-gray-50 border border-violet-950 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Rating & Reviews</h1>

        {username != serviceProviderName && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="mb-4 px-4 py-2 bg-violet-800 text-white rounded-lg hover:bg-violet-950 transition duration-300"
          >
            Write a Review
          </button>
        )}

        <div className="space-y-4 mb-6 bg-yellow-100">
          {reviews.map((review, index) => (
            <div key={index} className="p-4 bg-yellow-50 rounded-lg shadow-md">
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

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md">
              <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
              <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Your Name"
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
                />

                <div className="flex items-center space-x-1">
                  <span className="mr-2 text-sm">Rating:</span>
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
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none h-24"
                />

                <button
                  type="submit"
                  className={`flex justify-center items-center px-4 py-2 ${isLoading ? 'bg-gray-400' : 'bg-violet-800'} text-white rounded-lg hover:bg-violet-950 transition duration-300`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span>Loading...</span>
                  ) : (
                    <span className="text-sm">Submit</span>
                  )}
                </button>
              </form>
              <button onClick={() => setIsModalOpen(false)} className="mt-4 text-brown-500 hover:underline">
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;