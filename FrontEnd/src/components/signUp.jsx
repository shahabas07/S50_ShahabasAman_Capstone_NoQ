import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    axios.post("http://localhost:2024/service", data)
      .then(response => {
        console.log(response)
      })
      .catch(error => {
        console.log(error)
      })
  };

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
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 lg:w-1/2 bg-violet-950 text-gray-50 rounded-[24px] px-10 py-6 shadow-md">
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
            <label htmlFor="timezone" className="ml-2 text-yellow-100">Time Zone:</label> <br />
            <input
              {...register("timezone")}
              className="border mb-4 p-2 w-full text-black rounded-full shadow-sm focus:outline-none focus:shadow-outline"
              type="text"
            /> <br/>
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
      </div>
    </div>
  );
}

export default SignUp;
