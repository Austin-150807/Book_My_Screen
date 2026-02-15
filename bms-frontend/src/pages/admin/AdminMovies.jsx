import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosWrapper } from "../../apis/axiosWrapper";
import { useState } from "react";

const emptyMovie = {
  title: "",
  description: "",
  duration: "",
  genre: "",
  releaseDate: "",
  languages: "",
  certification: "",
  posterUrl: "",
  rating: "",
  votes: "",
  format: "",
};

const AdminMovies = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyMovie);

  // FETCH MOVIES
  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const res = await axiosWrapper.get("/movies");
      return res.data.movies;
    },
  });

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase()),
  );

  // ADD / EDIT
  const saveMovie = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        genre: form.genre.split(",").map((g) => g.trim()),
        languages: form.languages.split(",").map((l) => l.trim()),
        format: form.format.split(",").map((f) => f.trim()),
        rating: Number(form.rating),
        votes: Number(form.votes),
      };

      if (editingId) {
        return axiosWrapper.put(`/admin/movies/${editingId}`, payload);
      }

      return axiosWrapper.post("/admin/movies", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["movies"]);
      setIsModalOpen(false);
      setEditingId(null);
      setForm(emptyMovie);
    },
  });

  // DELETE
  const deleteMovie = useMutation({
    mutationFn: (id) => axiosWrapper.delete(`/admin/movies/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["movies"]);
    },
  });

  if (isLoading) return <div>Loading movies...</div>;

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Movies</h1>

        <button
          onClick={() => {
            setEditingId(null);
            setForm(emptyMovie);
            setIsModalOpen(true);
          }}
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Add Movie
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search movie..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded mb-6 w-full"
      />

      {/* MOVIE GRID */}
      {filteredMovies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {filteredMovies.map((movie) => (
            <div
              key={movie._id}
              className="bg-white shadow rounded-xl overflow-hidden"
            >
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="h-48 w-full object-cover"
              />

              <div className="p-4">
                <h3 className="font-bold text-lg">{movie.title}</h3>

                <p className="text-sm text-gray-500">Rating: {movie.rating}</p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => {
                      setEditingId(movie._id);
                      setForm({
                        ...movie,
                        genre: movie.genre.join(", "),
                        languages: movie.languages.join(", "),
                        format: movie.format.join(", "),
                        releaseDate: movie.releaseDate?.split("T")[0],
                      });
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteMovie.mutate(movie._id)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-[600px] max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Movie" : "Add Movie"}
            </h2>

            <div className="grid grid-cols-2 gap-4">
              {Object.keys(emptyMovie).map((key) => (
                <input
                  key={key}
                  placeholder={key}
                  value={form[key]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      [key]: e.target.value,
                    })
                  }
                  className="border p-2 rounded"
                />
              ))}
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>

              <button
                onClick={() => saveMovie.mutate()}
                className="bg-black text-white px-4 py-2 rounded"
              >
                {editingId ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMovies;
