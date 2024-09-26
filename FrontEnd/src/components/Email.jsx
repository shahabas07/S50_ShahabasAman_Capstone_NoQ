import React, { useState } from "react";
import axios from "axios";

const MailComponent = ({ date, timeSlot, location, userName, adminId, onAppointmentConfirmed }) => {
  const [showOTP, setShowOTP] = useState(false);
  const [otpEntered, setOtpEntered] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');

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
            const confirmResponse = await axios.post('http://localhost:2024/mail/confirm-email', {
              appointment,
            });
  
            if (confirmResponse.status === 200) {
              setOtpEntered(true);
              // Pass appointment details to parent for processing
              onAppointmentConfirmed(true, {
                date,
                timeSlot,
                appointmentId: appointment._id,
              });
              setTimeout(() => {
                window.location.reload();
              }, 5000);
            } else {
              alert('Failed to send confirmation email');
            }
          } else {
            alert('Failed to create appointment');
          }
        } else {
          alert('Invalid OTP');
        }
      } catch (error) {
        alert('Error verifying OTP or sending confirmation email');
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
