import React, { useState, useEffect } from "react";
import axios from "axios";
import { imDB } from "../../firebase/firebase";
import { v4 } from "uuid";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
const API_URI = import.meta.env.VITE_API_URI;

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
    avatar: null,
    picture: null,
  });

  const [loading, setLoading] = useState(false); 

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
    setLoading(true); 
  
    try {
      const formData = new FormData();
  
      if (userData.avatar && userData.avatar !== "undefined" && typeof userData.avatar !== 'string') {
        const avatarRef = ref(imDB, `images/avatar/${v4()}`);
        const uploadAvatar = await uploadBytes(avatarRef, userData.avatar);
        const avatarUrl = await getDownloadURL(uploadAvatar.ref);
        formData.append("avatar", avatarUrl); 
      } else {
        formData.append("avatar", profileData.avatar || ""); 
      }
  
      if (userData.picture && userData.picture !== "undefined" && typeof userData.picture !== 'string') {
        const pictureRef = ref(imDB, `images/picture/${v4()}`);
        const uploadPicture = await uploadBytes(pictureRef, userData.picture);
        const pictureUrl = await getDownloadURL(uploadPicture.ref);
        formData.append("picture", pictureUrl); 
      } else {
        formData.append("picture", profileData.picture || ""); 
      }
  
      Object.keys(userData).forEach((key) => {
        if (key !== "avatar" && key !== "picture") {
          formData.append(key, userData[key]);
        }
      });
  
      await axios.put(
        `${API_URI}/profile/${profileData._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      setLoading(false);
      window.location.reload();
    } catch (error) {
      setLoading(false);
      console.error("Error updating profile:", error);
    }
  };
  
  
  
  return (
    <div className=" bg-opacity-0 z-50">
      {loading ? ( 
        <div className="flex items-center bg-white p-6 rounded-2xl px-12 justify-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full"></div>
          <p className="ml-3 text-lg text-black">Saving changes...</p>
        </div>
      ) : (
        <div className="relative bg-gradient-to-tl from-violet-100 to-yellow-50 p-8 rounded-xl shadow-2xl w-full max-w-2xl transform transition-transform duration-500">
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 text-2xl"
            onClick={onClose}
          >
            ✕
          </button>
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="font-bold text-3xl text-gray-800">Edit Profile</h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {["name", "category", "location", "zip", "website", "email",].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}:
                  </label>
                  <input
                    type={field === "zip" || field === "review" ? "number" : "text"}
                    id={field}
                    name={field}
                    value={userData[field]}
                    onChange={handleChange}
                    className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                  />
                </div>
              ))}
              <div>
                <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                  Avatar:
                </label>
                <input type="file" id="avatar" name="avatar" onChange={handleFileChange} className="w-full mt-1" />
              </div>
              <div>
                <label htmlFor="picture" className="block text-sm font-medium text-gray-700">
                  Picture:
                </label>
                <input type="file" id="picture" name="picture" onChange={handleFileChange} className="w-full mt-1" />
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
                  rows="5" 
                  className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
                />
              </div>

            </div>
            <button type="submit" className="w-full py-3 bg-violet-900 text-white font-semibold rounded-lg hover:bg-violet-950 focus:ring focus:ring-blue-300">
              Save Changes
            </button>
          </form>
          <p className="pt-4 text-xs text-gray-500 text-center">Press ESC or click the ✕ to close</p>
        </div>
      )}
    </div>
  );
}

export default EditProfile;