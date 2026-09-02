import { Film, PlusCircle, RefreshCw } from "lucide-react";
import { MovieCard } from "./MovieCard";
import type { Movie } from "../types/movie";

interface MovieGridProps {
  movies: Movie[];
  loading: boolean;
  onSelectMovie: (movie: Movie) => void;
  onOpenAddMovie: () => void;
  onResetFilter: () => void;
}

export function MovieGrid({
  movies,
  loading,
  onSelectMovie,
  onOpenAddMovie,
  onResetFilter,
}: MovieGridProps) {
  if (loading) {
    return (
      <div className="movie-grid-container">
        <div className="movie-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="movie-card-skeleton">
              <div className="skeleton-poster" />
              <div className="skeleton-line title" />
              <div className="skeleton-line genre" />
              <div className="skeleton-line meta" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="empty-movies-card glass-panel animate-fade">
        <div className="empty-icon-circle">
          <Film size={36} color="#f84464" />
        </div>
        <h3 className="empty-title">No Movies Found</h3>
        <p className="empty-desc">
          We couldn't find any movies matching your current search or filter criteria.
        </p>
        <div className="empty-actions">
          <button className="empty-action-secondary" onClick={onResetFilter}>
            <RefreshCw size={15} />
            <span>Reset Filters</span>
          </button>
          <button className="empty-action-primary" onClick={onOpenAddMovie}>
            <PlusCircle size={15} />
            <span>Add New Movie</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-grid-container">
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard
            key={movie._id}
            movie={movie}
            onSelect={onSelectMovie}
          />
        ))}
      </div>
    </div>
  );
}
