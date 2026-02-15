import { Request, Response, NextFunction } from "express";
import { BookingModel } from "./booking.model";
import { ShowModel } from "../show/show.model";
import createHttpError from "http-errors";

/* =========================
   CREATE BOOKING
========================= */
export const createBooking = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { showId, seats, totalAmount } = req.body;

    if (!showId || !seats || !totalAmount) {
      return next(new createHttpError.BadRequest("All fields are required"));
    }

    if (!req.user?._id) {
      return next(new createHttpError.Unauthorized("User not authenticated"));
    }

    const show = await ShowModel.findById(showId);

    if (!show) {
      return next(new createHttpError.NotFound("Show not found"));
    }

    // 🔒 LOCK SEATS
    for (const selectedSeat of seats) {
      let seatFound = false;

      for (const row of show.seatLayout as any[]) {
        if (row.row === selectedSeat.row) {
          for (const seat of row.seats) {
            if (seat.number === selectedSeat.number) {
              if (seat.status === "BOOKED") {
                return next(
                  new createHttpError.Conflict(
                    `Seat ${row.row}${seat.number} already booked`,
                  ),
                );
              }

              seat.status = "BOOKED";
              seatFound = true;
            }
          }
        }
      }

      if (!seatFound) {
        return next(
          new createHttpError.BadRequest(
            `Seat ${selectedSeat.row}${selectedSeat.number} not found`,
          ),
        );
      }
    }

    // 🔥 IMPORTANT: Tell mongoose nested field changed
    show.markModified("seatLayout");

    await show.save();

    const booking = await BookingModel.create({
      user: req.user._id,
      show: showId,
      seats,
      totalAmount,
      paymentStatus: "SUCCESS",
    });

    res.status(201).json({
      success: true,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET MY BOOKINGS
========================= */
export const getMyBookings = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user?._id) {
      return next(new createHttpError.Unauthorized("User not authenticated"));
    }

    const bookings = await BookingModel.find({
      user: req.user._id,
    })
      .populate({
        path: "show",
        populate: ["movie", "theater"],
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};
