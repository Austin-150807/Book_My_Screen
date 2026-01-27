import React from "react";
import BannerSlider from "../components/BannerSlider";
import MovieFilters from "../components/Movies/MovieFilters";
import MovieList from "../components/Movies/MovieList";

const Movies = () => {
  return (
    <div>
      <BannerSlider />
      <div className="flex flex-col md:flex-row bg-[#f5f5f5] min-h-screen md:px-[100px] pb-10 pt-8">
        <MovieFilters />
        <MovieList />
      </div>
    </div>
  );
};

export default Movies;
