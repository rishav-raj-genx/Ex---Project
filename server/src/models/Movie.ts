import mongoose, { type Document, Schema } from "mongoose";

export interface ITierPricing {
  classic: number;
  prime: number;
  recliner: number;
}

export interface IMovie {
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  genres: string[];
  language: string;
  duration: number; // in minutes
  rating: number; // e.g. 8.8
  releaseDate: string;
  theaters: string[];
  showtimes: string[];
  tierPricing: ITierPricing;
  featured?: boolean;
  addedBy?: mongoose.Types.ObjectId;
}

export interface IMovieDocument extends IMovie, Document {
  createdAt: Date;
  updatedAt: Date;
}

const tierPricingSchema = new Schema<ITierPricing>(
  {
    classic: { type: Number, required: true, default: 180 },
    prime: { type: Number, required: true, default: 280 },
    recliner: { type: Number, required: true, default: 450 },
  },
  { _id: false }
);

const movieSchema = new Schema<IMovieDocument>(
  {
    title: {
      type: String,
      required: [true, "Movie title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },
    posterUrl: {
      type: String,
      required: [true, "Poster image URL is required"],
      trim: true,
    },
    backdropUrl: {
      type: String,
      default: "",
      trim: true,
    },
    genres: {
      type: [String],
      required: [true, "At least one genre is required"],
      validate: {
        validator: (v: string[]) => v.length > 0,
        message: "At least one genre is required",
      },
    },
    language: {
      type: String,
      required: [true, "Language is required"],
      trim: true,
      default: "English",
    },
    duration: {
      type: Number,
      required: [true, "Duration in minutes is required"],
      min: [1, "Duration must be at least 1 minute"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [0, "Rating cannot be less than 0"],
      max: [10, "Rating cannot be greater than 10"],
      default: 8.5,
    },
    releaseDate: {
      type: String,
      required: [true, "Release date is required"],
    },
    theaters: {
      type: [String],
      default: ["PVR INOX: Nexus Mall", "Cinepolis: Grand Plaza", "IMAX: Wave City Center"],
    },
    showtimes: {
      type: [String],
      default: ["10:30 AM", "01:45 PM", "05:15 PM", "08:45 PM", "11:15 PM"],
    },
    tierPricing: {
      type: tierPricingSchema,
      default: () => ({ classic: 180, prime: 280, recliner: 450 }),
    },
    featured: {
      type: Boolean,
      default: false,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Movie = mongoose.model<IMovieDocument>("Movie", movieSchema);
