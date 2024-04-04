import React, { useState } from "react";

const ServicesCategories = () => {
  const initialCategories = [
    "Automotive Repair",
    "Healthcare",
    "Plumbing",
    "Electrical",
    "Legal Services",
    "Beauty and Wellness",
    "Home Maintenance",
    "Financial Services",
    "Babysitting",
    "Furniture Repair",
    "Gardening",
    "Cleaning",
    "Pest Control Services",
    "Counseling",
    "Managing",
    "others"
  ];

  const [searchQuery, setSearchQuery] = useState("");

  const filteredCategories = initialCategories.filter(category =>
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
            className="mb-8 w-4/5 border border-gray-800 rounded-lg py-3 px-7"
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
              <div className="bg-white shadow-lg rounded-lg p-3 text-center hover:bg-orange-400 hover:text-white">
                <h2 className="text-sm font-semibold">{category}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesCategories;
