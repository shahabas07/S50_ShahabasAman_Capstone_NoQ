import React, { useState, useEffect } from "react";
import axios from "axios";
import { imDB } from "./Firebase/firebase";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

function EditProfile({ profileData, onClose }) {
  const [userData, setUserData] = useState({
    username: "",
    name: "",
    category: "",
    location: "",
    zip: null,
    website: "",
    bio: "",
    email: "",
    timezone: "",
    review: 0,
    avatar: null, // Initialize for avatar
    picture: null, // Initialize for picture
  });

  useEffect(() => {
    if (profileData) {
      setUserData(profileData);
    } else {
      setUserData({
        username: "",
        name: "",
        category: "",
        location: "",
        zip: null,
        website: "",
        bio: "",
        email: "",
        timezone: "",
        review: 0,
        avatar: null,
        picture: null,
      });
    }
  }, [profileData]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setUserData((prevUserData) => ({
        ...prevUserData,
        [name]: files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();

      // Handle avatar image upload if exists
      if (userData.avatar) {
        const avatarRef = ref(imDB, `images/avatar/${v4()}`);
        const uploadAvatar = await uploadBytes(avatarRef, userData.avatar);
        const avatarUrl = await getDownloadURL(uploadAvatar.ref);
        formData.append("avatar", avatarUrl);
      } else {
        formData.append("avatar", profileData.avatar); // Use existing avatar URL if no new file is provided
      }

      // Handle picture image upload if exists
      if (userData.picture) {
        const pictureRef = ref(imDB, `images/picture/${v4()}`);
        const uploadPicture = await uploadBytes(pictureRef, userData.picture);
        const pictureUrl = await getDownloadURL(uploadPicture.ref);
        formData.append("picture", pictureUrl);
      } else {
        formData.append("picture", profileData.picture); // Use existing picture URL if no new file is provided
      }

      // Append other user data to formData
      Object.keys(userData).forEach((key) => {
        if (key !== "avatar" && key !== "picture") {
          formData.append(key, userData[key]);
        }
      });

      // Uncomment to send the request
      const response = await axios.put(
        `http://localhost:2024/profile/${profileData._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Updated user data:", response.data);
      onClose(); // Close the modal or perform any action after updating
      // Optionally reload or redirect
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <button
          type="button"
          className="absolute top-2 right-2 text-2xl text-gray-700 hover:text-gray-900"
          onClick={onClose}
        >
          ✕
        </button>
        <form onSubmit={handleSubmit}>
          <h3 className="font-bold text-2xl mb-4">Edit Profile</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name:
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="input input-bordered w-full mt-1"
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category:
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={userData.category}
                onChange={handleChange}
                className="input input-bordered w-full mt-1"
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location:
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={userData.location}
                onChange={handleChange}
                className="input input-bordered w-full mt-1"
              />
            </div>
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                Zip:
              </label>
              <input
                type="number"
                id="zip"
                name="zip"
                value={userData.zip}
                onChange={handleChange}
                className="input input-bordered w-full mt-1"
              />
            </div>
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website:
              </label>
              <input
                type="text"
                id="website"
                name="website"
                value={userData.website}
                onChange={handleChange}
                className="input input-bordered w-full mt-1"
              />
            </div>
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio:
              </label>
              <textarea
                id="bio"
                name="bio"
                value={userData.bio}
                onChange={handleChange}
                className="textarea textarea-bordered w-full mt-1"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="input input-bordered w-full mt-1"
              />
            </div>
            <div>
              <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                Timezone:
              </label>
              <input
                type="text"
                id="timezone"
                name="timezone"
                value={userData.timezone}
                onChange={handleChange}
                className="input input-bordered w-full mt-1"
              />
            </div>
            <div>
              <label htmlFor="review" className="block text-sm font-medium text-gray-700">
                Review:
              </label>
              <input
                type="number"
                id="review"
                name="review"
                value={userData.review}
                onChange={handleChange}
                className="input input-bordered w-full mt-1"
              />
            </div>
            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                Avatar:
              </label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                onChange={handleFileChange}
                className="input input-bordered w-full mt-1"
              />
            </div>
            <div>
              <label htmlFor="picture" className="block text-sm font-medium text-gray-700">
                Picture:
              </label>
              <input
                type="file"
                id="picture"
                name="picture"
                onChange={handleFileChange}
                className="input input-bordered w-full mt-1"
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          >
            Save
          </button>
        </form>
        <p className="py-4 text-sm text-gray-500">
          Press ESC key or click on ✕ button to close
        </p>
      </div>
    </div>
  );
}

export default EditProfile;
