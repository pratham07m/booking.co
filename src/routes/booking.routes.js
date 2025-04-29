import express from "express";
import {
  bookSlot,
  getuserBookings,
  cancelBooking,
  getOrganizerBookings,
  getBookingDetails,
} from "../controllers/booking.controller.js";
import { authenticate } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/book", authenticate, bookSlot);

router.get("/my-bookings", authenticate, getuserBookings);

router.delete("/cancel/:bookingId", authenticate, cancelBooking);

// get organizer booking slots
router.get("/bookings", authenticate, getOrganizerBookings);

router.get("/bookslot/:bookingId", authenticate, getBookingDetails);

export default router;
