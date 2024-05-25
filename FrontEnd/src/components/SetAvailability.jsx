import React, { useState } from "react";
import "./styles/Availability.css";

function SetAvailability() {
  const [availability, setAvailability] = useState([
    { day: "Mondayyyy", isChecked: true },
    { day: "Tuesdayyy", isChecked: true },
    { day: "Wednesday", isChecked: true },
    { day: "Thursdayy", isChecked: true },
    { day: "Fridayyyy", isChecked: true },
    { day: "Saturdayy", isChecked: true },
    { day: "Sundayyyy", isChecked: true },
  ]);

  const handleToggle = (index) => {
    setAvailability((prevState) => {
      const newState = [...prevState];
      newState[index] = {
        ...newState[index],
        isChecked: !newState[index].isChecked,
      };
      return newState;
    });
  };

  return (
    <div className="flex flex-col items-start">
      
        {availability.map((item, index) => (
          
          <div className="flex justify-around align-middle w-full mb-3"> 
            <label className="switch">
              <input
                type="checkbox"
                checked={item.isChecked}
                onChange={() => handleToggle(index)}
              />

              <span
                className={`slider round ${
                  item.isChecked ? "slider-checked" : ""
                }`}
              ></span>
            </label>
            <span className="font-bold">{item.day}</span> 9:00 am to 4:00 pm 
          </div>
          
        ))}
      
    </div>
  );
}

export default SetAvailability;
