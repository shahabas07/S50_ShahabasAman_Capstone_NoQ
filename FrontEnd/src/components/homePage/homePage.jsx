import React from 'react';
import { useEffect, useState } from 'react';
import "../styles/home.css";
import calu from "../../assets/calu.jpg";
import feature from "../../assets/feature.png";
import email from "../../assets/email.png";
import person from "../../assets/person.png";
import profile from "../../assets/login.png";
import profilecus from "../../assets/profileCus.png";
import time from "../../assets/real-time.png";
import facebook from "../../assets/facebook.png";
import instagram from "../../assets/instagram.png";
import github from "../../assets/github-sign.png";
import NoQ from "../../assets/NoQ.png";

const HomePage = () => {
  const [username, setUsername] = useState(null);

  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
  };

  const parseJwt = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Invalid token format', error);
      return null;
    }
  };

  useEffect(() => {
    const token = getCookie('token');
    if (token) {
      const decoded = parseJwt(token);
      if (decoded && decoded.username) {
        setUsername(decoded.username);
      }
    }
  }, []);

  // Sample reviews
  const reviews = [
    {
      imgSrc: "https://samkalvium.github.io/homepg3/mw.jpeg",
      name: "Samarth Alva",
      username: "@sam",
      review: "Honestly, this app makes my life so much easier! I used to spend hours going back and forth with clients trying to find a time that worked for everyone. Now, they can just see when I'm available and book a slot that works for them. Plus, the reminders are a lifesaver—I never miss an appointment anymore!",
    },
    {
      imgSrc: "https://samkalvium.github.io/homepg3/mustu.jpg",
      name: "Musthafa.c.p",
      username: "@musthafaa",
      review: "I've been using this calendar app for a couple of months now, and I'm loving it. My clients can quickly check my availability and book a slot without having to call or email me. It’s super convenient for both sides, and I’ve noticed that it’s reduced a lot of the back-and-forth. Definitely recommend it to any small business owner!",
    },
    {
      imgSrc: "https://samkalvium.github.io/homepg3/shahina.jpeg",
      name: "Shahina",
      username: "@shahina",
      review: "This scheduling app is a game-changer! My clients love that they can see my availability and book an appointment whenever it suits them. The interface is clean and easy to use, so they don't get confused or frustrated. I’ve also noticed fewer no-shows since I started using it, which is awesome.",
    },
    {
      imgSrc: "https://samkalvium.github.io/homepg3/sil.png",
      name: "Silu",
      username: "@silambam",
      review: "Super impressed with this app! It’s made managing my schedule a breeze. My customers can easily pick a time that works for them, and I don’t have to worry about overlapping bookings. The best part? It syncs with my personal calendar, so everything stays organized. Highly recommend!",
    },
  ];

  return (
    <div className="homepg">
      <nav className="flex items-center justify-between pt-1 px-4 sm:px-6">
        <a href="/" className="logo p-2 ml-10">
          <img className="w-18" src={NoQ} alt="Logo" />
        </a>
        <div className="flex text-white">
          <div className="mr-14 mt-1">
            <a
              href="/DonationPage"
              className="text-md hover:text-purple-800 text-black hover:bg-slate-100 bg-gray-200 py-4 px-8 border border-black rounded-md shadow-xl"
            >
              <strong> Donate </strong>
            </a>
          </div>
          <div className="mr-14 mt-1">
            <a
              href="/categories"
              className="text-md hover:text-purple-800 text-white hover:bg-slate-100 bg-gray-700 py-4 px-8 border border-black rounded-md shadow-xl"
            >
              <strong>Service Categories </strong>
            </a>
          </div>
          <div className="mr-20 mt-1">
            <a
              href="/Docs"
              className="text-md hover:text-purple-800 text-black hover:bg-slate-100 bg-gray-200 py-4 px-8 border border-black rounded-md shadow-xl"
            >
              <strong> Docs </strong>
            </a>
          </div>
        </div>
      </nav>
      <div className="px-8 flex mt-5 mb-20">
        <div className="left w-1/2 ml-12">
          <h2 className="text-7xl font-semibold mt-14">Seamless Solution</h2>
          <h2 className="text-7xl font-semibold mt-1">for Effortless,</h2>
          <h2 className="text-7xl font-semibold mt-1">Efficient Scheduling</h2>
          <p className="text-2xl text-gray-600 mt-6">Your Appointment Revolution.</p>
          <p className="text-2xl text-gray-600">
            Say goodbye to long waits and scheduling headaches.
          </p>
          <div className="flex">
            {username ? (
              <div className="text-xl text-black font-medium mt-8">
                <h3>Hey {username}👋</h3>
                <p>It’s good to see you again.</p>
                <a href={`/profile/${username}`}>
                <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-xl 
              bg-[linear-gradient(110deg,#4B0082,45%,#1e2631,55%,#4B0082)] bg-[length:200%_100%] 
              text-xl text-white font-medium px-12 py-4 mt-8 transition-all duration-200 transform 
              focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 
              hover:bg-[linear-gradient(110deg,#3D0A5C,45%,#1e2631,55%,#3D0A5C)] hover:scale-105">
                    <strong>Go to Profile</strong>
                  </button>
                </a>

              </div>
            ) : (
              <>
                <a href="/sign-up" className="mr-28">
                  <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-xl 
              bg-[linear-gradient(110deg,#4B0082,45%,#1e2631,55%,#4B0082)] bg-[length:200%_100%] 
              text-xl text-white font-medium px-12 py-4 mt-8 transition-all duration-200 transform 
              focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 
              hover:bg-[linear-gradient(110deg,#3D0A5C,45%,#1e2631,55%,#3D0A5C)] hover:scale-105">
                    <strong>Get started</strong>
                  </button>
                </a>

                <a href="/sign-in">
                  <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-xl 
              bg-[linear-gradient(110deg,#FF4500,40%,#1e2631,45%,#FF4500)] bg-[length:200%_100%] 
              text-xl text-white font-medium px-12 py-4 mt-8 transition-all duration-200 transform 
              hover:bg-[linear-gradient(110deg,#CC3700,45%,#1e2631,55%,#CC3700)] hover:scale-105">
                    <strong>Login</strong>
                  </button>
                </a>
              </>
            )}
          </div>
        </div>
        <div className="w-full flex justify-center">
          <img className="w-1/2 h-auto" src={calu} alt="Cal" />
        </div>
      </div>
      <div className="h-16 scroll-animation mx-auto py-2 flex items-center justify-around rounded-md">
        <ul className="scroll-list font-bold flex justify-between space-x-8 list-disc">
          {[
            "- Reschedule -",
            "- Simple booking -",
            "- Calendar Integration -",
            "- Payments & Invoicing -",
            "- Customer Management -",
            "- Appointment Reminders -",
            "- Customizable Designs -",
          ].map((item, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-2">🏷</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="py-10">
        <h1 className="font-bold text-3xl text-center mb-8">Features of Q`</h1>
        <div className="grid grid-cols-8 sm:grid-cols-8 md:grid-cols-3 gap-8 px-12 mb-20">
          <FeatureCard
            imgSrc={profilecus}
            title="Customizable Profiles"
            description="Enable users to personalize their accounts, adjusting preferences, visuals, and information to suit individual needs and preferences seamlessly."
          />
          <FeatureCard
            imgSrc={time}
            title="Real-Time Availability Updates"
            description="Instantly reflects changes in schedules or resources, ensuring users access the most current information in a dynamic environment."
          />
          <FeatureCard
            imgSrc={email}
            title="Email Alerts"
            description="Notifies users via email about important events, updates, or actions, ensuring timely communication and information delivery."
          />
          <FeatureCard
            imgSrc={feature}
            title="Appointment Scheduling"
            description="Facilitating the efficient booking and management of appointments, enabling users to easily schedule, modify, and track their engagements."
          />
          <FeatureCard
            imgSrc={profile}
            title="User-Friendly Interface"
            description="Designed with intuitive navigation and clear visuals, ensuring ease of use and enhancing the overall user experience."
          />
          <FeatureCard
            imgSrc={person}
            title="Facilitation"
            description="Simplifies interactions between customers and providers, streamlining processes for seamless communication and transactions."
          />
        </div>
        <hr className="mt-10" />
        <div className="py-10">
          <h2 className="font-bold text-3xl text-center mb-10">See what our users are saying.</h2>
          <div className="overflow-hidden relative">
            <div className="flex mx-8">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className={`flex flex-col mr-4 ml-4 items-center justify-center w-full p-6 border rounded-lg shadow-lg transition-all duration-300 ${index % 2 === 0 ? "bg-orange-50" : "bg-green-50"
                    }`}
                >
                  <img
                    className="rounded-full w-12 h-12 mb-2"
                    src={review.imgSrc}
                    alt={review.name}
                  />
                  <h3 className="font-semibold text-lg">{review.name}</h3>
                  <p className="text-gray-500">{review.username}</p>
                  <p className="mt-2">{review.review}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
      <div className="footer bg-violet-950 flex px-12 py-16 text-white rounded">
        <div className="pr-12">
          <h1 className="text-4xl font-extrabold mb-10">NoQ</h1>
          <p className="text-sm">Thanks </p>
          <p className="text-sm">Ownerships<strong>@shahabas</strong></p>
          <hr className="w-28 bg-gray-950 my-5" />
          <p className="text-sm">
            <strong>NoQ</strong> is a comprehensive platform designed to optimize the scheduling process for service appointments across various industries. By providing a centralized hub for service providers and customers, NoQ revolutionizes the way appointments are booked and managed, ultimately minimizing wait times and enhancing efficiency.
          </p>
          <p className="mt-6 text-sm">Inspired from Cal.com OpenSource</p>
        </div>
        <div class="flex justify-between items-end w-60">
          <a href="https://www.facebook.com/">
            <img class="w-10 h-10" src={facebook} alt="facebook" />
          </a>
          <a href="https://github.com/kalviumcommunity/S50_ShahabasAman_Capstone_NoQ">
            <img class="w-10 h-10" src={github} alt="github" />
          </a>
          <a href="https://www.instagram.com/">
            <img class="w-10 h-10" src={instagram} alt="instagram" />
          </a>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ imgSrc, title, description }) => (
  <div className="feature-card w-full flex flex-col items-center justify-center p-4 bg-orange-50 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200">
    <img className="w-20 h-20 mb-4" src={imgSrc} alt={title} />
    <h2 className="font-semibold text-xl mb-2">{title}</h2>
    <p className="text-gray-700 text-center">{description}</p>
  </div>
);

export default HomePage;
