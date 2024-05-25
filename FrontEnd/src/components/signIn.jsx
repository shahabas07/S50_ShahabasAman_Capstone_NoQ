import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from 'js-cookie';

function SignIn() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);

  const onSubmit = (data) => {
    const { username, password } = data;
  
    axios.post('https://s50-shahabasaman-capstone-noq.onrender.com/service/sign-in', { username, password })
      .then(response => {
        console.log(response);
        const token = response.data.token;
        Cookies.set('token', token, { expires: 7 });
        const usernameFromResponse = response.data.username;
        window.location.href = `/profile/${usernameFromResponse}`; 
        console.log(token)
      }) 
      .catch(error => {
        console.error('Error fetching serviceProvider data:', error);
        setError('Invalid username or password');
      });

  };
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className=" flex justify-center align-middle bg-violet-950 pt-2">
        <a href="/" className="logo text-white">NoQ</a>
      </div>
      <div className="flex flex-col items-center py-10">
        <h2 className="text-3xl font-bold mb-4">Welcome Back!!</h2>
        <p className="text-gray-600">
          Minimize wait times, maximize efficiency. Join us on this journey
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8  lg:w-1/2 bg-violet-950 text-gray-50 rounded-[24px] px-10 py-6 shadow-md ">
          <div className="mb-6">
            <label htmlFor="username" className="ml-2 text-yellow-100">Username:</label> <br />
            <input
              {...register("username")}
              className="border mb-4 p-2 w-full text-black rounded-full shadow-sm focus:outline-none focus:shadow-outline"
              type="text"
            /> <br/>
            <label htmlFor="password" className="ml-2 text-yellow-100">Password:</label> <br />
            <input
              {...register("password")}
              className="border p-2 w-full rounded-full text-black shadow-sm focus:outline-none focus:shadow-outline"
              type="password"
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-1 px-6 rounded-lg focus:outline-none focus:shadow-outline mt-2"
              type="submit"
            >
              Sign In&nbsp;  &#x2B62;
            </button>
          </div>
          {error && (
            <div className="text-center mt-2 text-red-600">
              {error}
            </div>
          )}
          <div className="text-center mt-6 text-gray-300">
            <div className="flex justify-center">
              <p>Don't have an account?</p> &nbsp; 
              <a
                href="/sign-up"
                className="text-blue-500 hover:underline"
              >
                Create an account
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;


