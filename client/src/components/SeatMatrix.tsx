import { useState, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Info,
  Sparkles,
  Ticket,
  Lock,
  Loader2,
  Calendar,
  Clock,
  MapPin,
} from "lucide-react";
import type { Movie } from "../types/movie";
import type { Booking, SeatDetail, SeatTier } from "../types/booking";
import { bookingApi } from "../api/bookingApi";
import { useAuth } from "../context/AuthContext";
import confetti from "canvas-confetti";

interface SeatMatrixProps {
  movie: Movie;
  selectedDate: string;
  selectedTime: string;
  selectedTheater: string;
  onBack: () => void;
  onBookingSuccess: (booking: Booking) => void;
  showToast: (type: "success" | "error" | "info", message: string) => void;
}

interface RowConfig {
  row: string;
  tier: SeatTier;
  tierName: string;
  price: number;
}

export function SeatMatrix({
  movie,
  selectedDate,
  selectedTime,
  selectedTheater,
  onBack,
  onBookingSuccess,
  showToast,
}: SeatMatrixProps) {
  const { isAuthenticated, openAuthModal } = useAuth();

  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
  const [loadingOccupied, setLoadingOccupied] = useState<boolean>(true);
  const [selectedSeats, setSelectedSeats] = useState<SeatDetail[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Define cinema tier layout
  const rows: RowConfig[] = useMemo(
    () => [
      { row: "A", tier: "recliner", tierName: "VIP Recliner", price: movie.tierPricing.recliner },
      { row: "B", tier: "recliner", tierName: "VIP Recliner", price: movie.tierPricing.recliner },
      { row: "C", tier: "prime", tierName: "Prime Plus", price: movie.tierPricing.prime },
      { row: "D", tier: "prime", tierName: "Prime Plus", price: movie.tierPricing.prime },
      { row: "E", tier: "prime", tierName: "Prime Plus", price: movie.tierPricing.prime },
      { row: "F", tier: "prime", tierName: "Prime Plus", price: movie.tierPricing.prime },
      { row: "G", tier: "classic", tierName: "Classic Standard", price: movie.tierPricing.classic },
      { row: "H", tier: "classic", tierName: "Classic Standard", price: movie.tierPricing.classic },
      { row: "I", tier: "classic", tierName: "Classic Standard", price: movie.tierPricing.classic },
      { row: "J", tier: "classic", tierName: "Classic Standard", price: movie.tierPricing.classic },
    ],
    [movie]
  );

  // Seat distribution columns
  const leftCol = [1, 2, 3];
  const centerCol = [4, 5, 6, 7, 8, 9, 10, 11];
  const rightCol = [12, 13, 14];

  // Fetch occupied seats for this showtime from backend
  useEffect(() => {
    async function loadOccupied() {
      setLoadingOccupied(true);
      try {
        const booked = await bookingApi.getOccupiedSeats({
          movieId: movie._id,
          showDate: selectedDate,
          showtime: selectedTime,
          theater: selectedTheater,
        });
        setOccupiedSeats(booked);
      } catch {
        showToast("error", "Could not refresh occupied seats. Please try again.");
      } finally {
        setLoadingOccupied(false);
      }
    }

    void loadOccupied();
  }, [movie._id, selectedDate, selectedTime, selectedTheater, showToast]);

  const toggleSeat = (seatId: string, tier: SeatTier, price: number) => {
    if (occupiedSeats.includes(seatId)) return;

    setSelectedSeats((prev) => {
      const exists = prev.find((s) => s.seat === seatId);
      if (exists) {
        return prev.filter((s) => s.seat !== seatId);
      }

      if (prev.length >= 8) {
        showToast("info", "You can book a maximum of 8 tickets per transaction");
        return prev;
      }

      return [...prev, { seat: seatId, tier, price }];
    });
  };

  // Pricing calculations
  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const convenienceFee = selectedSeats.length > 0 ? selectedSeats.length * 30 : 0;
  const tax = Math.round(convenienceFee * 0.18 * 100) / 100;
  const totalAmount = Math.round((subtotal + convenienceFee + tax) * 100) / 100;

  const handleCheckout = async () => {
    if (selectedSeats.length === 0) {
      showToast("info", "Please select at least one seat to proceed");
      return;
    }

    if (!isAuthenticated) {
      showToast("info", "Please login with Passport.js to confirm your booking");
      openAuthModal("login");
      return;
    }

    setIsSubmitting(true);
    try {
      const booking = await bookingApi.createBooking({
        movieId: movie._id,
        showDate: selectedDate,
        showtime: selectedTime,
        theater: selectedTheater,
        seats: selectedSeats.map((s) => s.seat),
        seatDetails: selectedSeats,
      });

      // Launch celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#f84464", "#fbbf24", "#10b981", "#ffffff"],
        });
      } catch {
        // Ignore if confetti fails
      }

      showToast("success", `Ticket confirmed! Booking ID: ${booking.bookingId}`);
      onBookingSuccess(booking);
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (
              (err as { response?: { data?: { message?: string } } })
                .response?.data?.message ?? "Booking failed"
            )
          : "Could not complete booking. Please try again.";
      showToast("error", message);

      // Refresh occupied seats in case someone else booked them
      try {
        const refreshed = await bookingApi.getOccupiedSeats({
          movieId: movie._id,
          showDate: selectedDate,
          showtime: selectedTime,
          theater: selectedTheater,
        });
        setOccupiedSeats(refreshed);
      } catch {
        // ignore
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSeat = (rowConfig: RowConfig, num: number) => {
    const seatId = `${rowConfig.row}${num}`;
    const isOccupied = occupiedSeats.includes(seatId);
    const isSelected = selectedSeats.some((s) => s.seat === seatId);

    let className = "cinema-seat";
    if (isOccupied) className += " seat-occupied";
    else if (isSelected) className += " seat-selected";
    else className += ` seat-available tier-${rowConfig.tier}`;

    return (
      <button
        key={seatId}
        className={className}
        disabled={isOccupied || loadingOccupied}
        onClick={() => toggleSeat(seatId, rowConfig.tier, rowConfig.price)}
        title={
          isOccupied
            ? `Seat ${seatId} (Booked)`
            : `Seat ${seatId} - ${rowConfig.tierName} (₹${rowConfig.price})`
        }
      >
        <span className="seat-label">{num}</span>
      </button>
    );
  };

  return (
    <div className="seat-matrix-view animate-fade">
      {/* Header bar */}
      <div className="seat-header-bar">
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>

        <div className="seat-movie-summary">
          <h2 className="seat-view-title">{movie.title}</h2>
          <div className="seat-view-meta">
            <span>
              <MapPin size={13} /> {selectedTheater}
            </span>
            <span>•</span>
            <span>
              <Calendar size={13} /> {selectedDate}
            </span>
            <span>•</span>
            <span>
              <Clock size={13} /> {selectedTime}
            </span>
          </div>
        </div>

        <div className="seat-selection-badge">
          <Ticket size={16} />
          <span>{selectedSeats.length} Seats Selected</span>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="seat-layout-body">
        {/* Cinema Screen Projection */}
        <div className="cinema-screen-container">
          <div className="screen-arc-curve" />
          <div className="screen-glow-ambient" />
          <div className="screen-label">
            <span>ALL EYES THIS WAY • CINEMA SCREEN</span>
          </div>
        </div>

        {/* Legend */}
        <div className="seat-legend-row">
          <div className="legend-item">
            <span className="legend-box available-box" />
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="legend-box selected-box" />
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <span className="legend-box occupied-box" />
            <span>Sold / Occupied</span>
          </div>
        </div>

        {/* Loading Overlay */}
        {loadingOccupied && (
          <div className="seat-loading-indicator">
            <Loader2 className="spinner" size={24} />
            <span>Checking live seat availability...</span>
          </div>
        )}

        {/* Seating Grid */}
        <div className="seating-grid-container">
          {rows.map((rowConfig, idx) => {
            const isFirstOfTier =
              idx === 0 || rows[idx - 1]?.tier !== rowConfig.tier;

            return (
              <div key={rowConfig.row} className="seating-row-wrapper">
                {isFirstOfTier && (
                  <div className="tier-header-divider">
                    <span className="tier-badge-label">
                      {rowConfig.tierName} — ₹{rowConfig.price}
                    </span>
                  </div>
                )}

                <div className="seat-row">
                  {/* Row Letter */}
                  <span className="row-letter">{rowConfig.row}</span>

                  {/* Left Column */}
                  <div className="seat-group group-left">
                    {leftCol.map((num) => renderSeat(rowConfig, num))}
                  </div>

                  {/* Aisle */}
                  <div className="seat-aisle" />

                  {/* Center Column */}
                  <div className="seat-group group-center">
                    {centerCol.map((num) => renderSeat(rowConfig, num))}
                  </div>

                  {/* Aisle */}
                  <div className="seat-aisle" />

                  {/* Right Column */}
                  <div className="seat-group group-right">
                    {rightCol.map((num) => renderSeat(rowConfig, num))}
                  </div>

                  {/* Row Letter Right */}
                  <span className="row-letter">{rowConfig.row}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Checkout Footer */}
      <div className="seat-checkout-footer glass-panel animate-slide-up">
        <div className="checkout-content">
          {/* Selected Seats Chips */}
          <div className="checkout-left">
            {selectedSeats.length > 0 ? (
              <div className="selected-chips-container">
                <span className="chips-label">Seats:</span>
                <div className="chips-list">
                  {selectedSeats.map((s) => (
                    <span key={s.seat} className="seat-chip">
                      {s.seat} ({s.tier.toUpperCase()})
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="no-seats-selected-msg">
                <Info size={16} />
                <span>Select seats above to view price breakdown and confirm</span>
              </div>
            )}
          </div>

          {/* Price Breakdown and CTA */}
          <div className="checkout-right">
            {selectedSeats.length > 0 && (
              <div className="price-summary-box">
                <div className="price-breakdown-row">
                  <span className="label">Tickets ({selectedSeats.length}):</span>
                  <span className="val">₹{subtotal}</span>
                </div>
                <div className="price-breakdown-row">
                  <span className="label">Convenience Fee + GST:</span>
                  <span className="val">₹{(convenienceFee + tax).toFixed(2)}</span>
                </div>
                <div className="total-amount-row">
                  <span className="total-label">Total Amount:</span>
                  <span className="total-val">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            <button
              className="pay-confirm-btn"
              disabled={selectedSeats.length === 0 || isSubmitting}
              onClick={handleCheckout}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="spinner" size={18} />
                  <span>Reserving Seats...</span>
                </>
              ) : !isAuthenticated ? (
                <>
                  <Lock size={18} />
                  <span>Login & Pay ₹{totalAmount > 0 ? totalAmount : 0}</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Book {selectedSeats.length} Ticket{selectedSeats.length > 1 ? "s" : ""} • ₹{totalAmount}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
