import React from "react";
import { languages } from "../../utils/constants";
import MovieCard from "./MovieCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllMovies } from "../../apis";

const MovieList = () => {
  const {
    data: movies,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["movies"],
    queryFn: getAllMovies,
    placeholderData: keepPreviousData,
  });

  if (isLoading) return <p className="text-gray-500">Loading movies...</p>;
  if (isError) return <p className="text-red-500">Failed to load movies.</p>;

  // Adjust based on your backend response shape
  const movieArray = movies?.data?.movies || movies?.data || [];

  return (
    <div className="w-full md:w-3/4 p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {languages.map((lang, i) => (
          <span
            key={i}
            className="bg-white border border-gray-200 text-[#f74362]
            py-1 px-3 rounded-[24px]
            text-sm cursor-pointer hover:bg-gray-100"
          >
            {lang}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center bg-white px-6 py-6 rounded mb-6">
        <h3 className="font-semibold text-xl">Coming Soon</h3>
        <a
          href="#"
          className="text-red-500 text-sm font-medium flex items-center"
        >
          Explore upcoming Movies <span className="ml-1">→</span>
        </a>
      </div>

      <div className="flex flex-wrap gap-6">
        {Array.isArray(movieArray) && movieArray.length > 0 ? (
          movieArray.map((movie, i) => <MovieCard key={i} movie={movie} />)
        ) : (
          <p className="text-gray-500">No movies found.</p>
        )}
      </div>
    </div>
  );
};

export default MovieList;
