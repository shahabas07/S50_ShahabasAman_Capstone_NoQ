import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/homePage";
import SignIn from "./components/signIn";
import SignUp from "./components/signUp";
import Docs from "./components/Docs";
import Categories from "./components/Categories";
import Sort from "./components/sort"
import Profile from "./components/Profile"
import AppointmentData from "./components/AppointmentData"
import ReviewPage from "./components/ReviewPage"
import DonationPage from "./components/Donation"
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/Sign-In" element={<SignIn/>}/>
        <Route path="/Sign-Up" element={<SignUp/>}/>
        <Route path="/Docs" element={<Docs/>}/>
        <Route path="/Categories" element={<Categories/>}/>
        <Route path="/Categories/:category" element={<Sort/>}/>
        <Route path="/Profile/:User" element={<Profile/>} />
        <Route path="/Profile/AppointmentData" element={<AppointmentData/>} />
        <Route path="/Profile/Reviews/*" element={<ReviewPage/>} />
        <Route path="/DonationPage" element={<DonationPage/>} />
      </Routes>
    </>
  );
}

export default App;