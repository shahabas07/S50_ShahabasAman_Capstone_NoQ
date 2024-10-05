import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/Availability.css";
const API_URI = import.meta.env.VITE_API_URI;

const daysOfWeek = [
  { day: "Sunday", key: "Sunday" },
  { day: "Monday", key: "Monday" },
  { day: "Tuesday", key: "Tuesday" },
  { day: "Wednesday", key: "Wednesday" },
  { day: "Thursday", key: "Thursday" },
  { day: "Friday", key: "Friday" },
  { day: "Saturday", key: "Saturday" }
];

function SetAvailability({ sectionId, adminId }) {
  const [availability, setAvailability] = useState(
    daysOfWeek.reduce(
      (acc, day) => ({
        ...acc,
        [day.key]: { active: false, timeRange: { start: "", end: "" } }
      }),
      {}
    )
  );
  const [fromMonth, setFromMonth] = useState("");
  const [toMonth, setToMonth] = useState("");
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  useEffect(() => {
    axios
      .get(`${API_URI}/section/${sectionId}`)
      .then((response) => {
        const section = response.data;
        const newAvailability = {};
        setFromMonth(section.fromMonth || "");
        setToMonth(section.toMonth || "");

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
      start.setMinutes(start.getMinutes() + 30);
    }

    return slots;
  };

  const handleToggle = (key) => {
    const newAvailability = {
      ...availability,
      [key]: {
        ...availability[key],
        active: !availability[key].active,
        timeRange: { start: "", end: "" } 
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

    setAvailability(newAvailability);
  };

  const getEndTimeOptions = (startTime) => {
    if (!startTime) return [];

    const start = new Date(`1970-01-01T${startTime}`);
    const endTime = "24:00"; 
    const endTimeOptions = [];

    start.setMinutes(start.getMinutes() + 30);

    while (start < new Date(`1970-01-01T${endTime}`)) {
      endTimeOptions.push(start.toTimeString().substring(0, 5));
      start.setMinutes(start.getMinutes() + 30);
    }

    return endTimeOptions;
  };

  const handleSubmit = () => {
    const daysOfWeekData = {};
    const availabilityData = {};

    Object.keys(availability).forEach((day) => {
      daysOfWeekData[day] = availability[day].active;
      if (availability[day].active) {
        availabilityData[day] = {
          start: availability[day].timeRange.start,
          end: availability[day].timeRange.end,
        };
      }
    });

    const payload = {
      daysOfWeek: daysOfWeekData,
      availability: availabilityData,
      fromMonth: fromMonth,
      toMonth: toMonth
    };

    console.log(payload);

    axios
      .put(`${API_URI}/section/${sectionId}`, payload)
      .then((response) => {
        console.log("Availability updated:", response.data);
        alert("Availability updated successfully!");

        axios
          .get(`${API_URI}/disabled-dates/${adminId}`)
          .then((disabledDatesResponse) => {
            console.log("Disabled dates fetched:", disabledDatesResponse.data);

            const availability = response.data.availability;
            console.log("Availability:", availability);
            const disabledDates = disabledDatesResponse.data;
            console.log("Disabled Dates:", disabledDates);

            for (const [day, time] of Object.entries(availability)) {
              const disabledDate = disabledDates.find(date => date.DisabledDay === day);
              if (disabledDate) {
                const { _id: disabledId, startTime, endTime } = disabledDate;

                if (time.start < startTime || time.end > endTime) {
                  console.log(`Deleting disabled date with ID ${disabledId} due to conditions being met.`);

                  axios
                    .delete(`${API_URI}/disabled-dates/${disabledId}`)
                    .then(() => {
                      console.log(`Disabled date with ID ${disabledId} deleted successfully.`);
                    })
                    .catch((deleteError) => {
                      console.error(`Error deleting disabled date with ID ${disabledId}:`, deleteError);
                    });
                } else {
                  console.log(`No action needed for disabled date ID ${disabledId}.`);
                }
              }
            }
          })
          .catch((error) => {
            console.error("There was an error fetching disabled dates!", error);
          });
      })
      .catch((error) => {
        console.error("There was an error updating the availability!", error);
        alert("Failed to update availability.");
      });
  };

  const getToMonthOptions = (from) => {
    const startIndex = monthNames.indexOf(from) + 1;
    return monthNames.slice(startIndex, 12);
  };

  return (
    <div>
      <div className="flex flex-col items-start p-4 bg-white shadow-lg rounded-lg">
        <div className="flex space-x-4 mb-4">
          
            <label className="block text-sm mt-2 font-medium text-gray-700">From</label>
            <select
              value={fromMonth}
              onChange={(e) => {
                setFromMonth(e.target.value);
                setToMonth("");
              }}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">From</option>
              {monthNames.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          
            <label className="block text-sm mt-2 font-medium text-gray-700">To</label>
            <select
              value={toMonth}
              onChange={(e) => setToMonth(e.target.value)}
              disabled={!fromMonth}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="">To</option>
              {fromMonth && getToMonthOptions(fromMonth).map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
         
        </div>
        {daysOfWeek.map((item) => (
          <div key={item.key} className="flex flex-col w-full mb-4 border-b pb-2">
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
                  <select
                    value={availability[item.key].timeRange.start}
                    onChange={(e) => handleTimeChange(item.key, "start", e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select Start Time</option>
                    {generateTimeSlots("00:00", "24:00").map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    End Time
                  </label>
                  <select
                    value={availability[item.key].timeRange.end}
                    onChange={(e) => handleTimeChange(item.key, "end", e.target.value)}
                    disabled={!availability[item.key].timeRange.start} // Disable if start time is not selected
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="">Select End Time</option>
                    {getEndTimeOptions(availability[item.key].timeRange.start).map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="SaveAvailability bg-yellow-400 text-gray-800 px-4 py-2 rounded focus:outline-none mt-4"
        >
          Save Availability
        </button>
      </div>
    </div>
  );
}

export default SetAvailability;