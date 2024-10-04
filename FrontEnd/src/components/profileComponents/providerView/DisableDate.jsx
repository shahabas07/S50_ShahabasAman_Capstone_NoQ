import React, { useState, useEffect } from 'react';
import axios from 'axios';
const API_URI = import.meta.env.VITE_API_URI;

const DateSelector = ({ adminId }) => {
  const [dates, setDates] = useState(['']);
  const [error, setError] = useState('');
  const [disabledDates, setDisabledDates] = useState([]);
  const [isVisible, setIsVisible] = useState(false); 

  const handleDateChange = (index, value) => {
    const newDates = [...dates];
    newDates[index] = value; 
    setDates(newDates);
  };

  const addDateField = () => {
    setDates([...dates, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 

    const validDates = dates.filter(date => date);

    if (validDates.length === 0) {
      setError('Please select at least one date.');
      return;
    }

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
      await Promise.all(requests.map(request =>
        axios.post(`${API_URI}/disabled-dates`, request)
      ));
      setDates(['']);
      alert('Dates saved successfully!');
      fetchDisabledDates(); 
    } catch (error) {
      console.error("Error saving dates:", error);
      setError('Failed to save dates. Please try again.');
    }
  };

  const fetchDisabledDates = async () => {
    try {
      const response = await axios.get(`${API_URI}/disabled-dates/${adminId}`);
      const filteredDates = response.data.filter(date =>
        date.startTime === '00:00' && date.endTime === '24:00'
      );
      setDisabledDates(filteredDates);
    } catch (error) {
      console.error("Error fetching disabled dates:", error);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchDisabledDates(); 
  }, []);

  return (
    <div className="date-selector">
      <button
        className="bg-violet-800 text-white px-4 py-2 rounded disablingDates"
        onClick={() => setIsVisible(!isVisible)} 
      >
        {isVisible ? "Hide" : 'Holidates   '}
      </button>

      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${isVisible ? 'max-h-screen' : 'max-h-0'}`}
        style={{ overflow: 'hidden' }} 
      >
        {isVisible && (
          <div className="mt-4">
            <h2 className="text-lg font-bold mb-4">Select Disabled Dates</h2>
            
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
                    min={today} 
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