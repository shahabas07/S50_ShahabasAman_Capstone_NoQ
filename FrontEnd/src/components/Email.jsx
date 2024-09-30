import React, { useState } from "react";
import axios from "axios";

const MailComponent = ({ date, timeSlot, location, userName, adminId, isLastSlot, day, startTime, endTime, providerEmail }) => {
  const [showOTP, setShowOTP] = useState(false);
  const [otpEntered, setOtpEntered] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  console.log(providerEmail)

  const handleConfirmClick = async () => {
    if (name && email) {
      try {
        const response = await axios.post('http://localhost:2024/mail/send-otp', { email });

        if (response.status === 200) {
          setShowOTP(true);
          alert('OTP sent to your email');
        } else {
          alert('Failed to send OTP');
        }
      } catch (error) {
        alert('Error sending OTP');
      }
    } else {
      alert('Please enter both name and email');
    }
  };

  const handleOTPSubmit = async () => {
    if (otp) {
      try {
        const response = await axios.post('http://localhost:2024/mail/verify-otp', { email, otp });
  
        if (response.status === 200) {
          const appointmentResponse = await axios.post('http://localhost:2024/appointment/create', {
            appointmentDate: date,
            location: location,
            time: timeSlot,
            email,
            customerName: name,
            adminName: userName,
            adminId: adminId
          });
  
          if (appointmentResponse.status === 201) {
            const appointment = appointmentResponse.data.appointment;
  
            // Send confirmation email with full appointment object
            await axios.post('http://localhost:2024/mail/confirm-email', {
              appointment,
              providerEmail,  // Add provider's email here
            });
            
  
            // Check if this is the last slot and disable the date
            if (isLastSlot) {
              try {
                const disableDateResponse = await axios.post('http://localhost:2024/disabled-dates', {
                  DisabledDate: date,
                  adminId,
                  startTime,
                  endTime,
                  DisabledDay: day // Ensure this key matches the backend
                });
  
                console.log(disableDateResponse); // Log the response for debugging
                if (disableDateResponse.status !== 201) {
                  alert('Failed to disable the date');
                }
              } catch (error) {
                console.error('Error disabling the date:', error.response.data); // Log specific error
                alert('Error disabling the date. Check console for details.');
              }
            }
  
            setOtpEntered(true);
            // Pass appointment details to parent for processing
            
  
            // Set a timeout to reload the page after a successful appointment
            setTimeout(() => {
              window.location.reload();
            }, 4000);
          } else {
            alert('Failed to create appointment');
          }
        } else {
          alert('Invalid OTP');
        }
      } catch (error) {
        console.error('Error verifying OTP or sending confirmation email:', error); // Log the error
        alert('Error verifying OTP or sending confirmation email. Check console for details.');
      }
    } else {
      alert('Please enter the OTP');
    }
  };
  


  return (
    <div className="flex w-full">
      {/* Left Section */}
      <div className="w-1/3 bg-gray-100 p-4">
        <div className="mb-5 flex items-center">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 4h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h1z"
            />
          </svg>
          <span>Calendar Date: {date || "Not selected"}</span>
        </div>
        <div className="mb-5 flex items-center">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 10c2.21 0 4-1.79 4-4S14.21 2 12 2 8 3.79 8 6s1.79 4 4 4z"
            />
          </svg>
          <span>Location: {location || "Location not shared"}</span>
        </div>
        <div className="mb-5 flex items-center">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"
            />
          </svg>
          <span>Time Slot: {timeSlot || "Not selected"}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-2/3 bg-white p-4">
        {!showOTP && !otpEntered ? (
          <>
            <input
              type="text"
              className="w-full border p-2 mb-4"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              className="w-full border p-2 mb-4"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white p-2 mb-4"
              onClick={handleConfirmClick}
            >
              Confirm
            </button>
            <button className="w-full bg-red-500 text-white p-2" onClick={() => window.location.reload()}>
              Cancel
            </button>
          </>
        ) : !otpEntered ? (
          <>
            <input
              type="text"
              className="w-full border p-2 mb-4"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full bg-blue-500 text-white p-2"
              onClick={handleOTPSubmit}
            >
              Submit OTP
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-green-500 text-xl">OTP Verified Successfully!</p>
            <p>Redirecting in 5 seconds...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailComponent;
