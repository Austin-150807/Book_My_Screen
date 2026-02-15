import { UserModel } from "../user/user.model";
import { MovieModel } from "../movie/movie.model";
import { BookingModel } from "../booking/booking.model";
import { ShowModel } from "../show/show.model";

// ============================
// DASHBOARD STATS
// ============================
export const getDashboardStats = async () => {
  const totalUsers = await UserModel.countDocuments();
  const totalMovies = await MovieModel.countDocuments();
  const totalShows = await ShowModel.countDocuments();

  const totalBookings = await BookingModel.countDocuments({
    paymentStatus: "SUCCESS",
  });

  const revenueData = await BookingModel.aggregate([
    { $match: { paymentStatus: "SUCCESS" } },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalAmount" },
      },
    },
  ]);

  const totalRevenue = revenueData[0]?.totalRevenue || 0;

  return {
    totalUsers,
    totalMovies,
    totalShows,
    totalBookings,
    totalRevenue,
  };
};

// ============================
// MOVIE CRUD
// ============================
export const createMovie = async (payload: any) => {
  return await MovieModel.create(payload);
};

export const updateMovie = async (id: string, payload: any) => {
  return await MovieModel.findByIdAndUpdate(id, payload, {
    new: true,
  });
};

export const deleteMovie = async (id: string) => {
  return await MovieModel.findByIdAndDelete(id);
};

// ============================
// GET ALL BOOKINGS (ADMIN)
// ============================
export const getAllBookings = async () => {
  return await BookingModel.find({
    paymentStatus: "SUCCESS",
  })
    .populate("user", "name email")
    .populate({
      path: "show",
      populate: {
        path: "movie theater",
      },
    })
    .sort({ createdAt: -1 });
};

// ============================
// USERS MANAGEMENT
// ============================

// GET ALL USERS
export const getAllUsers = async () => {
  return await UserModel.find().select("-__v");
};

// TOGGLE USER ROLE
export const toggleUserRole = async (id: string) => {
  const user = await UserModel.findById(id);
  if (!user) throw new Error("User not found");

  user.role = user.role === "admin" ? "user" : "admin";
  return await user.save();
};

// DELETE USER
export const deleteUser = async (id: string) => {
  return await UserModel.findByIdAndDelete(id);
};
