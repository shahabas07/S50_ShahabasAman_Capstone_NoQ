import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Calendar from "./customerView/Calendar";
import SetAvailability from "./providerView/SetAvailability";
import AppointmentData from "./providerView/AppointmentData"
import DeleteModal from "./providerView/DeleteModal";
import EditProfile from "./providerView/EditProfile";
import QR from "./QR";
import NoQ from "../../assets/NoQ.png";
import DisableDate from "./providerView/DisableDate"
import LogoutModal from "./providerView/Logout"
import LinearProgress from "@mui/material/LinearProgress";
const API_URI = import.meta.env.VITE_API_URI;

const Profile = () => {
  const { User } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [jwtUsername, setJwtUsername] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);

  useEffect(() => {
    axios
      .get(`${API_URI}/profile`)
      .then((response) => {
        const profiles = response.data;
        const userProfile = profiles.find(
          (profile) => profile.username === User
        );

        if (userProfile) {
          setProfileData(userProfile);
          const jwt = getCookies("token");
          if (jwt) {
            const decodedToken = jwt.split(".")[1];
            const decodedString = atob(decodedToken);
            const jwtPayload = JSON.parse(decodedString);
            setJwtUsername(jwtPayload.username);
          }
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
        setLoading(false);
        setError(true);
      });
  }, [User]);

  const getCookies = (name) => {
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].split("=");
      if (cookie[0] === name) {
        return cookie[1];
      }
    }
    return null;
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCancel = () => {
    setShowDeleteModal(false);
  };

  const handleConfirm = async (id, username) => {
    try {
      const profileResponse = await axios.delete(
        `${API_URI}/profile/${id}`
      );
      console.log(profileResponse.data.message);
      const serviceResponse = await axios.delete(
        `${API_URI}/service/${username}`
      );
      console.log(serviceResponse.data.message);
      window.location.reload();
    } catch (error) {
      if (error.response) {
        console.error("Failed to delete:", error.response.data.message);
      } else {
        console.error("Error deleting:", error.message);
      }
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const QRPopup = () => {
    setPopupVisible(!popupVisible);
  };

  const handleClose = () => {
    setPopupVisible(false); 
  };


  const openEditProfilePopup = () => {
    setIsOpen(!isOpen);
    setEditProfileVisible(true);
  };

  const closeEditProfilePopup = () => {
    setEditProfileVisible(false);
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };
  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };
  const handleLogoutConfirm = () => {
    // Clear cookies (you might want to clear specific cookies depending on your app)
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    window.location.href = '/';
  };

  return (
    <div className="bg-gray-300 min-h-screen p-6">
      <a href="/" className="logo text-black pl-6 ">
        NoQ
      </a>
      {loading ? (
        <div className="flex flex-col justify-center items-center space-y-5 my-12">
          <p className="text-center mb-5 text-2xl font-semibold text-gray-700">Loading...</p>
          <div className="flex justify-center items-center w-1/4">
            <LinearProgress className="w-full" />
          </div>
          <img src={NoQ} alt="" className="mt-5 w-1/4" />
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="font-bold text-xl p-10 text-red-600">User doesn't exist.</p>
          <a
            href="/"
            className="bg-violet-800 hover:bg-violet-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300"
          >
            Navigate to Homepage
          </a>
        </div>
      ) : (
        profileData && (
          <div className="max-w-4xl mx-auto">
            {jwtUsername === profileData.username ? (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold ml-5">{profileData.username}</h2>
                </div>

                <div className="relative">
                  <button
                    className="flex items-center p-3 rounded bg-orange-50  focus:outline-none transition-all"
                    onClick={toggleDropdown}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 50 50"
                      className="text-gray-600"
                    >
                      <path d="M 3 8 A 2.0002 2.0002 0 1 0 3 12 L 47 12 A 2.0002 2.0002 0 1 0 47 8 L 3 8 z M 3 23 A 2.0002 2.0002 0 1 0 3 27 L 47 27 A 2.0002 2.0002 0 1 0 47 23 L 3 23 z M 3 38 A 2.0002 2.0002 0 1 0 3 42 L 47 42 A 2.0002 2.0002 0 1 0 47 38 L 3 38 z"></path>
                    </svg>
                  </button>
                  <ul
                    className={`z-10 absolute top-full mt-2 right-0 w-40 bg-white rounded-lg shadow-lg overflow-hidden transition-all ${isOpen ? 'block' : 'hidden'}`}
                  >
                    <li className="border-b">
                      <a
                        href="#"
                        className="block py-2 px-4 hover:bg-gray-200 transition duration-200"
                        onClick={openEditProfilePopup}
                      >
                        Edit Profile
                      </a>
                    </li>
                    <li className="border-b">
                      <a
                        href="#"
                        className="block py-2 px-4 hover:bg-gray-200 transition duration-200"
                        onClick={handleDeleteClick}
                      >
                        Delete Account
                      </a>
                      {showDeleteModal && (
                        <DeleteModal
                          onCancel={handleCancel}
                          onConfirm={() => handleConfirm(profileData._id, profileData.username)}
                        />
                      )}
                    </li>
                    <li>
                      <a
                        href="#"
                        className="block py-2 px-4 hover:bg-gray-200 transition duration-200"
                        onClick={handleLogoutClick}  // Trigger the logout modal
                      >
                        Log Out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <h2 className="text-2xl font-bold ml-5">{profileData.username}</h2>
                </div>
              </div>
            )}
            <div className="relative p-6 bg-gradient-to-r from-violet-100 to-yellow-50 shadow-lg rounded-lg mt-8 ">
              <div className="relative w-full mt-8 h-auto mb-6" style={{ paddingBottom: '16.25%' }}>
                <img
                  className="absolute top-0 left-0 w-full h-full object-cover rounded-lg opacity-80"  // Adjust opacity here (0 to 100%)
                  src={profileData.picture || "https://cdn.pixabay.com/photo/2016/06/22/11/10/box-1472804_1280.png"}
                  alt="YouTube Banner"
                />
              </div>
              <div className=" flex flex-col lg:flex-row">
                <div className="absolute top-4 right-4  ">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" id="share" onClick={QRPopup}>
                    <path d="m23.665 8.253-9-8A.998.998 0 0 0 13 1v3.207C9.996 5.013 0 8.765 0 23a1 1 0 0 0 1.928.371c2.965-7.413 8.745-8.96 11.071-9.283V17a1 1 0 0 0 1.666.747l9-8a1 1 0 0 0 0-1.494z"></path>
                  </svg>
                  {popupVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-opacity-60 z-50">
                      <div className="relative bg-gradient-to-tl from-violet-100 to-yellow-50 p-4 rounded-lg shadow-lg transform transition-transform ease-in-out duration-300">
                        <button
                          onClick={handleClose}
                          className="absolute text-2xl top-2 right-2 m-2 text-white bg-black font-bold py-0 px-2 rounded focus:outline-none focus:shadow-outline"
                        >
                          X
                        </button>
                        <QR serviceCategory={profileData.category} serviceName={profileData.username} />
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:w-1/3 flex items-center justify-center">
                  <img
                    src={profileData.avatar || "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_640.png"}
                    className="w-40 h-40 rounded-full border-4 border-gray-200 shadow-lg object-cover"
                  />


                </div>

                <div className="lg:w-2/3 mt-6 lg:mt-0 lg:ml-6">
                  <h1 className="text-3xl font-semibold mb-3">{profileData.name}</h1>
                  <p className="text-gray-700 mb-4">{profileData.bio}</p>

                  <div className="mb-4 text-gray-600">
                    <address>
                      {profileData.location}, India. Zip: {profileData.zip}
                    </address>
                    <p className="text-blue-500 mt-2">
                      <a
                        href={profileData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {profileData.website}
                      </a>
                    </p>
                    <p>Email: {profileData.email}</p>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <div>
                      <h3 className=" font-semibold">Category</h3>
                      <p className="text-gray-700">{profileData.category}</p>
                    </div>


                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-gradient-to-tr from-violet-100 to-yellow-50 shadow-lg rounded-lg">
              {jwtUsername === profileData.username ? (
                <div>
                  <div className="flex flex-wrap ">
                    <div className="w-full lg:w-1/2 mt-5 gap-9">
                      <SetAvailability sectionId={profileData.section} adminId={profileData._id} />
                    </div>
                    <div className="w-full lg:w-1/2">
                      <AppointmentData adminId={profileData._id} />
                    </div>
                  </div>
                  <div className=" mt-8 ml-3">
                    <DisableDate adminId={profileData._id} />
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-bold text-center">Book your slots</h2>
                  <Calendar
                    sectionId={profileData.section}
                    Adminlocation={profileData.location}
                    Username={profileData.username}
                    userId={profileData._id}
                    email={profileData.email}
                  />
                </div>

              )}
            </div>
            <div className="mt-10 p-6 bg-gradient-to-b from-violet-100 to-green-50 shadow-lg rounded-lg">
              {jwtUsername !== profileData.username ? (
                <div className="text-center">
                  <a
                    href={`/Profile/Reviews/${profileData.username}/${profileData._id}`}
                    className="inline-block text-blue-800 p-2 hover:text-blue-950 "
                  >
                    Go to Reviews Page
                  </a>
                  <p className="text-gray-600 mt-2">
                    Share your experience and help others make informed decisions by posting reviews and ratings about our services. Your feedback is valuable!
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-gray-600 mt-2">
                    Check customer reviews and ratings to improve your services and see what clients appreciate about your offerings!
                  </p>
                  <a
                    href={`/Profile/Reviews/${profileData.username}/${profileData._id}`}
                    className="inline-block text-blue-800 p-2 hover:text-blue-950 "
                  >
                    Reviews Page
                  </a>
                </div>
              )}
            </div>

            {editProfileVisible && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">

                <EditProfile
                  profileData={profileData}
                  onClose={closeEditProfilePopup}
                />

              </div>
            )}
            {showLogoutModal && (
              <LogoutModal
                onCancel={handleLogoutCancel}
                onConfirm={handleLogoutConfirm}
              />
            )}
          </div>

        )
      )}
    </div>

  );
};

export default Profile;