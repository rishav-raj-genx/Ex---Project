import type { Request, Response, NextFunction } from "express";
import { Movie, type IMovie } from "../models/Movie.js";
import type { IUserDocument } from "../models/User.js";

export async function getMovies(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { search, genre, language, featured } = req.query as {
      search?: string;
      genre?: string;
      language?: string;
      featured?: string;
    };

    const filter: Record<string, unknown> = {};

    if (search && search.trim() !== "") {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } },
      ];
    }

    if (genre && genre !== "All") {
      filter.genres = { $in: [new RegExp(`^${genre.trim()}$`, "i")] };
    }

    if (language && language !== "All") {
      filter.language = { $regex: `^${language.trim()}$`, $options: "i" };
    }

    if (featured === "true") {
      filter.featured = true;
    }

    const movies = await Movie.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (err) {
    next(err);
  }
}

export async function getMovieById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const movie = await Movie.findById(id);

    if (!movie) {
      res.status(404).json({
        success: false,
        message: `Movie with id ${id} not found`,
      });
      return;
    }

    res.json({
      success: true,
      data: movie,
    });
  } catch (err) {
    next(err);
  }
}

export async function createMovie(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const user = req.user as IUserDocument | undefined;
    const payload = req.body as Partial<IMovie>;

    if (!payload.title || !payload.description || !payload.posterUrl) {
      res.status(400).json({
        success: false,
        message: "Title, description, and poster URL are required",
      });
      return;
    }

    const movie = await Movie.create({
      title: payload.title.trim(),
      description: payload.description.trim(),
      posterUrl: payload.posterUrl.trim(),
      backdropUrl: payload.backdropUrl?.trim() || payload.posterUrl.trim(),
      genres:
        Array.isArray(payload.genres) && payload.genres.length > 0
          ? payload.genres
          : ["Action", "Drama"],
      language: payload.language?.trim() || "English",
      duration: Number(payload.duration) || 120,
      rating: Number(payload.rating) || 8.5,
      releaseDate: payload.releaseDate || new Date().toISOString().split("T")[0],
      theaters:
        Array.isArray(payload.theaters) && payload.theaters.length > 0
          ? payload.theaters
          : ["PVR INOX: Nexus Mall", "Cinepolis: Grand Plaza", "IMAX: Wave City Center"],
      showtimes:
        Array.isArray(payload.showtimes) && payload.showtimes.length > 0
          ? payload.showtimes
          : ["10:30 AM", "01:45 PM", "05:15 PM", "08:45 PM", "11:15 PM"],
      tierPricing: payload.tierPricing || {
        classic: 180,
        prime: 280,
        recliner: 450,
      },
      featured: Boolean(payload.featured),
      addedBy: user?._id,
    });

    res.status(201).json({
      success: true,
      message: "Movie created successfully",
      data: movie,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteMovie(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndDelete(id);

    if (!movie) {
      res.status(404).json({
        success: false,
        message: `Movie with id ${id} not found`,
      });
      return;
    }

    res.json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (err) {
    next(err);
  }
}
