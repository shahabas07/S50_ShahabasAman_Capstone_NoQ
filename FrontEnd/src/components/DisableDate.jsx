import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DateSelector = ({ adminId }) => {
  const [dates, setDates] = useState(['']);
  const [error, setError] = useState('');
  const [disabledDates, setDisabledDates] = useState([]);
  const [isVisible, setIsVisible] = useState(false); // State to manage visibility

  // Function to handle date change
  const handleDateChange = (index, value) => {
    const newDates = [...dates];
    newDates[index] = value; // Update the specific date input
    setDates(newDates);
  };

  // Function to add a new input field
  const addDateField = () => {
    setDates([...dates, '']);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    // Filter out empty date inputs
    const validDates = dates.filter(date => date);

    if (validDates.length === 0) {
      setError('Please select at least one date.');
      return;
    }

    // Prepare the data to send to the backend
    const requests = validDates.map(date => {
      const disabledDate = new Date(date);
      const disabledDay = disabledDate.toLocaleString('en-US', { weekday: 'long' });

      return {
        DisabledDate: disabledDate,
        adminId,
        startTime: '00:00',
        endTime: '24:00',
        DisabledDay: disabledDay,
      };
    });

    try {
      // Sending all valid dates to the backend
      await Promise.all(requests.map(request =>
        axios.post('http://localhost:2024/disabled-dates', request)
      ));
      // Resetting the input fields after successful submission
      setDates(['']);
      alert('Dates saved successfully!');
      fetchDisabledDates(); // Refresh the disabled dates after saving
    } catch (error) {
      console.error("Error saving dates:", error);
      setError('Failed to save dates. Please try again.');
    }
  };

  // Fetch disabled dates from the backend
  const fetchDisabledDates = async () => {
    try {
      const response = await axios.get(`http://localhost:2024/disabled-dates/${adminId}`);
      // Filter dates with startTime 00:00 and endTime 24:00
      const filteredDates = response.data.filter(date =>
        date.startTime === '00:00' && date.endTime === '24:00'
      );
      setDisabledDates(filteredDates);
    } catch (error) {
      console.error("Error fetching disabled dates:", error);
    }
  };

  // Get today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchDisabledDates(); // Fetch disabled dates on component mount
  }, []);

  return (
    <div className="date-selector">
      <button
        className="bg-violet-800 text-white px-4 py-2 rounded disablingDates"
        onClick={() => setIsVisible(!isVisible)} // Toggle visibility
      >
        {isVisible ? "Hide" : 'Holidates   '}
      </button>

      {/* Toggle component visibility with animation */}
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isVisible ? 'max-h-screen' : 'max-h-0'}`}
        style={{ overflow: 'hidden' }} // Prevent overflow during animation
      >
        {isVisible && (
          <div className="mt-4">
            <h2 className="text-lg font-bold mb-4">Select Disabled Dates</h2>
            
            {/* Display the disabled dates */}
            <div className="mb-4">
              <h3 className="font-semibold">Disabled Dates:</h3>
              {disabledDates.length > 0 ? (
                <ul>
                  {disabledDates.map((item, index) => (
                    <li key={index}>
                      {item.DisabledDate.split('T')[0]} - {item.DisabledDay}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No disabled dates available.</p>
              )}
            </div>
            
            <form onSubmit={handleSubmit}>
              {dates.map((date, index) => (
                <div key={index} className="flex mb-4 items-center">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => handleDateChange(index, e.target.value)}
                    className="border rounded p-2 mr-2"
                    required
                    min={today} // Prevent selection of past and present dates
                  />
                  {index === dates.length - 1 && (
                    <button 
                      type="button" 
                      onClick={addDateField} 
                      className="border disablingDates border-gray-600 hover:bg-gray-300 text-black px-2 py-1 rounded"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
              {error && <p className="text-red-600">{error}</p>}
              <button type="submit" className="bg-yellow-500 text-gray-700 px-4 py-2 hover:bg-yellow-400 rounded disablingDates">
                Save Dates
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DateSelector;
