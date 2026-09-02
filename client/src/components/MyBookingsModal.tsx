import { useState, useEffect } from "react";
import {
  X,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Loader2,
  ChevronRight,
  Film,
} from "lucide-react";
import type { Booking } from "../types/booking";
import { bookingApi } from "../api/bookingApi";

interface MyBookingsModalProps {
  onClose: () => void;
  onSelectBookingPass: (booking: Booking) => void;
  onExploreMovies: () => void;
}

export function MyBookingsModal({
  onClose,
  onSelectBookingPass,
  onExploreMovies,
}: MyBookingsModalProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await bookingApi.getMyBookings();
        setBookings(data);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }
    void loadBookings();
  }, []);

  return (
    <div className="modal-backdrop animate-fade" onClick={onClose}>
      <div
        className="my-bookings-modal glass-panel animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-top-bar">
          <div className="modal-header-title">
            <Ticket size={22} color="#f84464" />
            <h3>My Bookings & Passes</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="bookings-list-content">
          {loading ? (
            <div className="bookings-loading">
              <Loader2 className="spinner" size={28} />
              <span>Loading your tickets...</span>
            </div>
          ) : bookings.length === 0 ? (
            <div className="no-bookings-box">
              <div className="empty-ticket-circle">
                <Ticket size={36} color="#f84464" />
              </div>
              <h4>No Tickets Booked Yet</h4>
              <p>
                You haven't booked any movie tickets yet. Browse trending blockbusters and pick your favorite seats!
              </p>
              <button
                className="explore-now-btn"
                onClick={() => {
                  onClose();
                  onExploreMovies();
                }}
              >
                <Film size={16} />
                <span>Explore Movies</span>
              </button>
            </div>
          ) : (
            <div className="bookings-grid">
              {bookings.map((b) => (
                <div key={b._id} className="user-booking-card">
                  <div className="booking-card-left">
                    <img
                      src={b.moviePoster}
                      alt={b.movieTitle}
                      className="booking-thumb"
                    />
                  </div>

                  <div className="booking-card-mid">
                    <div className="booking-id-tag">ID: {b.bookingId}</div>
                    <h4 className="booking-movie-title">{b.movieTitle}</h4>
                    <div className="booking-meta-line">
                      <MapPin size={13} />
                      <span>{b.theater}</span>
                    </div>
                    <div className="booking-meta-line">
                      <Calendar size={13} />
                      <span>{b.showDate}</span>
                      <span>•</span>
                      <Clock size={13} />
                      <span>{b.showtime}</span>
                    </div>
                    <div className="booking-seats-badge">
                      Seats: <strong>{b.seats.join(", ")}</strong>
                    </div>
                  </div>

                  <div className="booking-card-right">
                    <div className="booking-price-tag">₹{b.totalAmount.toFixed(2)}</div>
                    <button
                      className="view-pass-btn"
                      onClick={() => onSelectBookingPass(b)}
                    >
                      <span>View Pass</span>
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
