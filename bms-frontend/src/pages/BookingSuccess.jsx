import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { FaCheckCircle } from "react-icons/fa";
import { generateTicketPDF } from "../utils/generateTicketPDF";

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

  const formattedSeats = selectedSeats
    ?.map((seat) => `${seat.row}${seat.number}`)
    .join(", ");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-gray-100 relative overflow-hidden px-4">
      {/* 🎉 Confetti */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={250}
        recycle={false}
      />

      <div className="bg-white shadow-2xl rounded-3xl p-10 text-center max-w-lg w-full z-10 transform transition-all duration-500 hover:scale-[1.02]">
        <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4 animate-bounce" />

        <h1 className="text-3xl font-bold text-gray-900">
          Booking Confirmed 🎬
        </h1>

        <p className="text-gray-500 mt-2">
          Your tickets have been successfully booked!
        </p>

        {/* 🎬 Movie Info */}
        <div className="mt-6 text-left space-y-3 border-t pt-4">
          <p className="font-semibold text-lg">{showData.movie.title}</p>

          <p className="text-sm text-gray-600">
            {showData.theater?.name}, {showData.theater?.city}
          </p>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Seats:</span> {formattedSeats}
          </p>

          <p className="text-sm text-gray-600">
            <span className="font-medium">Total Paid:</span> ₹{totalAmount}
          </p>
        </div>

        {/* 🔘 Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() =>
              generateTicketPDF({
                showData,
                selectedSeats,
                totalAmount,
                bookingId:
                  showData._id ||
                  showData.bookingId ||
                  location.state?.bookingId,
              })
            }
            className="flex-1 bg-[#f84464] hover:bg-[#e63b59] text-white py-3 rounded-xl font-semibold transition-all duration-300"
          >
            Download Ticket PDF
          </button>

          <button
            onClick={() => navigate("/profile?tab=orders")}
            className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            View Orders
          </button>
        </div>

        <button
          onClick={() => navigate("/")}
          className="mt-4 text-sm text-gray-500 hover:underline"
        >
          Go Home
        </button>
      </div>
    </div>
  );
};

export default BookingSuccess;
