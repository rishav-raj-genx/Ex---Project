import { Star, Clock, Ticket } from "lucide-react";
import type { Movie } from "../types/movie";

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
}

export function MovieCard({ movie, onSelect }: MovieCardProps) {
  return (
    <div className="movie-card" onClick={() => onSelect(movie)}>
      {/* Poster Container */}
      <div className="poster-container">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="poster-image"
          loading="lazy"
          onError={(e) => {
            // Fallback poster image if network fails
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80";
          }}
        />

        {/* Rating Ribbon */}
        <div className="poster-rating-badge">
          <Star size={13} fill="#fbbf24" color="#fbbf24" />
          <span>{movie.rating.toFixed(1)}/10</span>
        </div>

        {/* Language Pill */}
        <div className="poster-lang-badge">{movie.language}</div>

        {/* Hover Quick Action */}
        <div className="poster-hover-overlay">
          <button className="card-quick-book-btn">
            <Ticket size={16} />
            <span>Book Tickets</span>
          </button>
        </div>
      </div>

      {/* Movie Details */}
      <div className="card-info">
        <h3 className="card-title" title={movie.title}>
          {movie.title}
        </h3>

        <div className="card-genres">
          {movie.genres.slice(0, 2).join(" / ")}
        </div>

        <div className="card-footer-meta">
          <span className="card-duration">
            <Clock size={12} />
            {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
          </span>
          <span className="card-price-start">
            From ₹{movie.tierPricing?.classic || 180}
          </span>
        </div>
      </div>
    </div>
  );
}
