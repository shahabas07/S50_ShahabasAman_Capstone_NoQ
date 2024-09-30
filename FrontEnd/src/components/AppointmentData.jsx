import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { CSSTransition } from 'react-transition-group';
import './styles/AppointmentData.css'; // For custom animations

// Set the app element for accessibility
Modal.setAppElement('#root');

const AppointmentData = ({ adminId }) => {
  const [appointments, setAppointments] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointments, setShowAppointments] = useState(false); // State to toggle appointments visibility

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:2024/appointment/admin/${adminId}`);
        const data = await response.json();
        // Sort by appointment date and time
        data.sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [adminId]);

  const openModal = (appointment) => {
    setSelectedAppointment(appointment);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedAppointment(null);
  };

  return (
    <div className="container p-4 mx-auto">
      {/* Toggle Button with animation */}
      <button
        onClick={() => setShowAppointments(!showAppointments)}
        className="bg-violet-700 text-white px-4 py-2 rounded focus:outline-none mb-4"
      >
        {showAppointments ? "Hide Appointments" : "Show Appointments"}
      </button>

      {/* CSSTransition for appointment list animations */}
      <CSSTransition
        in={showAppointments}
        timeout={300}
        classNames="appointment-list"
        unmountOnExit
      >
        <div>
          <h1 className="mb-6 text-2xl font-bold text-center">Appointments</h1>
          <div className="grid grid-cols-1 gap-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="p-4 transition-transform transform bg-white rounded-lg shadow-lg cursor-pointer hover:scale-105"
                onClick={() => openModal(appointment)}
              >
                <h2 className="text-lg font-semibold">{`${new Date(appointment.appointmentDate).toLocaleDateString()} at ${appointment.time}`}</h2>
                <p className="text-gray-600">{`Customer: ${appointment.customerName}`}</p>
              </div>
            ))}
          </div>
        </div>
      </CSSTransition>

      {/* Modal for detailed information */}
      <CSSTransition
        in={modalIsOpen}
        timeout={300}
        classNames="modal"
        unmountOnExit
      >
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="relative w-1/4 mx-auto mt-16 text-center transition-transform transform border-8 border-gray-800 rounded-lg shadow-lg p-6 bg-gradient-to-r from-blue-200 to-purple-100"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center"
        >
          {selectedAppointment && (
            <>
              {/* SVG Close Icon */}
              <svg
                onClick={closeModal}
                className="absolute text-black transition cursor-pointer top-4 right-4 hover:text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                width="24"
                height="24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>

              <h2 className="mb-6 text-xl font-bold">Appointment Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <strong className="text-left">Date:</strong>
                  <span className="text-right">{new Date(selectedAppointment.appointmentDate).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between">
                  <strong className="text-left">Time:</strong>
                  <span className="text-right">{selectedAppointment.time}</span>
                </div>

                <div className="flex justify-between">
                  <strong className="text-left">Location:</strong>
                  <span className="text-right">{selectedAppointment.location}</span>
                </div>

                <div className="flex justify-between">
                  <strong className="text-left">Email:</strong>
                  <span className="text-right">{selectedAppointment.email}</span>
                </div>

                <div className="flex justify-between">
                  <strong className="text-left">Customer Name:</strong>
                  <span className="text-right">{selectedAppointment.customerName}</span>
                </div>

                <div className="flex justify-between">
                  <strong className="text-left">Admin Name:</strong>
                  <span className="text-right">{selectedAppointment.adminName}</span>
                </div>
              </div>
            </>
          )}
        </Modal>
      </CSSTransition>
    </div>
  );
};

export default AppointmentData;
