import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Calendar from "./Calendar";
import SetAvailability from "./SetAvailability";
import DeleteModal from "./DeleteModal";
import EditProfile from "./EditProfile";
import QR from "./QR";
import NoQ from "../assets/NoQ.png";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";

const Profile = () => {
  const { User } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [jwtUsername, setJwtUsername] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);

  useEffect(() => {
    axios
      .get(`http://localhost:2024/profile`)
      .then((response) => {
        const profiles = response.data;
        console.log("All Profiles:", profiles);
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
        `http://localhost:2024/profile/${id}`
      );
      console.log(profileResponse.data.message);

      // Delete service by username
      const serviceResponse = await axios.delete(
        `http://localhost:2024/service/${username}`
      );
      console.log(serviceResponse.data.message);
    } catch (error) {
      if (error.response) {
        console.error("Failed to delete:", error.response.data.message);
      } else {
        console.error("Error deleting:", error.message);
      }
    }
    // window.location.reload();
  };

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const QRPopup = () => {
    setPopupVisible(!popupVisible);
  };

  const handleClose = () => {
    window.location.reload();
  };

  const openEditProfilePopup = () => {
    setPopupVisible(true);
  };

  return (
    <div>
      {loading ? (
        <div className="my-12">
          <p className="text-center mb-5 font-bold">Loading...</p>
          <div class="flex justify-center items-center h-2/3">
            <Box sx={{ width: "30%" }}>
              <LinearProgress />
            </Box>
          </div>
          <div className="flex justify-center align-middle">
            <img src={NoQ} alt="" />
          </div>
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="font-bold text-xl p-10">User doesn't exist.</p>
          <a
            href="/"
            className="bg-violet-800 hover:bg-violet-700 text-white font-bold py-2 px-4 rounded "
          >
            Go to Homepage
          </a>
        </div>
      ) : (
        profileData && (
          <div>
            {jwtUsername === profileData.username ? (
              <div className="flex justify-between mr-12">
                <h2 className="text-2xl font-bold mt-2 ml-5">
                  {profileData.username}
                </h2>
                <div className="flex">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="35"
                    viewBox="0 0 8 8"
                    id="share"
                    className="mt-5 mr-5"
                    onClick={QRPopup}
                  >
                    <path d="M5 0v2C1 2 0 4.05 0 7c.52-1.98 2-3 4-3h1v2l3-3.16L5 0z"></path>
                  </svg>
                  {popupVisible && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                      <div className="transform translate-x-full bg-white p-4 rounded-lg shadow-lg transition-transform ease-in-out duration-300">
                        <button
                          onClick={handleClose}
                          className="absolute text-2xl top-2 right-2 m-2 text-white bg-black font-bold py-0 px-2 rounded focus:outline-none focus:shadow-outline"
                        >
                          X
                        </button>
                        <QR />
                      </div>
                    </div>
                  )}
                  <div>
                    <button
                      className="flex items-center whitespace-nowrap rounded bg-primary pb-2 pe-6 ps-4 pt-2.5 text-xs font-medium uppercase leading-normal text-black shadow-primary-3 transition duration-150 ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 motion-reduce:transition-none dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                      type="button"
                      onClick={toggleDropdown}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="35"
                        height="35"
                        viewBox="0 0 50 50"
                        className="mt-2 mr-5"
                      >
                        <path d="M 3 8 A 2.0002 2.0002 0 1 0 3 12 L 47 12 A 2.0002 2.0002 0 1 0 47 8 L 3 8 z M 3 23 A 2.0002 2.0002 0 1 0 3 27 L 47 27 A 2.0002 2.0002 0 1 0 47 23 L 3 23 z M 3 38 A 2.0002 2.0002 0 1 0 3 42 L 47 42 A 2.0002 2.0002 0 1 0 47 38 L 3 38 z"></path>
                      </svg>
                    </button>
                    <ul
                      className={`absolute z-[1000] float-left m-0 ${
                        isOpen ? "block" : "hidden"
                      } min-w-max list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-base shadow-lg data-[twe-dropdown-show] dark:bg-surface-dark`}
                      aria-labelledby="dropdownMenuButton1s"
                      data-twe-dropdown-menu-ref
                    >
                      <li>
                        <a
                          className="block w-full whitespace-nowrap hover:bg-gray-800 bg-black px-4 py-2 text-sm font-normal text-neutral-700 focus:outline-none dark:text-white"
                          href="#"
                          data-twe-dropdown-item-ref
                        >
                          <EditProfile openPopup={openEditProfilePopup} />
                        </a>
                      </li>
                      <li>
                        <a
                          className="block w-full whitespace-nowrap bg-black px-4 py-2 text-sm font-normal  active:no-underline dark:bg-surface-dark text-white hover:bg-gray-800 "
                          href="#"
                          data-twe-dropdown-item-ref
                        >
                          <button onClick={handleDeleteClick}>
                            Delete Acc
                          </button>
                          {showDeleteModal && (
                            <DeleteModal
                              onCancel={handleCancel}
                              onConfirm={() =>
                                handleConfirm(
                                  profileData._id,
                                  profileData.username
                                )
                              }
                            />
                          )}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-between mr-12">
                <h2 className="text-2xl font-bold mt-2 ml-5">
                  {profileData.username}
                </h2>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="35"
                  height="35"
                  viewBox="0 0 8 8"
                  id="share"
                  className="mt-2 mr-5"
                  onClick={QRPopup}
                >
                  <path d="M5 0v2C1 2 0 4.05 0 7c.52-1.98 2-3 4-3h1v2l3-3.16L5 0z"></path>
                </svg>
                {popupVisible && (
                  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="transform translate-x-full bg-white p-4 rounded-lg shadow-lg transition-transform ease-in-out duration-300">
                      <button
                        onClick={handleClose}
                        className="absolute text-2xl top-2 right-2 m-2 text-white bg-black font-bold py-0 px-2 rounded focus:outline-none focus:shadow-outline"
                      >
                        X
                      </button>
                      <QR />
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex p-4 rounded-md shadow-md mx-4 justify-between">
              <div>
                <div className="flex">
                  <div>
                    <img
                      className="border border-gray-500 w-36 h-36 rounded-full"
                      src={
                        profileData.avatar ||
                        "https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_640.png"
                      }
                      alt="Profile Picture"
                    />
                  </div>
                  <div className="ml-6 flex-1">
                    <h1 className="text-3xl font-semibold mb-4">
                      {profileData.name}
                    </h1>
                    <address className="mb-4">
                      {profileData.location}
                      <br />
                      India. Zip: {profileData.zip}
                    </address>
                    <p className="text-blue-500">
                      <a href={profileData.website} className="mb-4">
                        {profileData.website}
                      </a>
                    </p>
                  </div>
                </div>
                <p className="mb-2 mt-4 w-2/3">{profileData.bio}</p>
                <p className="text-xl font-semibold mb-2">4.9/5 Reviews</p>
              </div>
              <div className="mr-9">
                <img
                  src={
                    profileData.picture ||
                    "https://static.vecteezy.com/system/resources/thumbnails/012/251/644/small/honeycomb-line-art-background-simple-beehive-seamless-pattern-illustration-of-flat-geometric-texture-symbol-hexagon-hexagonal-sign-or-cell-icon-honey-bee-hive-black-and-white-color-vector.jpg"
                  }
                  alt=""
                />
              </div>
            </div>
            <h2 className="text-2xl mt-4 font-bold text-center">
              Book your slots
            </h2>
            <div className="flex justify-center">
              <div className="mt-6 mb-6 p-6 w-full mx-14 border border-black rounded-md">
                {jwtUsername === profileData.username ? (
                  <SetAvailability />
                ) : (
                  <Calendar />
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Profile;
