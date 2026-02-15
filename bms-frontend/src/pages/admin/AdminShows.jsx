import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosWrapper } from "../../apis/axiosWrapper";
import { useState } from "react";

const AdminShows = () => {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    movie: "",
    theater: "",
    location: "",
    format: "2D",
    audioType: "Dolby 7.1",
    startTime: "",
    date: "",
  });

  // ===============================
  // FETCH SHOWS
  // ===============================
  const { data: shows = [], isLoading } = useQuery({
    queryKey: ["adminShows"],
    queryFn: async () => {
      const res = await axiosWrapper.get("/admin/shows");
      return res.data.data;
    },
  });

  // ===============================
  // FETCH MOVIES
  // ===============================
  const { data: movies = [] } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const res = await axiosWrapper.get("/movies");
      return res.data.movies;
    },
  });

  // ===============================
  // FETCH THEATERS (RAW ARRAY FIX)
  // ===============================
  const { data: theaters = [] } = useQuery({
    queryKey: ["theaters"],
    queryFn: async () => {
      const res = await axiosWrapper.get("/theaters");
      return res.data; // 🔥 IMPORTANT FIX
    },
  });

  // ===============================
  // CREATE SHOW
  // ===============================
  const createShow = useMutation({
    mutationFn: () => axiosWrapper.post("/admin/shows", form),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminShows"]);
      setForm({
        movie: "",
        theater: "",
        location: "",
        format: "2D",
        audioType: "Dolby 7.1",
        startTime: "",
        date: "",
      });
    },
  });

  // ===============================
  // DELETE SHOW
  // ===============================
  const deleteShow = useMutation({
    mutationFn: (id) => axiosWrapper.delete(`/admin/shows/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminShows"]);
    },
  });

  if (isLoading) return <div>Loading shows...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Shows</h1>

      {/* ===============================
          ADD SHOW FORM
      =============================== */}
      <div className="bg-white p-6 shadow rounded mb-8 grid grid-cols-3 gap-4">
        {/* MOVIE */}
        <select
          value={form.movie}
          onChange={(e) => setForm({ ...form, movie: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Movie</option>
          {movies.map((movie) => (
            <option key={movie._id} value={movie._id}>
              {movie.title}
            </option>
          ))}
        </select>

        {/* THEATER */}
        <select
          value={form.theater}
          onChange={(e) => {
            const selected = theaters.find((t) => t._id === e.target.value);

            setForm({
              ...form,
              theater: e.target.value,
              location: selected?.state || "",
            });
          }}
          className="border p-2 rounded"
        >
          <option value="">Select Theater</option>
          {theaters.map((theater) => (
            <option key={theater._id} value={theater._id}>
              {theater.name} - {theater.city}
            </option>
          ))}
        </select>

        {/* FORMAT */}
        <select
          value={form.format}
          onChange={(e) => setForm({ ...form, format: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="2D">2D</option>
          <option value="3D">3D</option>
          <option value="IMAX">IMAX</option>
          <option value="PVR PXL">PVR PXL</option>
        </select>

        {/* DATE PICKER */}
        <input
          type="date"
          onChange={(e) => {
            const formatted = e.target.value.split("-").reverse().join("-");
            setForm({ ...form, date: formatted });
          }}
          className="border p-2 rounded"
        />

        {/* TIME DROPDOWN (MATCHES SEED) */}
        <select
          value={form.startTime}
          onChange={(e) => setForm({ ...form, startTime: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="">Select Time</option>
          <option>09:00 AM</option>
          <option>12:30 PM</option>
          <option>04:00 PM</option>
          <option>07:30 PM</option>
          <option>10:30 PM</option>
        </select>

        {/* SUBMIT */}
        <button
          onClick={() => createShow.mutate()}
          className="bg-black text-white px-4 py-2 rounded col-span-3"
        >
          Add Show
        </button>
      </div>

      {/* ===============================
          SHOW LIST
      =============================== */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Movie</th>
              <th className="p-4">Theater</th>
              <th className="p-4">Date</th>
              <th className="p-4">Time</th>
              <th className="p-4">Format</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {shows.map((show) => (
              <tr key={show._id} className="border-t">
                <td className="p-4">{show.movie?.title}</td>
                <td className="p-4">{show.theater?.name}</td>
                <td className="p-4">{show.date}</td>
                <td className="p-4">{show.startTime}</td>
                <td className="p-4">{show.format}</td>
                <td className="p-4">
                  <button
                    onClick={() => deleteShow.mutate(show._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminShows;
