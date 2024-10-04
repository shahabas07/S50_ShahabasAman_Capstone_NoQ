import React, { useEffect, useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import '../../styles/Cal.css';
import Email from './Email';
import axios from 'axios';
const API_URI = import.meta.env.VITE_API_URI;

const generateTimeSlots = (startTime, endTime) => {
  const timeSlots = [];
  const start = new Date(`2024-01-01T${startTime}:00`);
  const end = new Date(`2024-01-01T${endTime}:00`);

  while (start <= end) {
    timeSlots.push(start.toTimeString().slice(0, 5)); 
    start.setMinutes(start.getMinutes() + 30); 
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
  const timeSlotDivRef = useRef(null); 
  const [is24Hour, setIs24Hour] = useState(false);
  const [FromMonth, setFromMonth] = useState();
  const [ToMonth, setToMonth] = useState();
  


  const toggleTimeFormat = () => {
    setIs24Hour(!is24Hour);
  };

  const handleClickOutside = (event) => {
    if (timeSlotDivRef.current && !timeSlotDivRef.current.contains(event.target)) {
      setIsTimeVisible(false);
    }
  };

  useEffect(() => {
    const fetchDisabledDates = async () => {
      try {
        const response = await axios.get(`${API_URI}/disabled-dates/${userId}`);
        if (response.data) {
          const dates = response.data.map(item => item.DisabledDate.split('T')[0]); 
          setDisabledDates(dates);
        }
      } catch (error) {
        console.error('Error fetching disabled dates:', error);
      }
    };

    fetchDisabledDates();
  }, [userId]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const sectionResponse = await fetch(`${API_URI}/section/${sectionId}`);
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

          setEnabledDays(enabledDayClasses); 
          setAvailability(availability);     
          setFromMonth(fromMonth);           
          setToMonth(toMonth);               
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
    const year = new Date().getFullYear(); 
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();
    const startDate = new Date(year, monthIndex, 1); 
    const endDate = new Date(year, monthIndex + 1, 0); 
    return { startDate, endDate };
  };

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

  const { startDate: fromStartDate } = getMonthRange(FromMonth); 
  const { endDate: toEndDate } = getMonthRange(ToMonth); 

  Object.keys(dayMap).forEach(day => {
    const dayClass = dayMap[day];
    const elements = document.querySelectorAll(`.${dayClass}`);

    elements.forEach(el => {
      const dateStr = el.getAttribute('data-date');
      const date = new Date(dateStr); 

      if (date < fromStartDate || date > toEndDate) {
        el.classList.add('disabled-day');
        el.classList.remove('enabled-day');
        el.style.pointerEvents = 'none';
        el.style.cursor = 'default';
      } else if (enabledDays.includes(dayClass)) {
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

  const handleDateClick = async (el, day) => {
    const date = el.getAttribute('data-date');
    setSelectedDate(date);
    setSelectedDay(day);
    setIsTimeVisible(true);
    setIsEmailVisible(false);

    const timeRange = availability[day];
    if (timeRange) {
      const slots = generateTimeSlots(timeRange.start, timeRange.end);
      setAvailableTimeSlots(slots);

      try {
        const formattedDate = new Date(date).toISOString();
        const response = await fetch(`${API_URI}/appointment/admin/${userId}/${formattedDate}`);

        if (response.status === 404) {
          setAppointmentsdateTimePairs([]);
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

  const handleTimeClick = (time) => {
    setSelectedTimeSlot(time);
    setIsEmailVisible(true);
    setIsTimeVisible(false);

    const lastAvailableCount = availableTimeSlots.length - appointmentsdateTimePairs.length;
    setIsLastSlot(lastAvailableCount === 1);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);



  return (
    <div className='relative w-2/3 mx-auto '>
      {isTimeVisible && (
        <div
          ref={timeSlotDivRef}
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform w-[15vw] max-h-[50vh] px-6 py-8 border text-center rounded-lg shadow-lg duration-500 
     ${availableTimeSlots.length === 0 ? 'bg-yellow-200' : 'bg-white'}
     z-10 overflow-y-auto`}
        >
          <div className='flex justify-between items-center'>
            <h1 className='mt-5 text-lg font-semibold mb-4'>On <span className='text-green-700'>{selectedDate}</span> @</h1>

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