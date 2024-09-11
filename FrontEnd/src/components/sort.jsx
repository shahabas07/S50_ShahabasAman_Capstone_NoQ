import React, { useState, useEffect } from "react";
import pic from "../assets/carservice.png";
import gps from "../assets/gps.png";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
// import API_URI from "../../Env"

function Sort() {
  const { category } = useParams();
  const [filteredItems, setFilteredItems] = useState(null);
  const [cityFilter, setCityFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  useEffect(() => {
    // axios.get(`${API_URI}/profile?category=${category}`)
    axios.get(`http://localhost:2024/profile?category=${category}`)
      .then(response => {
        const filteredServices = response.data.filter(service => service.category === category);
        setFilteredItems(filteredServices);
      })
      .catch(error => {
        console.error('Error fetching services:', error);
      });
  }, [category]);

  const handleCityChange = (e) => {
    setCityFilter(e.target.value);
  };

  const handleRatingChange = (e) => {
    setRatingFilter(e.target.value);
  };

  const handleSort = () => {
    if (cityFilter !== "" || ratingFilter !== "") {
      const newFilteredItems = filteredItems.filter((service) => {
        const matchesCity =
          cityFilter === "" ||
          service.location.toLowerCase().includes(cityFilter.toLowerCase());
        const matchesRating =
          ratingFilter === "" || service.rating === parseInt(ratingFilter);
        return matchesCity && matchesRating;
      });

      setFilteredItems(newFilteredItems);
    } else {
      axios.get(`${API_URI}/profile?category=${category}`)
        .then(response => {
          const filteredServices = response.data.filter(service => service.category === category);
          setFilteredItems(filteredServices);
        })
        .catch(error => {
          console.error('Error fetching services:', error);
        });
    }
  };

  const renderServices = () => {
    if (!filteredItems || filteredItems.length === 0) {
      return <p className="text-center text-gray-500 mt-8">No services available for this category.</p>;
    }

    return filteredItems.map((service) => (
      <div key={service._id} className="flex mx-10 my-3 bg-slate-300 rounded shadow-md">
        <img
          src="https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_640.png"
          className="p-3 w-32 h-32 rounded-full"
          alt=""
        />

        <div className="p-3">
          <h2 className="text-lg font-semibold mt-2">{service.name}</h2>
          <p className="text-sm">@{service.username}</p>
          <span className="flex items-end mt-2">
            <img src={gps} className="w-6" alt="" />
            <p className="align-bottom"> {service.location}</p>
          </span>
        </div>
        <div className="ml-auto p-5 mr-8">
          <span className="flex justify-end mr-3 mb-5">
            <p className="text-right">-</p>
            <p className="text-sm text-right ">{service.rating}/5</p>
          </span>
          <Link to={`/profile/${service.username}`} className="bg-yellow-900 hover:bg-yellow-800 text-white font-bold py-2 px-6 rounded">
            Check Availability
          </Link>
        </div>
      </div>
    ));
  };

  return (
    <div className="min-h-screen bg-violet-950">
      
        
      
      <div className="bg-violet-950 text-white pt-5">
      <a href="/" className="logo text-black pl-6 ">
          NoQ
        </a>
        <p className="text-gray-200 text-2xl pb-5 text-center font-bold">
          {category}
        </p>
        <span className="flex justify-around pb-6 mx-20">
          <div className="align-middle">
            <label className="pr-4" htmlFor="">
              City
            </label>
            <input
              type="text"
              className="rounded text-black py-1"
              value={cityFilter}
              onChange={handleCityChange}
            />
          </div>
          <div>
            <label className="pr-4" htmlFor="">
              Rating
            </label>
            <select
              className="rounded border border-gray-400 text-black py-1 px-4 appearance-none"
              value={ratingFilter}
              onChange={handleRatingChange}
            >
              <option value="">Select Rating</option>
              <option value="1">1&#9733;</option>
              <option value="2">2&#9733;&#9733;</option>
              <option value="3">3&#9733;&#9733;&#9733;</option>
              <option value="4">4&#9733;&#9733;&#9733;&#9733;</option>
              <option value="5">5&#9733;&#9733;&#9733;&#9733;&#9733;</option>
            </select>
          </div>
          <button
            className="bg-yellow-400 hover:bg-yellow-400 text-black font-semibold py-1 px-5 rounded"
            onClick={handleSort}
          >
            Sort
          </button>
        </span>
      </div>
      {renderServices()}
    </div>
  );
}

export default Sort;
