import React from "react";
import Slider from "react-slick";
import { banners } from "../utils/constants";

const BannerSlider = () => {
  const settings = {
    centerMode: true,
    centerPadding: "200px", // adjust side preview space
    slidesToShow: 1,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 2500,
    speed: 800,
    arrows: true,
    dots: true,
  };

  return (
    <div className="w-full bg-white py-6">
      <div className="mx-auto px-4">
        <Slider {...settings}>
          {banners.map((banner, i) => (
            <div key={i} className="px-2">
              <div className="w-full h-[300px] overflow-hidden rounded-xl">
                <img
                  src={banner}
                  alt={`banner-${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BannerSlider;
