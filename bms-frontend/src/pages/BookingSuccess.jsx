import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { FaCheckCircle } from "react-icons/fa";

const BookingSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { showData, selectedSeats, totalAmount } = location.state || {};

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!showData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No booking data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden">
      {/* 🎉 Confetti */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={300}
      />

      <div className="bg-white shadow-2xl rounded-3xl p-10 text-center max-w-lg w-full z-10">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />

        <h1 className="text-3xl font-bold text-gray-900">
          Booking Confirmed 🎬
        </h1>

        <p className="text-gray-500 mt-2">
          Your tickets have been successfully booked!
        </p>

        {/* Movie Info */}
        <div className="mt-6 text-left space-y-2 border-t pt-4">
          <p className="font-semibold text-lg">{showData.movie.title}</p>

          <p className="text-sm text-gray-600">
            {showData.theater?.name}, {showData.theater?.city}
          </p>

          <p className="text-sm text-gray-600">
            Seats:{" "}
            {selectedSeats?.map((seat, i) => (
              <span key={i}>
                {seat.row}
                {seat.number}
                {i !== selectedSeats.length - 1 && ", "}
              </span>
            ))}
          </p>

          <p className="text-sm text-gray-600">Total Paid: ₹{totalAmount}</p>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-black text-white py-2 rounded-xl"
          >
            Go Home
          </button>

          <button
            onClick={() => navigate("/profile?tab=orders")}
            className="bg-[#f84464] text-white px-6 py-3 rounded-lg font-semibold"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
