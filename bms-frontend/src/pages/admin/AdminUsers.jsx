import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosWrapper } from "../../apis/axiosWrapper";

const AdminUsers = () => {
  const queryClient = useQueryClient();

  // ===============================
  // FETCH USERS
  // ===============================
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await axiosWrapper.get("/admin/users");
      return res.data.data;
    },
  });

  // ===============================
  // TOGGLE ROLE
  // ===============================
  const toggleRole = useMutation({
    mutationFn: (id) => axiosWrapper.patch(`/admin/users/${id}/role`),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
    },
  });

  // ===============================
  // DELETE USER
  // ===============================
  const deleteUser = useMutation({
    mutationFn: (id) => axiosWrapper.delete(`/admin/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["adminUsers"]);
    },
  });

  if (isLoading) return <div>Loading users...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Users</h1>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-4">{user.name || "N/A"}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      user.role === "admin"
                        ? "bg-black text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="p-4 space-x-4">
                  <button
                    onClick={() => toggleRole.mutate(user._id)}
                    className="text-blue-600 hover:underline"
                  >
                    Toggle Role
                  </button>

                  <button
                    onClick={() => deleteUser.mutate(user._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
