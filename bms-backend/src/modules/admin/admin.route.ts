import express from "express";
import {
  getDashboard,
  addMovie,
  editMovie,
  removeMovie,
  getBookings,
} from "./admin.controller";
import { getShows, addShow, removeShow } from "./admin.controller";
import { getUsers, toggleRole, removeUser } from "./admin.controller";

import { isVerifiedUser } from "../../middlewares/auth.middleware";
import { isAdmin } from "../../middlewares/admin.middleware";

const router = express.Router();

// ============================
// DASHBOARD
// ============================
router.get("/dashboard", isVerifiedUser, isAdmin, getDashboard);

// ============================
// BOOKINGS (ADMIN VIEW)
// ============================
router.get("/bookings", isVerifiedUser, isAdmin, getBookings);

// ============================
// MOVIE CRUD
// ============================
router.post("/movies", isVerifiedUser, isAdmin, addMovie);

router.put("/movies/:id", isVerifiedUser, isAdmin, editMovie);

router.delete("/movies/:id", isVerifiedUser, isAdmin, removeMovie);

router.get("/shows", isVerifiedUser, isAdmin, getShows);
router.post("/shows", isVerifiedUser, isAdmin, addShow);
router.delete("/shows/:id", isVerifiedUser, isAdmin, removeShow);
router.get("/users", getUsers);
router.patch("/users/:id/role", toggleRole);
router.delete("/users/:id", removeUser);

export default router;
