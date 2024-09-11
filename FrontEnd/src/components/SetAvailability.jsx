import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/Availability.css"; // Ensure you have this file for custom styling

const daysOfWeek = [
  { day: "Sunday", key: "Sunday" },
  { day: "Monday", key: "Monday" },
  { day: "Tuesday", key: "Tuesday" },
  { day: "Wednesday", key: "Wednesday" },
  { day: "Thursday", key: "Thursday" },
  { day: "Friday", key: "Friday" },
  { day: "Saturday", key: "Saturday" }
];

function SetAvailability({ sectionId }) {
  const [availability, setAvailability] = useState(
    daysOfWeek.reduce(
      (acc, day) => ({
        ...acc,
        [day.key]: { active: false, timeRange: { start: "", end: "" } }
      }),
      {}
    )
  );
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:2024/section/${sectionId}`)
      .then((response) => {
        const section = response.data;
        const newAvailability = {};

        // Initialize daysOfWeek
        daysOfWeek.forEach((day) => {
          newAvailability[day.key] = {
            active: section.daysOfWeek[day.key] || false,
            timeRange: section.availability
              ? section.availability[day.key] || { start: "", end: "" }
              : { start: "", end: "" }
          };
        });

        setAvailability(newAvailability);
      })
      .catch((error) => {
        console.error("There was an error fetching the availability data!", error);
      });
  }, [sectionId]);

  const generateTimeSlots = (startTime, endTime) => {
    const slots = [];
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);

    while (start < end) {
      slots.push(start.toTimeString().substring(0, 5));
      start.setMinutes(start.getMinutes() + 30); // Add 30-minute slots
    }

    return slots;
  };

  const handleToggle = (key) => {
    const newAvailability = {
      ...availability,
      [key]: {
        ...availability[key],
        active: !availability[key].active
      }
    };

    setAvailability(newAvailability);
  };

  const handleTimeChange = (key, field, value) => {
    const newAvailability = {
      ...availability,
      [key]: {
        ...availability[key],
        timeRange: {
          ...availability[key].timeRange,
          [field]: value
        }
      }
    };

    if (field === "start" || field === "end") {
      const { start, end } = newAvailability[key].timeRange;
      if (start && end && start < end) {
        newAvailability[key].timeSlots = generateTimeSlots(start, end);
      } else {
        newAvailability[key].timeSlots = []; // Clear time slots if invalid
      }
    }

    setAvailability(newAvailability);
  };

  const handleSubmit = () => {
    // Prepare data to match backend expectations
    const daysOfWeekData = {};
    const availabilityData = {};
  
    Object.keys(availability).forEach((day) => {
      daysOfWeekData[day] = availability[day].active;
      if (availability[day].active) {
        availabilityData[day] = {
          start: availability[day].timeRange.start,
          end: availability[day].timeRange.end,
          timeSlots: availability[day].timeSlots.map(slot => ({ time: slot }))
        };
      }
    });
  
    const payload = {
      daysOfWeek: daysOfWeekData,
      availability: availabilityData
    };
  
    axios
      .put(`http://localhost:2024/section/${sectionId}`, payload)
      .then((response) => {
        console.log("Availability updated:", response.data);
        alert("Availability updated successfully!");
      })
      .catch((error) => {
        console.error("There was an error updating the availability!", error);
        alert("Failed to update availability.");
      });
  };
  
  

  return (
    <div
      className={`transition-transform transform -mt-10 ${
        show ? "" : "translate-y-full"
      } duration-500 ease-in-out`}
    >
      <button
        onClick={() => setShow(!show)}
        className="bg-violet-700 text-white px-4 py-2 rounded focus:outline-none"
      >
        {show ? "Hide Availability" : "Set Availability"}
      </button>
      {show && (
        <div className="flex flex-col items-start p-4 bg-white shadow-lg rounded-lg">
          {daysOfWeek.map((item) => (
            <div
              key={item.key}
              className="flex flex-col w-full mb-4 border-b pb-2"
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-bold text-lg">{item.day}</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={availability[item.key].active}
                    onChange={() => handleToggle(item.key)}
                  />
                  <span className={`slider round`} />
                </label>
              </div>
              {availability[item.key].active && (
                <div className="flex mt-2 space-x-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={availability[item.key].timeRange.start}
                      onChange={(e) =>
                        handleTimeChange(item.key, "start", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={availability[item.key].timeRange.end}
                      onChange={(e) =>
                        handleTimeChange(item.key, "end", e.target.value)
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <button
            onClick={handleSubmit}
            className="bg-yellow-400 text-gray-800 px-4 py-2 rounded focus:outline-none mt-4"
          >
            Save Availability
          </button>
        </div>
      )}
    </div>
  );
}

export default SetAvailability;
