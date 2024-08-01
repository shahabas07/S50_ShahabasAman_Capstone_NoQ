import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import "./styles/Cal.css";

export default function Calendar({ sectionId }) {
  const [disabledDays, setDisabledDays] = useState([]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`http://localhost:2024/section?serviceProviderId=${sectionId}`);
        const data = await response.json();
        
        // Assuming only one section is returned and we're using it
        const section = data[0];
        
        // Convert daysOfWeek object to array of disabled days
        const days = Object.keys(section.daysOfWeek).filter(day => !section.daysOfWeek[day]);

        // Map day names to FullCalendar's day-of-week indices
        const dayMap = {
          sunday: 0,
          monday: 1,
          tuesday: 2,
          wednesday: 3,
          thursday: 4,
          friday: 5,
          saturday: 6
        };
        
        const disabledDaysIndices = days.map(day => dayMap[day]);

        setDisabledDays(disabledDaysIndices);
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };

    fetchAvailability();
  }, [sectionId]);

  return (
    <div className='flex'>
      <div className='w-2/3'>
        <FullCalendar
          plugins={[dayGridPlugin]}
          headerToolbar={{
            end: 'prev,next'
          }}
          dayCellClassNames={({ date }) => {
            const dayIndex = date.getDay();
            return disabledDays.includes(dayIndex) ? 'fc-day-disabled' : '';
          }}
        />
      </div>
      <div className='Time w-[25vw] px-4 py-6 ml-5 border text-center'>
        <h1 className='font-bold text-xl'>Time</h1>
        <div className='border p-3 rounded mt-1 bg-gray-200 hover:bg-gray-300'>9AM</div>
        <div className='border p-3 rounded mt-1 bg-gray-200 hover:bg-gray-300'>10AM</div>
        <div className='border p-3 rounded mt-1 bg-gray-200 hover:bg-gray-300'>11AM</div>
        <div className='border p-3 rounded mt-1 bg-gray-200 hover:bg-gray-300'>12AM</div>
        <div className='border p-3 rounded mt-1 bg-gray-200 hover:bg-gray-300'>1PM</div>
        <div className='border p-3 rounded mt-1 bg-gray-200 hover:bg-gray-300'>2PM</div>
        <div className='border p-3 rounded mt-1 bg-gray-200 hover:bg-gray-300'>3PM</div>
        <div className='border p-3 rounded mt-1 bg-gray-200 hover:bg-gray-300'>4PM</div>
      </div>
    </div>
  );
}
