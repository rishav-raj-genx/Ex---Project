import type { Movie } from "./movie";

export type SeatTier = "classic" | "prime" | "recliner";

export interface SeatDetail {
  seat: string;
  tier: SeatTier;
  price: number;
}

export interface Booking {
  _id: string;
  bookingId: string;
  user: string;
  movie: string | Movie;
  movieTitle: string;
  moviePoster: string;
  theater: string;
  showDate: string;
  showtime: string;
  seats: string[];
  seatDetails: SeatDetail[];
  subtotal: number;
  convenienceFee: number;
  tax: number;
  totalAmount: number;
  status: "confirmed" | "cancelled";
  qrData?: string;
  createdAt: string;
}

export interface BookingRequest {
  movieId: string;
  showDate: string;
  showtime: string;
  theater: string;
  seats: string[];
  seatDetails: SeatDetail[];
}
