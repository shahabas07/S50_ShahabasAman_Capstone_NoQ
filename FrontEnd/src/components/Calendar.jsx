import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './styles/Cal.css';
import Email from './Email';

export default function Calendar({ sectionId, Adminlocation, Username, userId }) {
  const [enabledDays, setEnabledDays] = useState([]);
  const [isTimeVisible, setIsTimeVisible] = useState(false);
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [availability, setAvailability] = useState({});
  const [appointments, setAppointments] = useState([]);

  useEffect(()=>{
    const fetchAppointment = async () => {
      try {
        const response = await fetch(`http://localhost:2024/appointment/adminId/${userId}`);
        const data = await response.json();
        console.log("appoinmentDetails:", data);

        const filteredAppointments = data.filter(appointment => appointment.adminId === userId);
        console.log("filteredAppointments:", filteredAppointments);

        setAppointments(fetchAppointments);
      }
      catch(error){
        console.log('error on filteredAppoinmtmnts:',error);
      }
    };
    fetchAppointment();
  }, [userId])


  

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`http://localhost:2024/section/${sectionId}`);
        const data = await response.json();
        console.log('Fetched data:', data);

        const section = data;
        console.log('Section:', section);

        if (section) {
          const { daysOfWeek, availability } = section;

          const dayMap = {
            Sunday: 'fc-day-sun',
            Monday: 'fc-day-mon',
            Tuesday: 'fc-day-tue',
            Wednesday: 'fc-day-wed',
            Thursday: 'fc-day-thu',
            Friday: 'fc-day-fri',
            Saturday: 'fc-day-sat'
          };

          const enabledDays = Object.keys(daysOfWeek).filter(day => daysOfWeek[day]);
          console.log('Enabled Days:', enabledDays);

          const enabledDayClasses = enabledDays.map(day => dayMap[day]);
          setEnabledDays(enabledDayClasses);
          setAvailability(availability);

          // Automatically select the first enabled day and update available time slots
          if (enabledDays.length > 0) {
            const firstEnabledDay = enabledDays[0];
            const timeRange = availability[firstEnabledDay];
            console.log('Time Range:', timeRange);
            if (timeRange) {
              const slots = timeRange.timeSlots.map(slot => slot.time);
              setAvailableTimeSlots(slots);
            }
          }
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
      Sunday: 'fc-day-sun',
      Monday: 'fc-day-mon',
      Tuesday: 'fc-day-tue',
      Wednesday: 'fc-day-wed',
      Thursday: 'fc-day-thu',
      Friday: 'fc-day-fri',
      Saturday: 'fc-day-sat'
    };

    Object.keys(dayMap).forEach(day => {
      const dayClass = dayMap[day];
      const elements = document.querySelectorAll(`.${dayClass}`);
      elements.forEach(el => {
        if (enabledDays.includes(dayClass)) {
          el.classList.add('enabled-day');
          el.addEventListener('click', () => {
            const date = el.getAttribute('data-date');
            console.log('Clicked Date:', date);
            setSelectedDate(date);
            setIsTimeVisible(true);
            setIsEmailVisible(false);
            setRenderTrigger(prev => !prev);

            const timeRange = availability[day];
            if (timeRange) {
              const slots = timeRange.timeSlots.map(slot => slot.time);
              setAvailableTimeSlots(slots);
            }
          });
        } else {
          el.classList.add('disabled-day');
          el.addEventListener('click', () => {
            console.log('Clicked on a disabled day');
          });
        }
      });
    });
  };

  useEffect(() => {
    // Initial call to apply day styles
    applyDayStyles();

    // Reapply day styles on calendar view change
    const handleDatesSet = () => {
      applyDayStyles();
    };

    // Attach event listener for dates set
    const calendarApi = document.querySelector('.fc');
    if (calendarApi) {
      calendarApi.addEventListener('datesSet', handleDatesSet);
    }

    return () => {
      if (calendarApi) {
        calendarApi.removeEventListener('datesSet', handleDatesSet);
      }
    };
  }, [enabledDays, renderTrigger]);

  const handleTimeClick = (time) => {
    setSelectedTimeSlot(time);
    setIsEmailVisible(true);
    setIsTimeVisible(false);
  };

  return (
    <div className='flex w-2/3 mx-auto'>
      {!isEmailVisible && (
        <div className='flex-grow w-auto'>
          <FullCalendar
            key={renderTrigger}
            plugins={[dayGridPlugin]}
            headerToolbar={{
              end: 'prev,next'
            }}
            datesSet={() => applyDayStyles()}  // Reapply styles on date change
          />
        </div>
      )}
      {!isEmailVisible && isTimeVisible && (
        <div className={`transition-transform w-[15vw] ml-10 px-4 py-6 border h-full text-center duration-500 ${isTimeVisible ? 'translate-x-0' : 'translate-x-full'} ${isTimeVisible ? 'block' : 'hidden'}`}>
          <h1 className='font-bold text-xl'>Slot Time</h1>
          {availableTimeSlots.map((time) => (
            <div
              key={time}
              className='border p-3 rounded mb-4 hover:bg-gray-300 bg-gray-200'
              onClick={() => handleTimeClick(time)}  // Click to select time
            >
              {time}
            </div>
          ))}
        </div>
      )}

      {isEmailVisible && <Email selectedDate={selectedDate} selectedTimeSlot={selectedTimeSlot} locat={Adminlocation} Username={Username} userId={userId} />}
    </div>
  );
}
