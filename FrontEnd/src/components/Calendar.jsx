import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './styles/Cal.css';

export default function Calendar({ sectionId }) {
  const [enabledDays, setEnabledDays] = useState([]);
  const [isTimeVisible, setIsTimeVisible] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`http://localhost:2024/section?serviceProviderId=${sectionId}`);
        const data = await response.json();

        const section = data.find(item => item._id === sectionId);

        if (section) {
          const daysOfWeek = section.daysOfWeek;
          console.log(daysOfWeek, sectionId, data);

          const allDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

          const enabledDays = allDays.filter(day => daysOfWeek[day]);

          const dayMap = {
            sunday: 'fc-day-sun',
            monday: 'fc-day-mon',
            tuesday: 'fc-day-tue',
            wednesday: 'fc-day-wed',
            thursday: 'fc-day-thu',
            friday: 'fc-day-fri',
            saturday: 'fc-day-sat'
          };

          const enabledDayClasses = enabledDays.map(day => dayMap[day]);

          setEnabledDays(enabledDayClasses);
        } else {
          console.error('No section found with the given sectionId');
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };

    fetchAvailability();
  }, [sectionId]);

  const applyDayStyles = () => {
    const dayMap = {
      sunday: 'fc-day-sun',
      monday: 'fc-day-mon',
      tuesday: 'fc-day-tue',
      wednesday: 'fc-day-wed',
      thursday: 'fc-day-thu',
      friday: 'fc-day-fri',
      saturday: 'fc-day-sat'
    };

    // Apply styles to each day class
    Object.keys(dayMap).forEach(day => {
      const dayClass = dayMap[day];
      const elements = document.querySelectorAll(`.${dayClass}`);
      elements.forEach(el => {
        if (enabledDays.includes(dayClass)) {
          el.classList.add('enabled-day');
          el.addEventListener('click', () => {
            setIsTimeVisible(true);
          });
        }
      });
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      applyDayStyles();
    }, 0);

    return () => clearTimeout(timer);
  }, [enabledDays]);

  return (
    <div className='flex w-2/3 mx-auto'>
      <div className='flex-grow w-auto'>
        <FullCalendar
          plugins={[dayGridPlugin]}
          headerToolbar={{
            end: 'prev,next'
          }}
        />
      </div>
      <div className={`Time w-[15vw] px-4 py-6 ml-5 border h-full text-center transition-transform duration-500 ${isTimeVisible ? 'translate-x-0' : 'translate-x-full'} ${isTimeVisible ? 'block' : 'hidden'}`}>
        <h1 className='font-bold text-xl'>Time</h1>
        <div className='mt-10 border p-3 rounded mt-1 bg-gray-200 mb-8 hover:bg-gray-300'>9AM</div>
        <div className='border p-3 rounded mt-1 bg-gray-200 mb-8 hover:bg-gray-300'>10AM</div>
        <div className='border p-3 rounded mt-1 bg-gray-200 mb-8 hover:bg-gray-300'>11AM</div>
        <div className='border p-3 rounded mt-1 bg-gray-200 mb-8 hover:bg-gray-300'>12AM</div>
        <div className='border p-3 rounded mt-1 bg-gray-200 mb-8 hover:bg-gray-300'>1PM</div>
        <div className='border p-3 rounded mt-1 bg-gray-200 mb-8 hover:bg-gray-300'>2PM</div>
        <div className='border p-3 rounded mt-1 bg-gray-200 mb-8 hover:bg-gray-300'>3PM</div>
        <div className='border p-3 rounded mt-1 bg-gray-200 mb-8 hover:bg-gray-300'>4PM</div>
      </div>
    </div>
  );
}
