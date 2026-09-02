export interface TierPricing {
  classic: number;
  prime: number;
  recliner: number;
}

export interface Movie {
  _id: string;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl?: string;
  genres: string[];
  language: string;
  duration: number; // in minutes
  rating: number;
  releaseDate: string;
  theaters: string[];
  showtimes: string[];
  tierPricing: TierPricing;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateMoviePayload {
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl?: string;
  genres: string[];
  language: string;
  duration: number;
  rating: number;
  releaseDate: string;
  theaters: string[];
  showtimes: string[];
  tierPricing: TierPricing;
  featured?: boolean;
}

export interface MovieFilterParams {
  search?: string;
  genre?: string;
  language?: string;
  featured?: boolean;
}
