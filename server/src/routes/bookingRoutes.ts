import { Router } from "express";
import {
  createBooking,
  getOccupiedSeats,
  getMyBookings,
} from "../controllers/bookingController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.get("/occupied", getOccupiedSeats);
router.post("/", requireAuth, createBooking);
router.get("/my-bookings", requireAuth, getMyBookings);

export default router;
