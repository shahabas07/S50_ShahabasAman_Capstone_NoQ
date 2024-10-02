import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Calendar from "./Calendar";
import SetAvailability from "./SetAvailability";
import AppointmentData from "./AppointmentData"
import DeleteModal from "./DeleteModal";
import EditProfile from "./EditProfile";
import QR from "./QR";
import NoQ from "../assets/NoQ.png";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import ReviewPage from "./ReviewPage";
import { Link } from 'react-router-dom';
// import API_URI from "../../Env";

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
  const editProfileModalRef = useRef(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");

  // const bufferToBase64 = (buffer) => {
  //   const binary = new Uint8Array(buffer).reduce(
  //     (data, byte) => data + String.fromCharCode(byte),
  //     ""
  //   );
  //   return btoa(binary);
  // };

  useEffect(() => {
    axios
      .get(`http://localhost:2024/profile`)
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



  // useEffect(() => {
  //   if (profileData) {
  //     if (profileData.avatar) {
  //       const base64String = bufferToBase64(profileData.avatar.data);
  //       setAvatarUrl(`data:image/jpeg;base64,${base64String}`);
  //     } else {
  //       setAvatarUrl(
  //         "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_640.png"
  //       );
  //     }

  //     if (profileData.picture) {
  //       const base64String_2 = bufferToBase64(profileData.picture.data);
  //       setProfilePictureUrl(`data:image/jpeg;base64,${base64String_2}`);
  //     } else {
  //       setProfilePictureUrl(
  //         "https://static.vecteezy.com/system/resources/thumbnails/012/251/644/small/honeycomb-line-art-background-simple-beehive-seamless-pattern-illustration-of-flat-geometric-texture-symbol-hexagon-hexagonal-sign-or-cell-icon-honey-bee-hive-black-and-white-color-vector.jpg"
  //       );
  //     }
  //   }
  // }, [profileData]);

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
        `http://localhost:2024/profile/${id}`
      );
      console.log(profileResponse.data.message);
      const serviceResponse = await axios.delete(
        `http://localhost:2024/service/${username}`
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
    setPopupVisible(false); // Hide the popup by setting the state to false
  };


  const openEditProfilePopup = () => {
    console.log("Opening Edit Profile Popup");
    setIsOpen(!isOpen);
    setEditProfileVisible(true);
  };

  const closeEditProfilePopup = () => {
    console.log("Closing Edit Profile Popup");
    setEditProfileVisible(false);
  };

  function LogoutModal({ onCancel, onConfirm }) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[1100]">
        <div className="bg-white p-2 rounded-lg shadow-lg dark:bg-surface-dark ">
          <h2 className="text-md font-semibold m-6 text-white dark:text-black">
            Are you sure you want to log out?
          </h2>
          <div className=" flex justify-between px-8 mb-4">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg mr-2 border border-gray-800  text-gray-800  hover:bg-gray-200 transition duration-200"
            >
              Cancel
            </button>

            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
            >
              Log-Out
            </button>
          </div>
        </div>
      </div>
    );
  }

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

    // Add your logout logic here, such as redirecting to the login page
    window.location.reload();
  };
  // console.log("profile:",profileData.avatar)



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
                  {/* <a href="/">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8 text-gray-600 hover:text-black transition duration-200"

                    >
                      <path d="M12 3l10 9h-3v9H5v-9H2l10-9zm0-2L1 10v13h6v-7h6v7h6V10l-11-9z" />
                    </svg>
                  </a> */}
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
                        onClick={handleLogoutClick}
                      >
                        Log-Out
                      </a>
                      {showLogoutModal && (
                        <LogoutModal onCancel={handleLogoutCancel} onConfirm={handleLogoutConfirm} />
                      )}
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  {/* <a href="/">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-8 h-8 text-gray-600 hover:text-black transition duration-200"
                    >
                      <path d="M12 3l10 9h-3v9H5v-9H2l10-9zm0-2L1 10v13h6v-7h6v7h6V10l-11-9z" />
                    </svg>
                  </a> */}
                  <h2 className="text-2xl font-bold ml-5">{profileData.username}</h2>
                </div>
              </div>
            )}

            <div className="relative flex flex-col lg:flex-row p-6 bg-gradient-to-r from-violet-100 to-yellow-50 shadow-lg rounded-lg mt-8">
              {/* Profile Sharing SVG */}
              <div className="absolute top-4 right-4  ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  className="w-8 h-8 text-gray-500 hover:text-gray-800"
                  viewBox="0 0 24 24"
                  onClick={QRPopup} // Function to show QR/Share popup
                >
                  <path d="M13 7h-2v6h6v-2h-4zM12 0C5.373 0 0 5.373 0 12c0 5.084 3.162 9.404 7.633 11.124v-1.775C4.021 19.708 2 16.105 2 12c0-5.523 4.477-10 10-10s10 4.477 10 10c0 4.103-2.019 7.707-5.633 9.349v1.775C20.838 21.405 24 17.085 24 12 24 5.373 18.627 0 12 0zm-1 17v-6h2v6h-2zm0 4v-2h2v2h-2z"></path>
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

              {/* Profile Picture Section */}
              <div className="lg:w-1/3 flex items-center justify-center">
                <img
                  src={profileData.avatar || "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_640.png"}
                  className="w-40 h-40 rounded-full border-4 border-gray-200 shadow-lg object-cover"
                />
              </div>

              {/* Profile Information Section */}
              <div className="lg:w-2/3 mt-6 lg:mt-0 lg:ml-6">
                {/* Name and Bio */}
                <h1 className="text-3xl font-semibold mb-3">{profileData.name}</h1>
                <p className="text-gray-700 mb-4">{profileData.bio}</p>

                {/* Location and Contact Information */}
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

                {/* Additional Profile Details */}
                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div>
                    <h3 className=" font-semibold">Category</h3>
                    <p className="text-gray-700">{profileData.category}</p>
                  </div>

                  <div>
                    <img src={profileData.picture}/>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 p-6 bg-gradient-to-tr from-violet-100 to-yellow-50 shadow-lg rounded-lg">
              {jwtUsername === profileData.username ? (
                <div className="flex flex-wrap ">
                  <div className="w-full lg:w-1/2 mt-5 gap-9">
                    <SetAvailability sectionId={profileData.section} adminId={profileData._id} />
                  </div>
                  <div className="w-full lg:w-1/2">
                    <AppointmentData adminId={profileData._id} />
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
          </div>

        )
      )}
    </div>

  );
};

export default Profile;
