import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Cookies from 'js-cookie';
// import API_URI from "../../Env"

function SignIn() {
  const { register, handleSubmit } = useForm();
  const [error, setError] = useState(null);

  const GoogleLogin = (event) => {
    // event.preventDefault();
    window.location.href = "http://localhost:2024/auth/google"
  }

  const onSubmit = (data) => {
    const { username, password } = data;
    console.log("about tio");

    // axios.post(`${API_URI}/service/sign-in`, { username, password })
    axios.post('http://localhost:2024/service/sign-in', data)

      .then(response => {
        console.log(response);
        const token = response.data.token;
        console.log("token", token);
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
    <><div className=" flex  justify-center align-middle bg-violet-950 pt-2 ">
      <a href="/" className="logo text-white">NoQ</a>
    </div>
      <div className="bg-gray-100 min-h-screen flex justify-center">

        <div className="flex flex-col items-center  py-10 w-full max-w-xl">

          <h2 className="text-3xl font-bold mt-8 mb-4">Welcome!!</h2>
          <p className="text-gray-600 text-lg mb-6 text-center">
          Minimize wait times, maximize efficiency. Join us on this journey.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full bg-violet-950 text-gray-50 rounded-2xl px-8 py-6 shadow-lg">
          <div className="flex justify-center mb-6">
          <button
                type="button"
                className="login-with-google-btn bg-white text-gray-800 font-semibold py-2 px-4 rounded-full flex items-center justify-center space-x-2 hover:shadow-lg focus:outline-none"
                onClick={GoogleLogin}
              >
                <span>Sign in with Google</span>
                <img
                  src="https://w7.pngwing.com/pngs/344/344/png-transparent-google-logo-google-logo-g-suite-google-text-logo-symbol.png"
                  alt="Google logo"
                  className="w-5 h-5"
                />
              </button>
          </div>
          <div className="mb-6">

            <label htmlFor="username" className="ml-2 text-yellow-100">Username:</label> <br />
            <input
              {...register("username")}
              className="border mb-4 p-2 w-full text-black rounded-full shadow-sm focus:outline-none focus:shadow-outline"
              type="text"
            /> <br />
            <label htmlFor="password" className="ml-2 text-yellow-100">Password:</label> <br />
            <input
              {...register("password")}
              className="border p-2 w-full rounded-full text-black shadow-sm focus:outline-none focus:shadow-outline"
              type="password"
            />
          </div>
          <div className="flex justify-center">
          <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-2 px-6 rounded-full">
                Sign In
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
                className="text-yellow-400 hover:underline"
              >
                Create an account
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}

export default SignIn;


