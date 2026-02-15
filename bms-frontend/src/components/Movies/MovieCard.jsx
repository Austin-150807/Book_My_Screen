import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "../../context/LocationContext"; // your context for state/location

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { location } = useLocation();

  const handleNavigate = () => {
    const cleanedTitle = movie.title
      .replace(/:/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
    navigate(`/movies/${location}/${cleanedTitle}/${movie._id}/ticket`);
  };

  return (
    <div onClick={handleNavigate} className="w-40 md:w-52 cursor-pointer">
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="rounded-lg shadow-md"
      />
      <p className="mt-2 font-medium">{movie.title}</p>
      <p className="text-xs text-gray-500">
        {movie.rating} | {movie.votes}
      </p>
      <p className="text-sm text-gray-500">{movie.certification}</p>
      <p className="text-sm text-gray-500 truncate">
        {movie.languages?.join(" | ")}
      </p>
    </div>
  );
};

export default MovieCard;
