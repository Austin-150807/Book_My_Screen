import { Request, Response } from "express";
import * as AdminService from "./admin.service";
import { ShowModel } from "../show/show.model";
import { generateSeatLayout } from "../../utils";

// ============================
// DASHBOARD
// ============================
export const getDashboard = async (req: Request, res: Response) => {
  try {
    const data = await AdminService.getDashboardStats();

    res.status(200).json({
      success: true,
      data,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};

// ============================
// MOVIE CRUD
// ============================
export const addMovie = async (req: Request, res: Response) => {
  try {
    const movie = await AdminService.createMovie(req.body);

    res.status(201).json({
      success: true,
      data: movie,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Movie creation failed",
    });
  }
};

export const editMovie = async (req: Request, res: Response) => {
  try {
    const movie = await AdminService.updateMovie(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: movie,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Movie update failed",
    });
  }
};

export const removeMovie = async (req: Request, res: Response) => {
  try {
    await AdminService.deleteMovie(req.params.id);

    res.status(200).json({
      success: true,
      message: "Movie deleted",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Movie deletion failed",
    });
  }
};

// ============================
// BOOKINGS
// ============================
export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await AdminService.getAllBookings();

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};

// ============================
// SHOW MANAGEMENT
// ============================
export const getShows = async (req: Request, res: Response) => {
  try {
    const shows = await ShowModel.find()
      .populate("movie", "title")
      .populate("theater", "name city")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: shows,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch shows",
    });
  }
};

export const addShow = async (req: Request, res: Response) => {
  try {
    const show = await ShowModel.create({
      movie: req.body.movie,
      theater: req.body.theater,
      location: req.body.location,
      format: req.body.format,
      audioType: req.body.audioType || "Dolby 7.1",
      startTime: req.body.startTime,
      date: req.body.date,
      priceMap: new Map([
        ["PREMIUM", 510],
        ["EXECUTIVE", 290],
        ["NORMAL", 270],
      ]),
      seatLayout: generateSeatLayout(),
    });

    res.status(201).json({
      success: true,
      data: show,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Show creation failed",
    });
  }
};

export const removeShow = async (req: Request, res: Response) => {
  try {
    await ShowModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Show deleted",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Show deletion failed",
    });
  }
};

// ============================
// USERS MANAGEMENT
// ============================

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await AdminService.getAllUsers();

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};

export const toggleRole = async (req: Request, res: Response) => {
  try {
    const user = await AdminService.toggleUserRole(req.params.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to update role",
    });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    await AdminService.deleteUser(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};
