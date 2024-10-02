import React, { useState } from "react";
import axios from "axios";

const MailComponent = ({ date, timeSlot, location, userName, adminId, isLastSlot, day, startTime, endTime, providerEmail }) => {
  const [showOTP, setShowOTP] = useState(false);
  const [otpEntered, setOtpEntered] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleConfirmClick = async () => {
    if (name && email) {
      setLoading(true); // Start loading
      try {
        const response = await axios.post('http://localhost:2024/mail/send-otp', { email });

        if (response.status === 200) {
          setShowOTP(true);
        } else {
          alert('Failed to send OTP');
        }
      } catch (error) {
        alert('Error sending OTP');
      } finally {
        setLoading(false); // Stop loading after response
      }
    } else {
      alert('Please enter both name and email');
    }
  };

  const handleOTPSubmit = async () => {
    if (otp) {
      setOtpLoading(true); // Start OTP verification loading
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

            // Disable date if it's the last slot
            if (isLastSlot) {
              try {
                const disableDateResponse = await axios.post('http://localhost:2024/disabled-dates', {
                  DisabledDate: date,
                  adminId,
                  startTime,
                  endTime,
                  DisabledDay: day
                });

                if (disableDateResponse.status !== 201) {
                  alert('Failed to disable the date');
                }
              } catch (error) {
                console.error('Error disabling the date:', error.response.data);
                alert('Error disabling the date. Check console for details.');
              }
            }

            setOtpEntered(true);

            setTimeout(() => {
              window.location.reload();
            }, 2500);
          } else {
            alert('Failed to create appointment');
          }
        } else {
          alert('Invalid OTP');
        }
      } catch (error) {
        alert('Error verifying OTP or sending confirmation email. Check console for details.');
      } finally {
        setOtpLoading(false); // Stop OTP verification loading
      }
    } else {
      alert('Please enter the OTP');
    }
  };

  return (
    <div className="flex w-full bg-gray-50 p-6 rounded-lg shadow-lg">
      {/* Left Section */}
      <div className="w-1/3 bg-gray-200 p-6 rounded-lg shadow-inner">
        <div className="mb-6 flex items-center text-gray-700">
          <span className="text-lg">Calendar Date: {date || "Not selected"}</span>
        </div>
        <div className="mb-6 flex items-center text-gray-700">
          <span className="text-lg">Location: {location || "Location not shared"}</span>
        </div>
        <div className="flex items-center text-gray-700">
          <span className="text-lg">Time Slot: {timeSlot || "Not selected"}</span>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-2/3 bg-white p-6 rounded-lg shadow-lg">
        {!showOTP && !otpEntered ? (
          <>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="w-full bg-violet-600 text-white p-3 rounded-lg hover:bg-violet-700 transition duration-200"
              onClick={handleConfirmClick}
              disabled={loading} // Disable button while loading
            >
              {loading ? 'Sending OTP...' : 'Confirm'}
            </button>
            <button
  className="w-full border border-gray-500 text-gray-500 p-3 rounded-lg hover:bg-gray-600 hover:text-white transition duration-200 mt-4"
  onClick={() => window.location.reload()}
>
                Cancel
            </button>
          </>
        ) : !otpEntered ? (
          <>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full bg-violet-600 text-white p-3 rounded-lg hover:bg-violet-700 transition duration-200"
              onClick={handleOTPSubmit}
              disabled={otpLoading} // Disable button while loading
            >
              {otpLoading ? 'Verifying OTP...' : 'Submit OTP'}
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-green-500 text-xl font-semibold">OTP Verified Successfully!</p>
            <p className="text-gray-600">Redirecting to slots...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MailComponent;
