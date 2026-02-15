import React, { useState } from "react";
import mainLogo from "../assets/main-icon.png";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "../context/LocationContext";
import map from "../assets/pin.gif";
import { useNavigate } from "react-router-dom";
import SignInModel from "./SignInModel";
import { useAuth } from "../context/AuthContext";
import { axiosWrapper } from "../apis/axiosWrapper";
import { useQuery } from "@tanstack/react-query";

const Header = () => {
  const { location, loading, error } = useLocation();
  const { toggleModal, user, setUser } = useAuth();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  // 🔥 Fetch movies for search
  const { data: movies = [] } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const res = await axiosWrapper.get("/movies");
      return res.data.movies;
    },
  });

  const filteredMovies =
    search.length > 0
      ? movies.filter((movie) =>
          movie.title.toLowerCase().includes(search.toLowerCase()),
        )
      : [];

  const handleLogout = async () => {
    try {
      await axiosWrapper.post("/auth/logout");
      setUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full text-sm bg-white">
      {/* Top Navbar */}
      <div className="px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center py-3">
          {/* Left Part */}
          <div className="flex items-center space-x-4">
            <img
              onClick={() => navigate("/")}
              src={mainLogo}
              alt="logo"
              className="h-8 object-contain cursor-pointer"
            />

            <div className="relative">
              <input
                type="text"
                placeholder="Search for Movies, Events, Plays, Sports and Activities"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded px-4 py-1.5 w-[400px] text-sm outline-none"
              />
              <FaSearch className="absolute right-2 top-2.5 text-gray-500" />

              {/* 🔥 SEARCH DROPDOWN */}
              {search && (
                <div className="absolute top-10 left-0 w-[400px] bg-white shadow-lg rounded-md z-50 max-h-60 overflow-y-auto">
                  {filteredMovies.length === 0 ? (
                    <p className="p-3 text-gray-500 text-sm">
                      No results found
                    </p>
                  ) : (
                    filteredMovies.map((movie) => (
                      <div
                        key={movie._id}
                        onClick={() => {
                          navigate(
                            `/movies/${location}/${encodeURIComponent(
                              movie.title,
                            )}/${movie._id}/ticket`,
                          );
                          setSearch("");
                        }}
                        className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        {movie.title}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Part */}
          <div className="flex items-center space-x-6">
            <div className="text-sm font-medium cursor-pointer flex items-center space-x-2">
              {loading && <img src={map} alt="loading.." className="w-6 h-6" />}
              {!loading && !error && <p>{location} ▼</p>}
              {error && <p className="text-red-500">{error}</p>}
            </div>

            {!user ? (
              <button
                onClick={toggleModal}
                className="bg-[#f84464] text-white px-4 py-1.5 rounded text-sm cursor-pointer"
              >
                Sign in
              </button>
            ) : (
              <div
                onClick={() => navigate("/profile")}
                className="w-9 h-9 bg-[#f84464] text-white rounded-full flex items-center justify-center cursor-pointer font-semibold"
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navbar */}
      <div className="bg-[#f2f2f2] px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center py-2 text-gray-700">
          <div className="flex items-center space-x-6 font-medium ">
            <span
              onClick={() => navigate("/movies")}
              className="cursor-pointer hover:text-red-500"
            >
              Movies
            </span>
            <span className="cursor-pointer hover:text-red-500">Stream</span>
            <span className="cursor-pointer hover:text-red-500">Events</span>
            <span className="cursor-pointer hover:text-red-500">Plays</span>
            <span className="cursor-pointer hover:text-red-500">Sports</span>
            <span className="cursor-pointer hover:text-red-500">
              Activities
            </span>
          </div>
          <div className="flex items-center space-x-6 text-sm ">
            <span className="cursor-pointer hover:underline">ListYourShow</span>
            <span className="cursor-pointer hover:underline">Corporates</span>
            <span className="cursor-pointer hover:underline">Offers</span>
            <span className="cursor-pointer hover:underline">Gift Cards</span>
          </div>
        </div>
      </div>

      <SignInModel />
    </div>
  );
};

export default Header;
