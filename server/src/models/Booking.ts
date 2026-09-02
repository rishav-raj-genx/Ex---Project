import mongoose, { type Document, Schema } from "mongoose";

export interface ISeatDetail {
  seat: string;
  tier: "classic" | "prime" | "recliner";
  price: number;
}

export interface IBooking {
  bookingId: string;
  user: mongoose.Types.ObjectId;
  movie: mongoose.Types.ObjectId;
  movieTitle: string;
  moviePoster: string;
  theater: string;
  showDate: string;
  showtime: string;
  seats: string[];
  seatDetails: ISeatDetail[];
  subtotal: number;
  convenienceFee: number;
  tax: number;
  totalAmount: number;
  status: "confirmed" | "cancelled";
  qrData: string;
}

export interface IBookingDocument extends IBooking, Document {
  createdAt: Date;
  updatedAt: Date;
}

const seatDetailSchema = new Schema<ISeatDetail>(
  {
    seat: { type: String, required: true },
    tier: {
      type: String,
      enum: ["classic", "prime", "recliner"],
      required: true,
    },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const bookingSchema = new Schema<IBookingDocument>(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    movie: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
      required: [true, "Movie is required"],
      index: true,
    },
    movieTitle: {
      type: String,
      required: true,
    },
    moviePoster: {
      type: String,
      required: true,
    },
    theater: {
      type: String,
      required: true,
      default: "PVR INOX: Nexus Mall",
    },
    showDate: {
      type: String,
      required: [true, "Show date is required"],
    },
    showtime: {
      type: String,
      required: [true, "Showtime is required"],
    },
    seats: {
      type: [String],
      required: [true, "At least one seat must be selected"],
      validate: {
        validator: (seats: string[]) => seats.length > 0,
        message: "At least one seat must be selected",
      },
    },
    seatDetails: {
      type: [seatDetailSchema],
      default: [],
    },
    subtotal: {
      type: Number,
      required: true,
    },
    convenienceFee: {
      type: Number,
      required: true,
      default: 40,
    },
    tax: {
      type: Number,
      required: true,
      default: 7.2,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "cancelled"],
      default: "confirmed",
    },
    qrData: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Composite index to check seat availability efficiently
bookingSchema.index({ movie: 1, showDate: 1, showtime: 1, status: 1 });

export const Booking = mongoose.model<IBookingDocument>("Booking", bookingSchema);
