import React from 'react';

function Docs() {
  return (
    <div className='flex'>
      <div className='bg-violet-900 px-8 py-6 w-1/3 text-white navbar'>
        <div>
          <a href="/" className="logo">
            NoQ
          </a>
        </div>
        <div className='mt-4 mb-1 p-2 text-xl hover:bg-slate-500 rounded'>
          <a href="#about"> 
            About
          </a>
        </div>
        <div className='mb-1 p-2 text-xl hover:bg-slate-500 rounded'>
          <a href="#contacts">
            Contacts
          </a>
        </div>
        <div className='mb-1 p-2 text-xl hover:bg-slate-500 rounded'>
          <a href="#feedback"> 
            Feedback
          </a>
        </div>
      </div>
      <div className='pt-20 px-9 pr-56 pb-36 bod'>
        <h1 id='about' className='text-2xl font-semibold mb-3'>About NoQ</h1>
        <p className='w-2/3'>NoQ is a comprehensive platform designed to optimize the scheduling process for service appointments across various industries. By providing a centralized hub for service providers and customers, NoQ revolutionizes the way appointments are booked and managed, ultimately minimizing wait times and enhancing efficiency.</p>
        <div id='contacts' className='flex justify-between'>
          <div>
            <h1 className='text-2xl font-semibold mt-16 mb-3'>Contacts</h1>
            <p>Company Name: NoQ.pvt.LTD<br />
               Website: [Your Website URL]<br />
               Email: demo@[yourcompany].com<br />
               Phone: +1 (555) 555-5555<br />
               Address: [Your Company Address]
            </p>
          </div>
          <div className='w-1/4'>
            <img src="https://cdn.vectorstock.com/i/1000x1000/05/22/coffee-shop-flat-young-man-vector-8930522.webp" alt="" />
          </div>
        </div>
        <h1 id='feedback' className='text-2xl font-semibold mt-16 mb-3'>Feedback</h1>
        <p className='w-2/3'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. 
        Praesentium odio odit quas facilis voluptas, laborum beatae itaque commodi magnam, 
        quidem ducimus rem eligendi recusandae quaerat alias necessitatibus maxime corrupti natus!</p>
      </div>
    </div>
  );
}

export default Docs;
