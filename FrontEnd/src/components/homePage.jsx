import React from "react";
import "./styles/home.css";
import calu from "../assets/calu.jpg";
import feature from "../assets/feature.png";
import email from "../assets/email.png";
import person from "../assets/person.png";
import profile from "../assets/login.png";
import profilecus from "../assets/profileCus.png";
import time from "../assets/real-time.png";
import pp from "../assets/profile.png";
import facebook from "../assets/facebook.png";
import instagram from "../assets/instagram.png";
import github from "../assets/github-sign.png";
import NoQ from "../assets/NoQ.png"

function homePage() {
  return (
    <div className="homepg">
      <nav className="flex items-center justify-between pt-1 px-4 pb-2 sm:px-6">
        <a href="/" className="logo ">
          <img className="w-24" src={NoQ} alt="" />
        </a>

        <div className="relative">
          <input
            className="search bg-white px-5 p-2 text-sm text-black font-bold outline-none rounded-full"
            type="text"
            placeholder="Search"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            id="search"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8"
          >
            <path fill="none" d="M0 0h24v24H0V0z"></path>
            <path d="M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path>
          </svg>
        </div>
        <div className="flex text-white">
          <div className="mr-14 mt-1">
            <a
              href="/categories"
              className="text-md hover:text-purple-600 text-black hover:bg-slate-100  bg-gray-200 py-2 px-4 rounded-md"
            >
              Service Categories
            </a>
          </div>
          <div className="mr-20 mt-1">
            <a
              href="/Docs"
              className="text-md hover:text-purple-600 text-black hover:bg-slate-100  bg-gray-200 py-2 px-4 rounded-md"
            >
              Docs
            </a>
          </div>
        </div>
      </nav>
      <div className="px-8 flex">
        <div className="left w-1/2 ml-12">
          <h2 className="text-5xl font-semibold mt-24">Seamless Solution</h2>{" "}
          <h2 className="text-5xl font-semibold mt-1">for Effortless,</h2>{" "}
          <h2 className="text-5xl font-semibold mt-1">Efficient Scheduling</h2>
          <p className="text-gray-600 mt-6 ">Your Appointment Revolution.</p>
          <p className="text-gray-600">
            Say goodbye to long waits and scheduling headaches.
          </p>
          <div className="flex">
            <a href="/sign-up" className="mr-16">
              <button className="signup block mt-8 text-white px-5 py-3 rounded-lg hover:bg-violet-800 font-medium">
                Get started
              </button>
            </a>
            <a href="/sign-in">
              <button className="block mt-8 bg-orange-400 hover:text-red-200 text-white font-medium px-5 py-3 rounded-lg ">
                Login
              </button>
            </a>
          </div>
        </div>
        <div className="w-1/2 mt-24">
          <img src={calu} alt="Cal" />
        </div>
      </div>
      <div className="scroll-animation mx-auto py-2 flex items-center justify-around mt-10 rounded-md">
        <ul className="scroll-list flex justify-between">
          <li>Reschedule</li>
          <li></li>
          <li>Simple booking</li>
          <li></li>
          <li>Calendar Integration</li>
          <li></li>
          <li>Payments & Invoicing</li>
          <li></li>
          <li>Customer Management</li>
          <li></li>
          <li>Appointment Reminders</li>
          <li></li>
          <li>Customizable Designs</li>
          <li></li>
        </ul>
      </div>
      <div className="py-10">
        <h1 className="font-bold text-3xl text-center mb-10">Features of Q'</h1>
        <div className="grid grid-cols-8 sm:grid-cols-8 md:grid-cols-3 gap-8 px-12">
          <div className="p-4 text-center py-4 rounded-md">
            <img src={profilecus} className="mx-auto w-16" alt="Customizable" />
            <h2 className="text-xl font-bold mb-4 mt-2">
              Customizable Profiles
            </h2>
            <p className="text-sm">
              enable users to personalize their accounts, adjusting preferences,
              visuals, and information to suit individual needs and preferences
              seamlessly
            </p>
          </div>
          <div className="p-4 text-center py-4 rounded-md">
            <img src={time} className="mx-auto w-16" alt="Availability" />
            <h2 className="text-xl font-bold mb-4 mt-2">
              Real-Time Availability Updates
            </h2>
            <p className="text-sm">
              instantly reflects changes in schedules or resources, ensuring
              users access the most current information in a dynamic environment
            </p>
          </div>
          <div className="p-4 text-center py-4 rounded-md">
            <img src={email} className="mx-auto w-16" alt="Alerts" />
            <h2 className="text-xl font-bold mb-4 mt-2">Email Alerts</h2>
            <p className="text-sm">
              notifies users via email about important events, updates, or
              actions, ensuring timely communication and information delivery.
            </p>
          </div>
          <div className="p-4 text-center py-4 rounded-md">
            <img src={feature} className="mx-auto w-16" alt="Scheduling" />
            <h2 className="text-xl font-bold mb-4 mt-2">
              Appointment Scheduling
            </h2>
            <p className="text-sm">
              facilitating the efficient booking and management of appointments,
              enabling users to easily schedule, modify, and track their
              engagements.
            </p>
          </div>
          <div className="p-4 text-center py-4 rounded-md">
            <img src={profile} className="mx-auto w-16" alt="Interface" />
            <h2 className="text-xl font-bold mb-4 mt-2">
              User-Friendly Interface
            </h2>
            <p className="text-sm">
              Designed with intuitive navigation and clear visuals, ensuring
              ease of use and enhancing the overall user experience
            </p>
          </div>
          <div className="p-4 text-center py-4 rounded-md">
            <img src={person} className="mx-auto w-16" alt="Facility" />
            <h2 className="text-xl font-bold mb-4 mt-2">Facilitation</h2>
            <p className="text-sm">
              simplifies interactions between customers and providers,
              streamlining processes for seamless communication and
              transactions.
            </p>
          </div>
        </div>
        <hr className="mt-10" />
        <div className="container mx-auto p-8 pb-4">
          <h1 className="font-bold text-3xl text-center mb-10">Reviews</h1>
          <div className="grid grid-cols-4 gap-10">
            <div className="bg-gray-950 p-4 border border-gray-300 rounded-lg h-auto">
              <span className="flex">
                <img className="rounded-full w-9 h-9" src="https://samkalvium.github.io/homepg3/mw.jpeg" alt="Profile" />
                <div className="pl-2 ">
                  <h2 className="text-xl font-bold text-white">Samarth Alva</h2>
                  <h3 className="text-sm text-gray-400">@sam</h3>
                </div>
              </span>
              <p className="text-gray-200  mt-6 text-center">
                <i>
                Honestly, this app makes my life so much easier! I used to spend hours going back and forth with clients trying to find a time that worked for everyone. Now, they can just see when I'm available and book a slot that works for them. Plus, the reminders are a lifesaver—I never miss an appointment anymore!
                </i></p>
            </div>
            <div className="bg-gray-950 p-4 border border-gray-300 rounded-lg">
              <span className="flex">
                <img className="rounded-full w-9 h-9" src="https://samkalvium.github.io/homepg3/mustu.jpg" alt="Profile" />
                <div className="pl-2 ">
                  <h2 className="text-xl font-bold text-white">Musthafa.c.p</h2>
                  <h3 className="text-sm text-gray-400">@musthafaa</h3>
                </div>
              </span>
              <p className="text-gray-200  mt-6 text-center">
                <i>
                I've been using this calendar app for a couple of months now, and I'm loving it. My clients can quickly check my availability and book a slot without having to call or email me. It’s super convenient for both sides, and I’ve noticed that it’s reduced a lot of the back-and-forth. Definitely recommend it to any small business owner!
                </i></p>
            </div>
            <div className="bg-gray-950 p-4 border border-gray-300 rounded-lg">
              <span className="flex">
                <img className="rounded-full w-9 h-9" src="https://samkalvium.github.io/homepg3/shahina.jpeg" alt="Profile" />
                <div className="pl-2 ">
                  <h2 className="text-xl font-bold text-white">Shahina</h2>
                  <h3 className="text-sm text-gray-400">@shahina</h3>
                </div>
              </span>
              <p className="text-gray-200  mt-6 text-center">
                <i>
                This scheduling app is a game-changer! My clients love that they can see my availability and book an appointment whenever it suits them. The interface is clean and easy to use, so they don't get confused or frustrated. I’ve also noticed fewer no-shows since I started using it, which is awesome
                </i></p>
            </div>
            <div className="bg-gray-950 p-4 border border-gray-300 rounded-lg">
              <span className="flex">
                <img className="rounded-full w-9 h-9" src="https://samkalvium.github.io/homepg3/sil.png" alt="Profile" />
                <div className="pl-2 ">
                  <h2 className="text-xl font-bold text-white">Silu</h2>
                  <h3 className="text-sm text-gray-400">@silambam</h3>
                </div>
              </span>
              <p className="text-gray-200  mt-6 text-center">
                <i>
              Super impressed with this app! It’s made managing my schedule a breeze. My customers can easily pick a time that works for them, and I don’t have to worry about overlapping bookings. The best part? It syncs with my personal calendar, so everything stays organized. Highly recommend!
              </i></p>
            </div>
          </div>
        </div>
      </div>
      <div className="footer bg-violet-900 flex px-12 py-16 text-white rounded">
        <div className="pr-12">
          <h1 className="text-4xl font-extrabold mb-10">NoQ</h1>
          <p className="text-sm">Credits@XyZ</p>
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
}

export default homePage;
