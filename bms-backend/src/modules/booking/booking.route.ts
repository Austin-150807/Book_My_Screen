import express from "express";
import * as BookingController from "./booking.controller";
import { isVerifiedUser } from "../../middlewares/auth.middleware";

const router = express.Router();

router.post("/", isVerifiedUser, BookingController.createBooking);
router.get("/my-bookings", isVerifiedUser, BookingController.getMyBookings);

export default router;
