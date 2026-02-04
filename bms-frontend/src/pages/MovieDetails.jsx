import React from "react";
import m4 from "../assets/m4.avif";
import TheaterTimings from "../components/Movies/TheaterTimings";

const movie = {
  id: 4,
  title: "F1: The Movie",
  genre: ["Action", "Drama", "Sports"],
  rating: 9.5,
  votes: "6.8K",
  img: m4,
  languages: ["English", "Hindi", "Tamil", "Telugu"],
  format: ["2D", "3D", "IMAX 3D"],
  certification: "UA16+",
  duration: "2h 24m",
  releaseDate: "2023-09-15",
  description:
    "F1: The Movie is a pulse-pounding drama that immerses audiences in the electrifying world of Formula 1 racing. At its heart is the story of a gifted yet rebellious driver, battling fierce rivals and personal demons as he fights for glory both on and off the track. With spectacular racing sequences, raw emotion, and a narrative fueled by ambition, teamwork, and redemption, the film delivers an unforgettable ride.",
};

const MovieDetails = () => {
  return (
    <>
      {/* ================= MOVIE BANNER ================= */}
      <div
        className="relative text-white px-4 py-10"
        style={{
          backgroundImage: `url(${movie.img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black opacity-70"></div>

        {/* Banner content */}
        <div className="relative z-10 max-w-7xl mx-auto flex gap-10">
          {/* Poster */}
          <img
            src={movie.img}
            alt={movie.title}
            className="w-52 rounded-xl shadow-xl"
          />

          {/* Details */}
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>

            <div className="bg-[#3a3a3a] inline-flex items-center gap-3 px-4 py-2 rounded-md mb-4 text-sm">
              <span className="text-pink-500 font-bold">★ {movie.rating}</span>
              <span className="text-gray-300">({movie.votes} votes)</span>
              <button className="bg-[#2f2f2f] px-3 py-1 rounded-md">
                Rate Now
              </button>
            </div>

            <div className="flex gap-3 mb-4 text-sm">
              <span className="bg-[#3a3a3a] px-3 py-1 rounded">
                {movie.format.join(", ")}
              </span>
              <span className="bg-[#3a3a3a] px-3 py-1 rounded">
                {movie.languages.join(", ")}
              </span>
            </div>

            <p className="text-gray-300 mb-4 text-sm">
              {movie.duration} ● {movie.genre.join(", ")} ●{" "}
              {movie.certification} ● {movie.releaseDate}
            </p>

            <h2 className="text-xl font-bold mb-2">About the movie</h2>
            <p className="text-gray-100">{movie.description}</p>
          </div>

          {/* Share button */}
          <div className="absolute top-0 right-0">
            <button className="bg-[#3a3a3a] px-4 py-2 rounded text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 16.08c-.76 0-1.44.3-1.96.77l-7.13-4.21c.05-.25.09-.51.09-.78s-.03-.53-.09-.78l7.13-4.15c.54.5 1.25.81 2.05.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .27.04.52.09.78L7.91 9.93C7.38 9.43 6.67 9.12 5.87 9.12c-1.66 0-3 1.34-3 3s1.34 3 3 3c.8 0 1.51-.31 2.04-.81l7.13 4.21c-.06.24-.09.49-.09.75 0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3z" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>

      {/* ================= FILTERS + AVAILABILITY ================= */}
      <div className="bg-white px-4 py-3">
        <div className="max-w-7xl mx-auto">
          {/* White chips row */}
          <div className="flex flex-wrap gap-2 mb-3">
            {[
              "2D",
              "3D",
              "Wheelchair Friendly",
              "Premium Seats",
              "Recliners",
              "IMAX",
              "PVR PXL",
              "4DX",
              "Laser",
              "Dolby Atmos",
            ].map((item, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm border rounded-md text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                {item}
              </span>
            ))}
          </div>

          {/* Grey availability row */}
          <div className="bg-gray-200 px-3 py-2 rounded-md flex items-center gap-6 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-black rounded-full inline-block"></span>
              <small className="text-gray-600">Available</small>
            </span>

            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-400 rounded-full inline-block"></span>
              <small className="text-gray-600">Filling fast</small>
            </span>

            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-red-400 rounded-full inline-block"></span>
              <small className="text-gray-600">Almost full</small>
            </span>
          </div>
          {/* ================= THEATRES & TIMINGS ================= */}
          <TheaterTimings />
        </div>
        
      </div>
    </>
  );
};

export default MovieDetails;
