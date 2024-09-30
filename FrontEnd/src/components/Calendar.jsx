import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './styles/Cal.css';
import Email from './Email';
import { format } from 'date-fns';
import axios from 'axios';

// Utility function to generate 30-minute interval time slots
const generateTimeSlots = (startTime, endTime) => {
  const timeSlots = [];
  const start = new Date(`2024-01-01T${startTime}:00`);
  const end = new Date(`2024-01-01T${endTime}:00`);

  while (start <= end) {
    timeSlots.push(start.toTimeString().slice(0, 5)); // Get time in "HH:MM" format
    start.setMinutes(start.getMinutes() + 30); // Add 30 minutes
  }

  return timeSlots;
};

export default function Calendar({ sectionId, Adminlocation, Username, userId, email }) {
  const [enabledDays, setEnabledDays] = useState([]);
  const [isTimeVisible, setIsTimeVisible] = useState(false);
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  // const [renderTrigger, setRenderTrigger] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [availability, setAvailability] = useState({});
  const [appointmentsdateTimePairs, setAppointmentsdateTimePairs] = useState([]);
  const calendarRef = useRef(null);
  const [isLastSlot, setIsLastSlot] = useState(false);
  const [disabledDates, setDisabledDates] = useState([]);
  const timeSlotDivRef = useRef(null); // Create a ref for the time slot div

  // Function to handle clicks outside the time slot div
  const handleClickOutside = (event) => {
    if (timeSlotDivRef.current && !timeSlotDivRef.current.contains(event.target)) {
      setIsTimeVisible(false); // Close the time slot div if clicked outside
    }
  };

  // Fetch disabled dates for the user on component mount or userId change
  useEffect(() => {
    const fetchDisabledDates = async () => {
      try {
        const response = await axios.get(`http://localhost:2024/disabled-dates/${userId}`);
        if (response.data) {
          // Extract DisabledDate from each response object
          const dates = response.data.map(item => item.DisabledDate.split('T')[0]); // Extracting the date part
          setDisabledDates(dates); // Update the state with the extracted dates
        }
      } catch (error) {
        console.error('Error fetching disabled dates:', error);
      }
    };

    fetchDisabledDates();
  }, [userId]);

  // Fetch availability for the section on component mount or sectionId change
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const sectionResponse = await fetch(`http://localhost:2024/section/${sectionId}`);
        const sectionData = await sectionResponse.json();

        if (sectionData) {
          const { daysOfWeek, availability } = sectionData;
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
          const enabledDayClasses = enabledDays.map(day => dayMap[day]);
          setEnabledDays(enabledDayClasses);
          setAvailability(availability);
        } else {
          console.error('No section found with the given sectionId');
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };

    fetchAvailability();
  }, [sectionId]);

  // Apply styles for enabled and disabled days
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
        const date = el.getAttribute('data-date');
        // Disable date if it exists in disabledDates
        if (disabledDates.includes(date)) {
          el.classList.add('disabled-day');
          el.classList.remove('enabled-day');
          el.style.pointerEvents = 'none'; // Prevent interactions with disabled dates
          el.style.cursor = 'default'; // Change cursor to indicate disabled state
        } else if (enabledDays.includes(dayClass)) {
          el.classList.add('enabled-day');
          el.addEventListener('click', () => handleDateClick(el, day));
        } else {
          el.classList.add('disabled-day');
        }
      });
    });
  };

  // Reapply day styles when enabledDays, disabledDates, or renderTrigger changes
  useEffect(() => {
    applyDayStyles();
    const handleDatesSet = () => {
      applyDayStyles();
    };

    const calendarApi = document.querySelector('.fc');
    if (calendarApi) {
      calendarApi.addEventListener('datesSet', handleDatesSet);
    }

    return () => {
      if (calendarApi) {
        calendarApi.removeEventListener('datesSet', handleDatesSet);
      }
    };
  }, [enabledDays, disabledDates]);

  // Handle date click to show available time slots
  const handleDateClick = async (el, day) => {
    const date = el.getAttribute('data-date');
    setSelectedDate(date);
    setSelectedDay(day);
    setIsTimeVisible(true);
    setIsEmailVisible(false);
    // setRenderTrigger(prev => !prev);

    const timeRange = availability[day]; // Get the time range for the selected day
    if (timeRange) {
      const slots = generateTimeSlots(timeRange.start, timeRange.end);
      setAvailableTimeSlots(slots);

      try {
        const formattedDate = new Date(date).toISOString();
        const response = await fetch(`http://localhost:2024/appointment/admin/${userId}/${formattedDate}`);

        if (response.status === 404) {
          setAppointmentsdateTimePairs([]); // Set booked slots to an empty array
        } else if (response.ok) {
          const appointments = await response.json();
          const bookedSlots = appointments.map(appointment => appointment.time);
          setAppointmentsdateTimePairs(bookedSlots);
        } else {
          console.error('Error fetching booked slots:', response.status);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
        setAppointmentsdateTimePairs([]);
      }
    }
  };

  // Handle time slot selection and check if it's the last available slot
  const handleTimeClick = (time) => {
    setSelectedTimeSlot(time);
    setIsEmailVisible(true);
    setIsTimeVisible(false);

    const lastAvailableCount = availableTimeSlots.length - appointmentsdateTimePairs.length;
    setIsLastSlot(lastAvailableCount === 1); // Set state to true if it's the last slot
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='flex w-2/3 mx-auto'>
      {!isEmailVisible && (
        <div className='flex-grow w-auto'>
          <FullCalendar
            ref={calendarRef}
            // key={renderTrigger}
            plugins={[dayGridPlugin]}
            headerToolbar={{
              end: 'prev,next'
            }}
            datesSet={() => applyDayStyles()}
          />
        </div>
      )}
      {!isEmailVisible && isTimeVisible && (
        <div 
          ref={timeSlotDivRef} // Attach the ref to the div
          className={`transition-transform w-[15vw] ml-10 px-4 py-6 border h-full text-center duration-500 ${isTimeVisible ? 'translate-x-0' : 'translate-x-full'} ${availableTimeSlots.length === 0 ? 'bg-yellow-200' : 'bg-gray-100'}`}
        >
          <h1 className='text-3xl'>Choose Time Slot</h1>
          {availableTimeSlots.length === 0 ? (
            <div className='p-4'>No slots available for this date.</div>
          ) : (
            availableTimeSlots.map((slot) => (
              <div
                key={slot}
                className={`border p-3 rounded mb-4 hover:bg-gray-300 ${appointmentsdateTimePairs.includes(slot) ? 'bg-gray-200 opacity-50 cursor-not-allowed' : 'bg-gray-200'}`}
                onClick={() => !appointmentsdateTimePairs.includes(slot) && handleTimeClick(slot)} // Prevent click if slot is booked
              >
                {slot}
              </div>
            ))
          )}
        </div>
      )}
      {isEmailVisible && (
        <Email 
          timeSlot={selectedTimeSlot} 
          date={selectedDate} 
          day={selectedDay} 
          isLastSlot={isLastSlot} 
          userName={Username} 
          location={Adminlocation} 
          adminId={userId} 
          startTime={availability[selectedDay]?.start} 
          endTime={availability[selectedDay]?.end} 
          providerEmail = {email}
        />
      )}
    </div>
  );
}
