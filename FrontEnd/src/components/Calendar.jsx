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

const formatTo12Hour = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  return `${formattedHours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
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
  const [is24Hour, setIs24Hour] = useState(false);
  const [FromMonth, setFromMonth] = useState();
  const [ToMonth, setToMonth] = useState();
  


  // Toggle between 12-hour and 24-hour formats
  const toggleTimeFormat = () => {
    setIs24Hour(!is24Hour);
  };

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
          const { daysOfWeek, availability, fromMonth, toMonth } = sectionData;
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

          setEnabledDays(enabledDayClasses);  // Setting the enabled day classes
          setAvailability(availability);     // Setting the time slot availability
          setFromMonth(fromMonth);           // Setting the start month
          setToMonth(toMonth);               // Setting the end month
        } else {
          console.error('No section found with the given sectionId');
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };

    fetchAvailability();
  }, [sectionId]);

  const getMonthRange = (monthName) => {
    const year = new Date().getFullYear(); // Assuming the current year, adjust if needed.
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth(); // Get month index from name
    const startDate = new Date(year, monthIndex, 1); // First day of the month
    const endDate = new Date(year, monthIndex + 1, 0); // Last day of the month
    return { startDate, endDate };
  };



  // Apply styles for enabled and disabled days
  const applyDayStyles = () => {
  const dayMap = {
    Sunday: 'fc-day-sun',
    Monday: 'fc-day-mon',
    Tuesday: 'fc-day-tue',
    Wednesday: 'fc-day-wed',
    Thursday: 'fc-day-thu',
    Friday: 'fc-day-fri',
    Saturday: 'fc-day-sat',
  };

  // Convert FromMonth and ToMonth to date ranges
  const { startDate: fromStartDate } = getMonthRange(FromMonth); // First day of FromMonth
  const { endDate: toEndDate } = getMonthRange(ToMonth); // Last day of ToMonth

  Object.keys(dayMap).forEach(day => {
    const dayClass = dayMap[day];
    const elements = document.querySelectorAll(`.${dayClass}`);

    elements.forEach(el => {
      const dateStr = el.getAttribute('data-date');
      const date = new Date(dateStr); // Convert data-date to a Date object

      if (date < fromStartDate || date > toEndDate) {
        // Disable dates outside the FromMonth and ToMonth range
        el.classList.add('disabled-day');
        el.classList.remove('enabled-day');
        el.style.pointerEvents = 'none';
        el.style.cursor = 'default';
      } else if (enabledDays.includes(dayClass)) {
        // Enable days that fall within the date range and match enabled days
        el.classList.add('enabled-day');
        el.classList.remove('disabled-day');
        el.style.pointerEvents = 'auto';
        el.style.cursor = 'pointer';
        el.addEventListener('click', () => handleDateClick(el, day));
      } else {
        el.classList.add('disabled-day');
        el.style.pointerEvents = 'none';
        el.style.cursor = 'default';
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
    <div className='relative w-2/3 mx-auto '>
      {/* Time Slot Div */}
      {isTimeVisible && (
        <div
          ref={timeSlotDivRef}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform w-[15vw] max-h-[50vh] px-6 py-8 border text-center rounded-lg shadow-lg duration-500 
     ${availableTimeSlots.length === 0 ? 'bg-yellow-200' : 'bg-white'}
     z-10 overflow-y-auto`}
        >
          <div className='flex justify-between items-center'>
            <h1 className='mt-5 text-lg font-semibold mb-4'>On <span className='text-green-700'>{selectedDate}</span> @</h1>

            {/* Toggle Button for 12hr/24hr Format in top-right corner */}
            <button
              className='mb-6 px-2 py-1 border rounded-lg stroke-blue-500 text-gray-600 hover:bg-gray-200 transition duration-200 text-sm'
              onClick={toggleTimeFormat}
            >
              {is24Hour ? '24HR' : '12HR'}
            </button>
          </div>

          {availableTimeSlots.map((slot) => (
            <div
              key={slot}
              className={`border border-gray-300 p-2 rounded-lg mb-4 transition-colors duration-200 
         ${appointmentsdateTimePairs.includes(slot) ? 'bg-gray-200 opacity-50 cursor-not-allowed' : 'bg-gray-100 hover:bg-gray-300 cursor-pointer'}`}
              onClick={() => !appointmentsdateTimePairs.includes(slot) && handleTimeClick(slot)} // Prevent click if slot is booked
            >
              <span className="text-sm font-small">
                {is24Hour ? slot : formatTo12Hour(slot)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* FullCalendar */}
      {!isEmailVisible && (
        <div className='flex-grow w-auto'>
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin]}
            headerToolbar={{
              end: 'prev,next'
            }}
            datesSet={() => applyDayStyles()}
          />
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
          providerEmail={email}
        />
      )}
    </div>
  );
}
