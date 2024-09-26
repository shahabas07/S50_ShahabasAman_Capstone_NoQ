import React, { useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './styles/Cal.css';

const CalendarComponent = ({ userId }) => {
  const calendarRef = useRef(null); // Create a ref for FullCalendar

  useEffect(() => {
    const handleDatesSet = () => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        
        // Ensure FullCalendar is fully rendered before accessing DOM
        setTimeout(() => {
          // Select all visible cells with data-date attribute
          const dayElements = calendarApi.view.el.querySelectorAll('[data-date]');
          dayElements.forEach(el => {
            const date = el.getAttribute('data-date');
            console.log("date", date); // Log the data-date attribute
          });
        }, 0);
      }
    };

    handleDatesSet();

    // Optionally, handle view changes
    const calendarApi = calendarRef.current.getApi();
    calendarApi.on('datesSet', handleDatesSet);

    return () => {
      if (calendarApi) {
        calendarApi.off('datesSet', handleDatesSet);
      }
    };
  }, [userId]); // Re-run when userId changes

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin]}
      headerToolbar={{
        end: 'prev,next'
      }}
    />
  );
};

export default CalendarComponent;
