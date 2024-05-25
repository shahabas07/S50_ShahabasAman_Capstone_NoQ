import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import "./styles/Cal.css"

export default function Calendar() {
  return (
    <div className='flex'>
    <div className='w-2/3 '>
    <FullCalendar
      plugins={[dayGridPlugin]}
      headerToolbar={{
        end: 'prev,next'
      }}/>
      </div>
      <div className='Time w-[25vw] px-4 py-6 ml-5 border text-center '>
        <h1 className=' font-bold text-xl'>Time</h1>
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
);}
