import Header from "../components/seat-layout/Header";
import { FaInfoCircle } from "react-icons/fa";
import { BiSolidOffer } from "react-icons/bi";
import dayjs from "dayjs";
import { CiCircleQuestion, CiUser } from "react-icons/ci";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { axiosWrapper } from "../apis/axiosWrapper";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    selectedSeats = [],
    totalAmount = 0,
    showData,
  } = location.state || {};

  if (!showData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No booking data found.</p>
      </div>
    );
  }

  const tax = Math.round(totalAmount * 0.05);
  const finalAmount = totalAmount + tax;

  /* ===========================
     RAZORPAY PAYMENT HANDLER
  ============================ */
  const handlePayment = async () => {
    const options = {
      key: "rzp_test_SPcSICW7xcRoYH", // Test Key
      amount: finalAmount * 100, // Razorpay uses paise
      currency: "INR",
      name: "BookMyScreen",
      description: "Movie Ticket Booking",
      image: showData.movie.posterUrl,

      handler: async function () {
        try {
          // 1️⃣ Save booking in backend
          await axiosWrapper.post("/bookings", {
            showId: showData._id,
            seats: selectedSeats,
            totalAmount: finalAmount,
          });

          // 2️⃣ Go to success page
          navigate("/booking-success", {
            state: {
              showData,
              selectedSeats,
              totalAmount: finalAmount,
            },
          });
        } catch (error) {
          alert("Booking save failed");
        }
      },

      prefill: {
        name: user?.name,
        email: user?.email,
        contact: user?.phone,
      },

      theme: {
        color: "#f84464",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <Header type="checkout" showData={showData} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* LEFT SECTION */}
          <div className="flex-1 space-y-4">
            {/* Movie Details */}
            <div className="flex gap-4">
              <img
                src={showData.movie.posterUrl}
                alt={showData.movie.title}
                className="w-[60px] h-[90px] rounded object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">
                  {showData.movie.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {showData.theater?.name}, {showData.theater?.city}
                </p>
              </div>
            </div>

            {/* Show Details */}
            <div className="border border-gray-200 rounded-[24px] px-6 py-5">
              <p className="text-md font-medium border-b pb-5 border-gray-200">
                {dayjs(showData.date, "DD-MM-YYYY").format("D MMMM YYYY")} •{" "}
                <span className="font-semibold">{showData.startTime}</span>
              </p>

              <div className="flex items-center justify-between mt-4 mb-4">
                <div>
                  <p className="text-md mt-2 font-semibold">
                    {selectedSeats.length} Ticket
                  </p>

                  <div className="text-sm text-gray-500">
                    {selectedSeats.map((seat, index) => (
                      <p key={index}>
                        {seat.row} - {seat.number}
                      </p>
                    ))}
                  </div>
                </div>

                <p className="text-md font-semibold mt-2">₹{totalAmount}</p>
              </div>
            </div>

            {/* Cancellation */}
            <div className="bg-white border rounded-[24px] border-gray-200 text-yellow-800 text-sm px-6 py-5 tracking-wide">
              <span className="font-medium flex items-center gap-2">
                <FaInfoCircle size={24} />
                No cancellation or refund available after payment.
              </span>
            </div>

            {/* Offers */}
            <div className="flex items-center justify-between border rounded-[24px] border-gray-200 px-6 py-5">
              <p className="font-medium text-sm flex items-center gap-2">
                <BiSolidOffer size={20} /> Available Offers
              </p>
              <p className="text-sm text-blue-600 font-medium cursor-pointer">
                View all offers
              </p>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="w-full lg:w-[300px] space-y-4">
            <h4 className="font-medium text-gray-900 text-lg">
              Payment Summary
            </h4>

            <div className="border border-gray-200 rounded-[24px] px-6 py-7 space-y-2">
              <div className="flex justify-between text-md">
                <span className="text-sm text-gray-500">Order amount</span>
                <span>₹{totalAmount}</span>
              </div>

              <div className="flex justify-between text-md pb-4">
                <span className="font-semibold text-sm">Taxes & fees (5%)</span>
                <span>₹{tax}</span>
              </div>

              <div className="flex justify-between text-md font-semibold border-t border-gray-200 pt-4">
                <span>To be paid</span>
                <span>₹{finalAmount}</span>
              </div>
            </div>

            {/* USER DETAILS */}
            <h4 className="text-lg font-medium">Your details</h4>

            <div className="border flex items-start gap-3 border-gray-200 rounded-[24px] px-6 py-7">
              <CiUser size={24} />
              <div className="mt-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-sm text-gray-600">+91-{user?.phone}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>

            {/* Terms */}
            <div className="border border-gray-200 rounded-[24px] px-6 py-5">
              <p className="text-sm font-medium cursor-pointer flex items-center gap-2">
                <CiCircleQuestion size={24} /> Terms and conditions
              </p>
            </div>

            {/* PAY BUTTON */}
            <div
              onClick={handlePayment}
              className="flex justify-between items-center bg-black rounded-[24px] px-6 py-4 cursor-pointer"
            >
              <p className="text-white font-bold">
                ₹{finalAmount}{" "}
                <span className="text-xs font-medium">TOTAL</span>
              </p>
              <p className="text-white font-medium">Proceed To Pay</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
