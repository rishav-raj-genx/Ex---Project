import { useState } from "react";
import {
  X,
  Star,
  Clock,
  Calendar,
  MapPin,
  Sparkles,
  Ticket,
  ChevronRight,
} from "lucide-react";
import type { Movie } from "../types/movie";

interface MovieDetailModalProps {
  movie: Movie;
  onClose: () => void;
  onProceedToSeatSelection: (payload: {
    movie: Movie;
    selectedDate: string;
    selectedTime: string;
    selectedTheater: string;
  }) => void;
}

export function MovieDetailModal({
  movie,
  onClose,
  onProceedToSeatSelection,
}: MovieDetailModalProps) {
  // Generate next 4 dates starting from today
  const dates = Array.from({ length: 4 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0]!;
    const dayName = i === 0 ? "TODAY" : i === 1 ? "TOM" : d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
    const dayNum = d.getDate();
    const month = d.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    return { dateStr, dayName, dayNum, month };
  });

  const [selectedDate, setSelectedDate] = useState<string>(dates[0]!.dateStr);
  const [selectedTheater, setSelectedTheater] = useState<string>(
    movie.theaters[0] || "PVR INOX: Nexus Mall"
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    movie.showtimes[0] || "05:15 PM"
  );

  return (
    <div className="modal-backdrop animate-fade" onClick={onClose}>
      <div
        className="movie-detail-modal glass-panel animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Modal Banner Backdrop */}
        <div
          className="modal-movie-backdrop"
          style={{
            backgroundImage: `url(${movie.backdropUrl || movie.posterUrl})`,
          }}
        >
          <div className="backdrop-gradient-mask" />
          <div className="modal-movie-header-info">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="modal-movie-poster"
            />
            <div className="modal-movie-titles">
              <div className="modal-pill-row">
                <span className="modal-rating-pill">
                  <Star size={14} fill="#fbbf24" color="#fbbf24" />
                  {movie.rating.toFixed(1)}/10
                </span>
                <span className="modal-lang-pill">{movie.language}</span>
                <span className="modal-duration-pill">
                  <Clock size={13} />
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
              </div>
              <h2 className="modal-title">{movie.title}</h2>
              <div className="modal-genres-list">
                {movie.genres.map((g) => (
                  <span key={g} className="modal-genre-tag">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="modal-body-content">
          {/* About Movie */}
          <div className="modal-section">
            <h4 className="section-label">About the Movie</h4>
            <p className="modal-synopsis">{movie.description}</p>
          </div>

          {/* Date Picker Bar */}
          <div className="modal-section">
            <div className="section-header-row">
              <h4 className="section-label">
                <Calendar size={16} /> Select Date
              </h4>
            </div>
            <div className="date-picker-row">
              {dates.map((d) => (
                <button
                  key={d.dateStr}
                  className={`date-card-btn ${
                    selectedDate === d.dateStr ? "active" : ""
                  }`}
                  onClick={() => setSelectedDate(d.dateStr)}
                >
                  <span className="date-day-name">{d.dayName}</span>
                  <span className="date-day-number">{d.dayNum}</span>
                  <span className="date-month-name">{d.month}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Theaters & Showtimes */}
          <div className="modal-section">
            <h4 className="section-label">
              <MapPin size={16} /> Theaters & Showtimes
            </h4>
            <div className="theaters-list">
              {movie.theaters.map((theater) => (
                <div
                  key={theater}
                  className={`theater-card ${
                    selectedTheater === theater ? "selected-theater" : ""
                  }`}
                  onClick={() => setSelectedTheater(theater)}
                >
                  <div className="theater-header">
                    <span className="theater-name">{theater}</span>
                    <span className="theater-m-ticket-badge">
                      <Sparkles size={12} /> M-Ticket Available
                    </span>
                  </div>

                  <div className="showtimes-grid">
                    {movie.showtimes.map((time) => {
                      const isSelected =
                        selectedTheater === theater && selectedTime === time;
                      return (
                        <button
                          key={time}
                          className={`showtime-pill ${
                            isSelected ? "active" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTheater(theater);
                            setSelectedTime(time);
                          }}
                        >
                          <span className="time-text">{time}</span>
                          <span className="tier-tag">DOLBY 7.1</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Tiers Preview */}
          <div className="pricing-info-bar">
            <div className="price-item">
              <span className="tier-name">Classic</span>
              <span className="tier-val">₹{movie.tierPricing?.classic || 180}</span>
            </div>
            <div className="price-item">
              <span className="tier-name">Prime Plus</span>
              <span className="tier-val">₹{movie.tierPricing?.prime || 280}</span>
            </div>
            <div className="price-item">
              <span className="tier-name">VIP Recliner</span>
              <span className="tier-val">₹{movie.tierPricing?.recliner || 450}</span>
            </div>
          </div>

          {/* Proceed to Seat Selection CTA */}
          <div className="modal-footer-cta">
            <div className="selected-summary-preview">
              <span className="summary-date-time">
                {selectedDate} • {selectedTime}
              </span>
              <span className="summary-theater-text">{selectedTheater}</span>
            </div>

            <button
              className="proceed-seats-btn"
              onClick={() => {
                onProceedToSeatSelection({
                  movie,
                  selectedDate,
                  selectedTime,
                  selectedTheater,
                });
              }}
            >
              <span>Select Seats</span>
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
