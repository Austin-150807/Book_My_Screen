import { useQuery } from "@tanstack/react-query";
import { axiosWrapper } from "../../apis/axiosWrapper";
import dayjs from "dayjs";

const AdminBookings = () => {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: async () => {
      const res = await axiosWrapper.get("/admin/bookings");
      return res.data.data;
    },
  });

  if (isLoading) return <div>Loading bookings...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bookings Overview</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Movie</th>
                <th className="p-4">Date</th>
                <th className="p-4">Theater</th>
                <th className="p-4">Amount</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((booking) => {
                const show = booking.show;
                const movie = show?.movie;
                const theater = show?.theater;

                return (
                  <tr key={booking._id} className="border-t">
                    {/* USER */}
                    <td className="p-4">{booking.user?.name}</td>

                    {/* MOVIE NAME */}
                    <td className="p-4">{movie?.title}</td>

                    {/* DATE (FIXED USING DAYJS) */}
                    <td className="p-4">
                      {show?.date
                        ? dayjs(show.date, "DD-MM-YYYY").format("D MMM YYYY")
                        : "-"}
                    </td>

                    {/* THEATER */}
                    <td className="p-4">{theater?.name}</td>

                    {/* AMOUNT */}
                    <td className="p-4 font-semibold">
                      ₹ {booking.totalAmount}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
