import type { Request, Response, NextFunction } from "express";
import { Booking, type ISeatDetail } from "../models/Booking.js";
import { Movie } from "../models/Movie.js";
import type { IUserDocument } from "../models/User.js";

export async function createBooking(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user as IUserDocument | undefined;
    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const {
      movieId,
      showDate,
      showtime,
      theater,
      seats,
      seatDetails,
    } = req.body as {
      movieId?: string;
      showDate?: string;
      showtime?: string;
      theater?: string;
      seats?: string[];
      seatDetails?: ISeatDetail[];
    };

    if (
      !movieId ||
      !showDate ||
      !showtime ||
      !Array.isArray(seats) ||
      seats.length === 0
    ) {
      res.status(400).json({
        success: false,
        message: "Missing required booking details (movieId, showDate, showtime, seats)",
      });
      return;
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      res.status(404).json({
        success: false,
        message: "Movie not found",
      });
      return;
    }

    const selectedTheater = theater || movie.theaters[0] || "PVR INOX: Nexus Mall";

    // Check for seat conflicts
    const existingBookings = await Booking.find({
      movie: movie._id,
      showDate,
      showtime,
      theater: selectedTheater,
      status: "confirmed",
      seats: { $in: seats },
    });

    if (existingBookings.length > 0) {
      const alreadyTakenSeats = existingBookings.flatMap((b) =>
        b.seats.filter((s) => seats.includes(s))
      );
      res.status(409).json({
        success: false,
        message: `Seats already booked: ${alreadyTakenSeats.join(", ")}. Please select other seats.`,
        occupiedSeats: alreadyTakenSeats,
      });
      return;
    }

    // Calculate pricing
    let subtotal = 0;
    const computedDetails: ISeatDetail[] = [];

    if (Array.isArray(seatDetails) && seatDetails.length > 0) {
      for (const item of seatDetails) {
        subtotal += item.price;
        computedDetails.push(item);
      }
    } else {
      // Fallback calculation based on seat row prefix
      for (const seat of seats) {
        const row = seat.charAt(0).toUpperCase();
        let tier: "classic" | "prime" | "recliner" = "prime";
        let price = movie.tierPricing.prime;

        if (row === "A" || row === "B") {
          tier = "recliner";
          price = movie.tierPricing.recliner;
        } else if (row === "G" || row === "H" || row === "I" || row === "J") {
          tier = "classic";
          price = movie.tierPricing.classic;
        }

        subtotal += price;
        computedDetails.push({ seat, tier, price });
      }
    }

    const convenienceFee = seats.length * 30; // ₹30 per seat
    const tax = Math.round(convenienceFee * 0.18 * 100) / 100; // 18% GST on convenience fee
    const totalAmount = Math.round((subtotal + convenienceFee + tax) * 100) / 100;

    const bookingRandomPart = Math.floor(100000 + Math.random() * 900000);
    const bookingId = `BMS-${bookingRandomPart}`;
    const qrData = JSON.stringify({
      bookingId,
      movie: movie.title,
      seats,
      showDate,
      showtime,
      theater: selectedTheater,
      total: totalAmount,
    });

    const booking = await Booking.create({
      bookingId,
      user: user._id,
      movie: movie._id,
      movieTitle: movie.title,
      moviePoster: movie.posterUrl,
      theater: selectedTheater,
      showDate,
      showtime,
      seats,
      seatDetails: computedDetails,
      subtotal,
      convenienceFee,
      tax,
      totalAmount,
      status: "confirmed",
      qrData,
    });

    res.status(201).json({
      success: true,
      message: "Ticket booked successfully!",
      data: booking,
    });
  } catch (err) {
    next(err);
  }
}

export async function getOccupiedSeats(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { movieId, showDate, showtime, theater } = req.query as {
      movieId?: string;
      showDate?: string;
      showtime?: string;
      theater?: string;
    };

    if (!movieId || !showDate || !showtime) {
      res.status(400).json({
        success: false,
        message: "movieId, showDate, and showtime are required query parameters",
      });
      return;
    }

    const filter: Record<string, unknown> = {
      movie: movieId,
      showDate,
      showtime,
      status: "confirmed",
    };

    if (theater) {
      filter.theater = theater;
    }

    const bookings = await Booking.find(filter).select("seats");
    const occupiedSeats = Array.from(
      new Set(bookings.flatMap((booking) => booking.seats))
    );

    res.json({
      success: true,
      data: occupiedSeats,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyBookings(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user as IUserDocument | undefined;
    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const bookings = await Booking.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("movie", "title posterUrl backdropUrl duration rating language");

    res.json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
}
