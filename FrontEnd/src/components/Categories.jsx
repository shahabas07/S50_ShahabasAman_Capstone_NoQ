import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NoQ from "../assets/NoQ.png"
// import API_URI from "../../Env"

const ServicesCategories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // axios.get(`${API_URI}/profile`)
    axios.get(`http://localhost:2024/profile`)
      .then(response => {
        const uniqueCategories = new Set(response.data.map(item => item.category));
        setCategories(Array.from(uniqueCategories));
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const filteredCategories = searchQuery
    ? categories.filter(category =>
      category && category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : categories.filter(Boolean); 

  return (
    <div className="min-h-screen">
      <a href="/" className="logo text-black">
      <img className="w-24 mt-1 ml-3" src={NoQ} alt="" />
      </a>
      <div className="container mx-auto px-14 pt-6">
        <h1 className="text-3xl font-semibold text-center mb-10">
          Discover, book services, manage schedules conveniently with us
        </h1>

        <center>
          <input
            className="mb-8 w-4/5 border outline-none border-gray-800 rounded-lg py-3 px-7"
            type="search"
            placeholder="Search your service"
            style={{
              borderRadius: "18px",
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </center>
        
        <div className="categories grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 bg-violet-900 h-96 pt-7 pr-7 pl-7">
          {filteredCategories.map((category, index) => (
            <div className="p-4" key={index}>
              <Link to={`/Categories/${category}`} className="block">
                <div className="bg-white shadow-lg rounded-lg p-3 text-center hover:bg-orange-400 hover:text-white">
                  <h2 className="text-sm font-semibold">{category}</h2>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesCategories;
