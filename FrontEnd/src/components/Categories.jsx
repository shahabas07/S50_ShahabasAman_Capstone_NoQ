import React, { useState } from "react";
import { Link } from "react-router-dom";
import Categories from "./dummyServices";

const ServicesCategories = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = Categories.filter(category =>
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <a href="/" className="logo text-black pl-5 pt-10  ">
        NoQ
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
              <Link to={`/categories/${category}`} className="block">
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
