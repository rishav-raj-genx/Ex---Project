import { useState, useEffect } from "react";
import { Star, Clock, Ticket, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import type { Movie } from "../types/movie";

interface HeroBannerProps {
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
}

export function HeroBanner({ movies, onSelectMovie }: HeroBannerProps) {
  const featuredMovies = movies.length > 0 ? movies.slice(0, 4) : [];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  if (featuredMovies.length === 0) return null;

  const currentMovie = featuredMovies[currentIndex];
  if (!currentMovie) return null;

  return (
    <div className="hero-banner-container">
      {/* Background Backdrop with Gradient Fades */}
      <div
        className="hero-backdrop"
        style={{
          backgroundImage: `url(${currentMovie.backdropUrl || currentMovie.posterUrl})`,
        }}
      >
        <div className="hero-overlay-gradient" />
      </div>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-badge-row">
          <span className="hero-premiere-pill">
            <Sparkles size={14} /> NOW SHOWING IN CINEMAS
          </span>
          <span className="hero-lang-pill">{currentMovie.language}</span>
        </div>

        <h1 className="hero-title">{currentMovie.title}</h1>

        <div className="hero-meta-row">
          <div className="hero-rating-badge">
            <Star size={16} fill="#fbbf24" color="#fbbf24" />
            <span className="rating-score">{currentMovie.rating.toFixed(1)}/10</span>
            <span className="rating-votes">(50K+ Votes)</span>
          </div>

          <div className="hero-meta-divider" />

          <div className="hero-duration">
            <Clock size={16} />
            <span>
              {Math.floor(currentMovie.duration / 60)}h {currentMovie.duration % 60}m
            </span>
          </div>

          <div className="hero-meta-divider" />

          <div className="hero-genres-list">
            {currentMovie.genres.map((g) => (
              <span key={g} className="hero-genre-tag">
                {g}
              </span>
            ))}
          </div>
        </div>

        <p className="hero-description">{currentMovie.description}</p>

        <div className="hero-actions-row">
          <button
            className="hero-book-btn"
            onClick={() => onSelectMovie(currentMovie)}
          >
            <Ticket size={20} />
            <span>Book Tickets</span>
          </button>
        </div>
      </div>

      {/* Slide Controls */}
      {featuredMovies.length > 1 && (
        <>
          <button
            className="hero-slider-nav hero-prev-btn"
            onClick={() =>
              setCurrentIndex(
                (prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length
              )
            }
          >
            <ChevronLeft size={24} />
          </button>
          <button
            className="hero-slider-nav hero-next-btn"
            onClick={() =>
              setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)
            }
          >
            <ChevronRight size={24} />
          </button>

          <div className="hero-indicators">
            {featuredMovies.map((m, idx) => (
              <button
                key={m._id}
                className={`hero-dot ${idx === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(idx)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
