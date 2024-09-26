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
  const start = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);
  
  while (start <= end) {
    timeSlots.push(start.toTimeString().slice(0, 5)); // Get time in "HH:MM" format
    start.setMinutes(start.getMinutes() + 30); // Add 30 minutes
  }
  
  return timeSlots;
};

export default function Calendar({ sectionId, Adminlocation, Username, userId }) {
  const [enabledDays, setEnabledDays] = useState([]);
  const [isTimeVisible, setIsTimeVisible] = useState(false);
  const [isEmailVisible, setIsEmailVisible] = useState(false);
  const [renderTrigger, setRenderTrigger] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [availability, setAvailability] = useState({});
  const [appointmentsdateTimePairs, setAppointmentsdateTimePairs] = useState([]);
  const calendarRef = useRef(null);
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);

  useEffect(() => {
    const fetchAvailabilityAndAppointments = async () => {
      try {
        // Fetch section data
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
        console.error('Error fetching availability and appointments:', error);
      }
    };

    fetchAvailabilityAndAppointments();
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
              // Generate time slots based on start and end time
              const slots = generateTimeSlots(timeRange.start, timeRange.end);
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
  }, [enabledDays, renderTrigger]);

  const handleTimeClick = (time) => {
    setSelectedTimeSlot(time);
    setIsEmailVisible(true);
    setIsTimeVisible(false);
  };

  const onAppointmentConfirmed = (confirmed) => {
    setAppointmentConfirmed(confirmed);
  };



  const renderTimeSlots = (availableSlots, bookedSlots) => {
    return availableSlots.map((slot) => (
      <div
        key={slot}
        className={`border p-3 rounded mb-4 hover:bg-gray-300 ${bookedSlots.includes(slot) ? 'bg-gray-200 opacity-50 cursor-not-allowed' : 'bg-gray-200'}`}
        onClick={() => !bookedSlots.includes(slot) && handleTimeClick(slot)}  // Prevent click if slot is booked
      >
        {slot}
      </div>
    ));
  };

  

  const disableDate = async (day, date) => {
    const startTime = availability[day]?.start;
    const endTime = availability[day]?.end;
  
    try {
      const response = await axios.post('http://localhost:2024/disabled-dates', {
        DisabledDate: date,
        adminId: userId,
        startTime: startTime,
        endTime: endTime,
        DisabledDay: day,
      });
  
      if (response.status === 200) {
        console.log('Date disabled successfully');
      } else {
        throw new Error('Failed to disable date');
      }
    } catch (error) {
      console.error('Error disabling date:', error);
      console.log(date,userId,startTime,endTime,day)
    }
  };

  useEffect(() => {
    // Add logic for disabling date if an appointment is confirmed
    if (appointmentConfirmed && availableTimeSlots.length - appointmentsdateTimePairs.length === 1) {
      const lastSlot = availableTimeSlots[availableTimeSlots.length - 1];
      if (appointmentsdateTimePairs.includes(lastSlot)) {
        const day = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
        disableDate(day, format(new Date(selectedDate), 'yyyy-MM-dd'));
      }
    }
  }, [appointmentConfirmed, availableTimeSlots, appointmentsdateTimePairs, selectedDate]);

  

  useEffect(() => {
    const checkAndDisableDate = () => {
      console.log(availableTimeSlots.length - appointmentsdateTimePairs.length)
      if (availableTimeSlots.length - appointmentsdateTimePairs.length === 1) {
        const lastSlot = availableTimeSlots[availableTimeSlots.length - 1];
        console.log(lastSlot)

        if (appointmentsdateTimePairs.includes(lastSlot)) {
          console.log('Last slot is booked, disabling the date.');
          const day = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
          disableDate(day, format(new Date(selectedDate), 'yyyy-MM-dd'));
        }
      }
    };

    checkAndDisableDate();
  }, [availableTimeSlots, appointmentsdateTimePairs, selectedDate]);

  useEffect(() => {
    if (appointmentConfirmed) {
      // Check if the last available slot is booked
      if (availableTimeSlots.length - appointmentsdateTimePairs.length === 1) {
        const lastSlot = availableTimeSlots[availableTimeSlots.length - 1];
        if (appointmentsdateTimePairs.includes(lastSlot)) {
          const day = new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' });
          disableDate(day, format(new Date(selectedDate), 'yyyy-MM-dd'));
        }
      }
    }
  }, [appointmentConfirmed, availableTimeSlots, appointmentsdateTimePairs, selectedDate]);
  
  const fetchAndApplyBookedSlots = async () => {
    if (selectedDate) {
      const formattedDate = new Date(selectedDate).toISOString();
      try {
        const response = await fetch(`http://localhost:2024/appointment/admin/${userId}/${formattedDate}`);
        if (response.status === 404) {
          setAppointmentsdateTimePairs([]);  // Set booked slots to an empty array
        } else if (response.ok) {
          const appointments = await response.json();
          const bookedSlots = appointments.map(appointment => appointment.time);
          setAppointmentsdateTimePairs(bookedSlots);
        } else {
          console.error('Error fetching booked slots:', response.status);
        }
      } catch (error) {
        console.error('Error during fetch:', error);
        setAppointmentsdateTimePairs([]);  // Reset in case of any error
      }
    }
  };
  
  useEffect(() => {
    fetchAndApplyBookedSlots();
  }, [selectedDate, userId]);
  
  

  return (
    <div className='flex w-2/3 mx-auto'>
      {!isEmailVisible && (
        <div className='flex-grow w-auto'>
          <FullCalendar
            ref={calendarRef}
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
        <div className={`transition-transform w-[15vw] ml-10 px-4 py-6 border h-full text-center duration-500 ${isTimeVisible ? 'translate-x-0' : 'translate-x-full'} ${availableTimeSlots.length === 0 ? 'bg-yellow-200' : 'bg-gray-100'}`}>
          <h1 className='text-3xl'>Choose Time Slot</h1>
          {availableTimeSlots.length === 0 ? (
            <div className='p-4'>No slots available for this date.</div>
          ) : (
            renderTimeSlots(availableTimeSlots, appointmentsdateTimePairs)
          )}
        </div>
      )}
      {isEmailVisible && <Email timeSlot={selectedTimeSlot} date={selectedDate} userName={Username} location={Adminlocation} adminId={userId} onAppointmentConfirmed={onAppointmentConfirmed} />}
    </div>
  );
}
