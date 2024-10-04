import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/homePage/homePage";
import SignIn from "./components/forms/signIn";
import SignUp from "./components/forms/signUp";
import Docs from "./components/aboutPage/Docs";
import Categories from "./components/serviceFinder/Categories";
import Sort from "./components/serviceFinder/sort"
import Profile from "./components/profileComponents/Profile"
import AppointmentData from "./components/profileComponents/providerView/AppointmentData"
import ReviewPage from "./components/profileComponents/ReviewPage"
import DonationPage from "./components/donation/Donation"
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