import { useQuery } from "@tanstack/react-query";
import { axiosWrapper } from "../../apis/axiosWrapper";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      const res = await axiosWrapper.get("/admin/dashboard");
      return res.data.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-4 gap-6">
        <Card
          title="Users"
          value={data.totalUsers}
          onClick={() => navigate("/admin/users")}
        />

        <Card
          title="Movies"
          value={data.totalMovies}
          onClick={() => navigate("/admin/movies")}
        />

        <Card
          title="Shows"
          value={data.totalShows}
          onClick={() => navigate("/admin/shows")}
        />

        <Card
          title="Bookings"
          value={data.totalBookings}
          onClick={() => navigate("/admin/bookings")}
        />

        <Card title="Revenue" value={`₹ ${data.totalRevenue}`} />
      </div>
    </div>
  );
};

const Card = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-xl shadow p-6 transition ${
      onClick ? "cursor-pointer hover:shadow-xl hover:scale-[1.02]" : ""
    }`}
  >
    <p className="text-gray-500 text-sm">{title}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default AdminDashboard;
