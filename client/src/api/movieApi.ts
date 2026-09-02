import apiClient from "./client";
import type { Movie, CreateMoviePayload, MovieFilterParams } from "../types/movie";

export const movieApi = {
  async getMovies(params?: MovieFilterParams): Promise<Movie[]> {
    const res = await apiClient.get<{ success: boolean; data: Movie[] }>("/movies", {
      params,
    });
    return res.data.data;
  },

  async getMovieById(id: string): Promise<Movie> {
    const res = await apiClient.get<{ success: boolean; data: Movie }>(`/movies/${id}`);
    return res.data.data;
  },

  async createMovie(payload: CreateMoviePayload): Promise<Movie> {
    const res = await apiClient.post<{ success: boolean; data: Movie }>("/movies", payload);
    return res.data.data;
  },

  async deleteMovie(id: string): Promise<void> {
    await apiClient.delete(`/movies/${id}`);
  },
};
