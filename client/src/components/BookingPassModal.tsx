import { X, CheckCircle2, Ticket, Printer, MapPin, Calendar, Clock, Share2 } from "lucide-react";
import type { Booking } from "../types/booking";

interface BookingPassModalProps {
  booking: Booking;
  onClose: () => void;
}

export function BookingPassModal({ booking, onClose }: BookingPassModalProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-backdrop animate-fade" onClick={onClose}>
      <div
        className="booking-pass-modal glass-panel animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button className="modal-close-btn" onClick={onClose}>
          <X size={20} />
        </button>

        {/* Success confirmation badge */}
        <div className="pass-success-banner">
          <div className="success-icon-ring">
            <CheckCircle2 size={32} color="#10b981" />
          </div>
          <h3 className="success-title">Booking Confirmed!</h3>
          <p className="success-sub">Your M-Ticket has been generated</p>
        </div>

        {/* Digital Ticket Pass */}
        <div className="digital-ticket-container" id="printable-ticket">
          {/* Top Ticket Section */}
          <div className="ticket-top-section">
            <div className="ticket-movie-details">
              <span className="ticket-cinema-badge">M-TICKET • CINEMA PASS</span>
              <h4 className="ticket-movie-title">{booking.movieTitle}</h4>
              <div className="ticket-cinema-location">
                <MapPin size={14} />
                <span>{booking.theater}</span>
              </div>
            </div>
            <img
              src={booking.moviePoster}
              alt={booking.movieTitle}
              className="ticket-poster-thumb"
            />
          </div>

          {/* Perforated Fold Line */}
          <div className="ticket-perforation">
            <div className="notch notch-left" />
            <div className="perforated-dash-line" />
            <div className="notch notch-right" />
          </div>

          {/* Bottom Ticket Section */}
          <div className="ticket-bottom-section">
            <div className="ticket-grid-meta">
              <div className="meta-box">
                <span className="meta-lbl">DATE</span>
                <span className="meta-val">
                  <Calendar size={13} /> {booking.showDate}
                </span>
              </div>
              <div className="meta-box">
                <span className="meta-lbl">TIME</span>
                <span className="meta-val">
                  <Clock size={13} /> {booking.showtime}
                </span>
              </div>
              <div className="meta-box">
                <span className="meta-lbl">SEATS ({booking.seats.length})</span>
                <span className="meta-val seats-highlight">
                  {booking.seats.join(", ")}
                </span>
              </div>
              <div className="meta-box">
                <span className="meta-lbl">BOOKING ID</span>
                <span className="meta-val booking-id-code">
                  {booking.bookingId}
                </span>
              </div>
            </div>

            {/* Price & Barcode */}
            <div className="ticket-barcode-row">
              <div className="barcode-visual">
                <div className="mock-barcode-lines" />
                <span className="barcode-number">{booking.bookingId}</span>
              </div>
              <div className="ticket-total-paid">
                <span className="paid-label">TOTAL PAID</span>
                <span className="paid-val">₹{booking.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pass Actions */}
        <div className="pass-actions-footer">
          <button className="pass-btn-print" onClick={handlePrint}>
            <Printer size={16} />
            <span>Print Ticket</span>
          </button>
          <button className="pass-btn-done" onClick={onClose}>
            <Ticket size={16} />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}
