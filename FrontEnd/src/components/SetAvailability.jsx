import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Availability.css"; // Ensure you have this file for custom styling

const daysOfWeek = [
  { day: "Sunday", key: "sunday" },
  { day: "Monday", key: "monday" },
  { day: "Tuesday", key: "tuesday" },
  { day: "Wednesday", key: "wednesday" },
  { day: "Thursday", key: "thursday" },
  { day: "Friday", key: "friday" },
  { day: "Saturday", key: "saturday" }
];

function SetAvailability({ sectionId }) {
  const [availability, setAvailability] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day.key]: false }), {})
  );
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:2024/section?sectionId=${sectionId}`)
      .then(response => {
        const fetchedData = response.data;
        const mergedAvailability = fetchedData.reduce((acc, section) => {
          const days = Object.keys(section.daysOfWeek).filter(day => section.daysOfWeek[day]);
          days.forEach(day => acc[day] = true);
          return acc;
        }, {});
        setAvailability(mergedAvailability);
      })
      .catch(error => {
        console.error("There was an error fetching the availability data!", error);
      });
  }, [sectionId]);

  const handleToggle = (key) => {
    const newAvailability = {
      ...availability,
      [key]: !availability[key]
    };

    setAvailability(newAvailability);

    // Convert availability object to the expected format
    const updatedDaysOfWeek = Object.keys(newAvailability)
      .filter(day => newAvailability[day]);

    // Update backend with the new state
    // const sectionId = ''; // Replace with the actual section ID

    axios.put(`http://localhost:2024/section/${sectionId}`, { daysOfWeek: newAvailability })
      .then(response => {
        console.log("Availability updated:", response.data);
      })
      .catch(error => {
        console.error("There was an error updating the availability!", error);
      });
  };

  return (
    <div className={`transition-transform transform ${show ? "" : "translate-y-full"} duration-500 ease-in-out`}>
      <button
        onClick={() => setShow(!show)}
        className="bg-blue-500 text-white px-4 py-2 rounded focus:outline-none"
      >
        {show ? "Hide Availability" : "Set Availability"}
      </button>
      {show && (
        <div className="flex flex-col items-start p-4 bg-white shadow-lg rounded-lg">
          {daysOfWeek.map((item) => (
            <div key={item.key} className="flex justify-between items-center w-full mb-3">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={availability[item.key]}
                  onChange={() => handleToggle(item.key)}
                  className="sr-only"
                />
                <div className="relative">
                  <div
                    className={`w-10 h-6 bg-gray-300 rounded-full shadow-inner ${availability[item.key] ? "bg-blue-500" : ""}`}
                  />
                  <div
                    className={`absolute top-0 left-0 w-6 h-6 bg-white border border-gray-300 rounded-full shadow inset-y-0 left-0 ${availability[item.key] ? "translate-x-4" : ""}`}
                  />
                </div>
              </label>
              <span className="font-bold ml-4">{item.day}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SetAvailability;
