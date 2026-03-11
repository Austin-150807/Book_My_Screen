import React from "react";
import { MdChair } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { getMyBookings } from "../../apis/index";
import dayjs from "dayjs";

const BookingHistory = () => {
  const {
    data: bookings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["myBookings"],
    queryFn: async () => await getMyBookings(),
    select: (res) => res.data.bookings,
  });

  if (isLoading)
    return (
      <div className="px-6">
        <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
        <p>Loading bookings...</p>
      </div>
    );

  if (isError)
    return (
      <div className="px-6">
        <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
        <p>Failed to load bookings</p>
      </div>
    );

  if (!bookings || bookings.length === 0)
    return (
      <div className="px-6">
        <h3 className="text-xl font-semibold mb-4">Your Orders</h3>
        <p className="text-gray-500">No bookings yet 🎟️</p>
      </div>
    );

  return (
    <div className="px-6 rounded-md">
      <h3 className="text-xl font-semibold mb-4">Your Orders</h3>

      {bookings.map((booking) => {
        // 🔒 Prevent crash if data missing
        if (!booking?.show || !booking.show?.movie || !booking.show?.theater) {
          return null;
        }

        const show = booking.show;
        const movie = show.movie;
        const theater = show.theater;

        const ticketAmount = booking?.totalAmount || 0;
        const fee = Math.round(ticketAmount * 0.05);
        const total = ticketAmount + fee;

        return (
          <React.Fragment key={booking._id}>
            <div className="bg-white p-5 rounded-md mb-2 overflow-hidden">
              <div className="flex items-start gap-10">
                <img
                  src={movie?.posterUrl}
                  alt={movie?.title}
                  className="w-30 h-40 object-cover rounded"
                />

                <div className="h-40 border-l-2 border-gray-300 border-dashed"></div>

                <div className="flex items-start justify-between w-full">
                  <div className="flex-1">
                    <p className="font-normal text-lg">{movie?.title}</p>

                    <p className="text-sm text-gray-500">{show?.audioType}</p>

                    <p className="text-sm font-semibold text-gray-700 mt-2">
                      {dayjs(show?.date, "DD-MM-YYYY").format("D MMM YYYY")} -{" "}
                      {theater?.name}, {theater?.city}
                    </p>

                    <small className="text-gray-700 mt-1">
                      Quantity: {booking?.seats?.length || 0}
                    </small>

                    <p className="text-md font-semibold text-gray-700 mt-2">
                      <MdChair className="inline items-center mr-2" size={24} />
                      {booking?.seats
                        ?.map((seat) => `${seat.row}-${seat.number}`)
                        .join(", ")}
                    </p>
                  </div>

                  <p>M-Ticket</p>
                </div>
              </div>

              <div className="p-4 text-right">
                <p className="text-sm text-gray-500">
                  Ticket: ₹{ticketAmount.toFixed(2)} + Convenience Fees: ₹
                  {fee.toFixed(2)}
                </p>
                <p className="text-xl font-bold">₹{total.toFixed(2)}</p>
              </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-8">
              <div>
                <p className="font-semibold">Booking Date & Time</p>
                <p>{dayjs(booking?.createdAt).format("D MMM YYYY, hh:mm A")}</p>
              </div>

              <div>
                <p className="font-semibold">Payment Method</p>
                <p>Online (Razorpay)</p>
              </div>

              <div>
                <p className="font-semibold">Booking ID</p>
                <p>{booking?._id}</p>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BookingHistory;
