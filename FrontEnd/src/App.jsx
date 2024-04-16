import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./components/homePage";
import SignIn from "./components/signIn";
import SignUp from "./components/signUp";
import Docs from "./components/Docs";
import Categories from "./components/Categories";
import Sort from "./components/sort"
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
        <Route path="/categories/:category" element={<Sort/>}/>
      </Routes>
    </>
  );
}

export default App;