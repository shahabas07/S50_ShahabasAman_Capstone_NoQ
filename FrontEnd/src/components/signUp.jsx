import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from 'js-cookie';

function SignUp() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [error, setError] = useState(null); // State to store sign-up error
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false); // State to control profile update form visibility

  // Function to handle Google Login
  const GoogleLogin = () => {
    window.location.href = "http://localhost:2024/auth/google"; // Adjust URL as needed
  };

  const onSubmit = (data) => {
    console.log('Form data:', data);
    axios.post('http://localhost:2024/service', data)
      .then(response => {
        const token = response.data.token;
        Cookies.set('token', token, { expires: 7 });

        // Show the profile update form
        setIsUpdatingProfile(true);
      })
      .catch(error => {
        console.error('Error signing up:', error, error.response);
        setError('Error signing up. Please try again.');
      });
  };

  const handleProfileUpdate = (data) => {
    console.log('Profile update data:', data);
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('bio', data.bio);
    formData.append('location', data.location);
    if (data.avatar[0]) formData.append('avatar', data.avatar[0]);
    if (data.picture[0]) formData.append('picture', data.picture[0]);

    // Use username directly from the input field
    const username = data.username;

    axios.put(`http://localhost:2024/profile/username/${username}`, formData) // Use username for updating
      .then(response => {
        console.log('Profile updated successfully:', response.data);
        // Redirect to the profile page or show success message
        window.location.href = `/profile/${username}`;
      })
      .catch(error => {
        console.error('Error updating profile:', error);
        setError('Error updating profile. Please try again.');
      });
  };

  // Watch the username input value for use in the skip button
  const usernameInput = watch("username");

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex justify-center align-middle bg-violet-950 pt-2">
        <a href="/" className="logo text-white">NoQ</a>
      </div>
      <div className="flex flex-col items-center py-10">
        <h2 className="text-3xl font-bold mb-4">Welcome!!</h2>
        <p className="text-gray-600">
          Minimize wait times, maximize efficiency. Join us on this journey
        </p>

        {/* Google Login Button */}
        <button className="blue" onClick={GoogleLogin}>G</button>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 lg:w-1/3 bg-violet-950 text-gray-50 rounded-[24px] px-10 py-6 shadow-md">
          <div className="mb-6">
            <label htmlFor="username" className="ml-2 text-yellow-100">Username:</label> <br />
            <input
              {...register("username", { required: true })}
              className="border mb-4 p-2 w-full text-black rounded-full shadow-sm focus:outline-none focus:shadow-outline"
              type="text"
            /> <br/>
            {errors.username && <p className="text-red-500">Username is required</p>}
            <label htmlFor="email" className="ml-2 text-yellow-100">Email:</label> <br />
            <input
              {...register("email", { required: true })}
              className="border mb-4 p-2 w-full text-black rounded-full shadow-sm focus:outline-none focus:shadow-outline"
              type="email"
            /> <br/>
            {errors.email && <p className="text-red-500">Email is required</p>}
            <label htmlFor="password" className="ml-2 text-yellow-100">Password:</label> <br />
            <input
              {...register("password", { required: true })}
              className="border p-2 w-full rounded-full text-black shadow-sm focus:outline-none focus:shadow-outline"
              type="password"
            />
            {errors.password && <p className="text-red-500">Password is required</p>}
          </div>
          <div className="flex justify-center">
            <button
              className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-6 rounded-lg focus:outline-none focus:shadow-outline mt-2"
              type="submit" 
            >
              Sign Up&nbsp;  &#x2B62;
            </button>
          </div>
          {error && (
            <div className="text-center mt-2 text-red-600">
              {error}
            </div>
          )}
          <div className="text-center mt-6 text-gray-300">
            <div className="flex justify-center">
              <p>Already have an account?</p> &nbsp;
              <a
                href="/sign-in"
                className="text-blue-500 hover:underline "
              >
                Sign In
              </a>
            </div>
          </div>
        </form>

        {isUpdatingProfile && (
          <div className="mt-8 lg:w-1/3 bg-violet-950 text-gray-50 rounded-[24px] px-10 py-6 shadow-md">
            <h3 className="text-xl font-bold mb-4">Update Profile Details</h3>
            <form onSubmit={handleSubmit(handleProfileUpdate)}>
              <label htmlFor="username" className="ml-2 text-yellow-100">Username:</label> <br />
              <input
                {...register("username", { required: true })}
                className="border mb-4 p-2 w-full text-black rounded-full shadow-sm focus:outline-none focus:shadow-outline"
                type="text"
              /> <br/>
              {errors.username && <p className="text-red-500">Username is required</p>}
              
              <label htmlFor="name" className="ml-2 text-yellow-100">Name:</label> <br />
              <input
                {...register("name")}
                className="border mb-4 p-2 w-full text-black rounded-full shadow-sm focus:outline-none focus:shadow-outline"
                type="text"
              /> <br/>

              <label htmlFor="bio" className="ml-2 text-yellow-100">Bio:</label> <br />
              <textarea
                {...register("bio")}
                className="border mb-4 p-2 w-full text-black rounded-lg shadow-sm focus:outline-none focus:shadow-outline"
                rows="3"
              ></textarea> <br/>

              <label htmlFor="location" className="ml-2 text-yellow-100">Location:</label> <br />
              <input
                {...register("location")}
                className="border mb-4 p-2 w-full text-black rounded-full shadow-sm focus:outline-none focus:shadow-outline"
                type="text"
              /> <br/>

              <label htmlFor="avatar" className="ml-2 text-yellow-100">Upload Avatar:</label> <br />
              <input
                {...register("avatar")}
                className="border mb-4 p-2 w-full text-black rounded-full shadow-sm focus:outline-none focus:shadow-outline"
                type="file"
              /> <br/>

              <label htmlFor="picture" className="ml-2 text-yellow-100">Upload Picture:</label> <br />
              <input
                {...register("picture")}
                className="border mb-4 p-2 w-full text-black rounded-full shadow-sm focus:outline-none focus:shadow-outline"
                type="file"
              /> <br/>

              <div className="flex justify-center">
                <button
                  className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-6 rounded-lg focus:outline-none focus:shadow-outline mt-2"
                  type="submit" 
                >
                  Update Profile
                </button>
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-1 px-6 rounded-lg focus:outline-none focus:shadow-outline mt-2 ml-2"
                  type="button"
                  onClick={() => window.location.href = `/profile/${usernameInput}`} // Redirect using the current username input value
                >
                  Skip
                </button>
              </div>
              {error && (
                <div className="text-center mt-2 text-red-600">
                  {error}
                </div>
              )}
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default SignUp;
