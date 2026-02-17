import React from "react";
import BannerSlider from "../components/BannerSlider";
import MovieFilters from "../components/Movies/MovieFilters";
import MovieList from "../components/Movies/MovieList";
import { getAllMovies } from "../apis/index";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

const Movies = () => {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allMovies"],
    queryFn: async () => {
      const res = await getAllMovies();
      return res.data.movies;
    },
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  if (isError) {
    toast.error("Failed to load movies");
  }

  const allMovies = data ?? [];

  return (
    <div>
      <BannerSlider />
      <div className="flex flex-col md:flex-row bg-[#f5f5f5] min-h-screen md:px-[100px] pb-10 pt-8">
        <MovieFilters />

        {isLoading ? (
          <div className="p-10 text-gray-500">Loading movies...</div>
        ) : (
          <MovieList allMovies={allMovies} />
        )}
      </div>
    </div>
  );
};

export default Movies;
