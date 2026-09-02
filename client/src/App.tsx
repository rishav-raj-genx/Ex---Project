import { useState, useEffect, useCallback, useMemo } from "react";
import { Navbar } from "./components/Navbar";
import { HeroBanner } from "./components/HeroBanner";
import { GenreFilter } from "./components/GenreFilter";
import { MovieGrid } from "./components/MovieGrid";
import { MovieDetailModal } from "./components/MovieDetailModal";
import { SeatMatrix } from "./components/SeatMatrix";
import { AddMovieModal } from "./components/AddMovieModal";
import { AuthModal } from "./components/AuthModal";
import { BookingPassModal } from "./components/BookingPassModal";
import { MyBookingsModal } from "./components/MyBookingsModal";
import { ToastContainer, type ToastMessage } from "./components/Toast";
import { movieApi } from "./api/movieApi";
import type { Movie } from "./types/movie";
import type { Booking } from "./types/booking";

interface SeatSelectionTarget {
  movie: Movie;
  selectedDate: string;
  selectedTime: string;
  selectedTheater: string;
}

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [selectedCity, setSelectedCity] = useState<string>("Mumbai");

  // Modals & Navigation state
  const [activeMovieDetail, setActiveMovieDetail] = useState<Movie | null>(null);
  const [seatTarget, setSeatTarget] = useState<SeatSelectionTarget | null>(null);
  const [addMovieModalOpen, setAddMovieModalOpen] = useState<boolean>(false);
  const [myBookingsOpen, setMyBookingsOpen] = useState<boolean>(false);
  const [confirmedBookingPass, setConfirmedBookingPass] = useState<Booking | null>(null);

  // Toast feedback
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback(
    (type: "success" | "error" | "info", text: string) => {
      const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
      setToasts((prev) => [...prev, { id, type, text }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch movies from API
  const loadMovies = useCallback(async () => {
    setLoading(true);
    try {
      const data = await movieApi.getMovies();
      setMovies(data);
    } catch {
      showToast("error", "Could not connect to backend. Please ensure server is running.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void loadMovies();
  }, [loadMovies]);

  // Client-side filtering for fast responsive typing & genre toggles
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch =
        searchTerm.trim() === "" ||
        movie.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        movie.genres.some((g) =>
          g.toLowerCase().includes(searchTerm.toLowerCase().trim())
        );

      const matchesGenre =
        selectedGenre === "All" ||
        movie.genres.some(
          (g) => g.toLowerCase() === selectedGenre.toLowerCase()
        );

      const matchesLang =
        selectedLanguage === "All" ||
        movie.language.toLowerCase() === selectedLanguage.toLowerCase();

      return matchesSearch && matchesGenre && matchesLang;
    });
  }, [movies, searchTerm, selectedGenre, selectedLanguage]);

  const handleMovieCreated = (newMovie: Movie) => {
    setMovies((prev) => [newMovie, ...prev]);
  };

  const handleSeatBookingSuccess = (booking: Booking) => {
    setSeatTarget(null);
    setConfirmedBookingPass(booking);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedGenre("All");
    setSelectedLanguage("All");
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCity={selectedCity}
        onCityChange={setSelectedCity}
        onOpenAddMovie={() => setAddMovieModalOpen(true)}
        onOpenMyBookings={() => setMyBookingsOpen(true)}
      />

      <main className="main-content">
        {/* If user is in Seat Selection mode */}
        {seatTarget ? (
          <SeatMatrix
            movie={seatTarget.movie}
            selectedDate={seatTarget.selectedDate}
            selectedTime={seatTarget.selectedTime}
            selectedTheater={seatTarget.selectedTheater}
            onBack={() => setSeatTarget(null)}
            onBookingSuccess={handleSeatBookingSuccess}
            showToast={showToast}
          />
        ) : (
          <>
            {/* Cinematic Hero Carousel */}
            {!searchTerm && selectedGenre === "All" && (
              <HeroBanner
                movies={movies}
                onSelectMovie={(movie) => setActiveMovieDetail(movie)}
              />
            )}

            {/* Genre & Language Filter Bar */}
            <GenreFilter
              selectedGenre={selectedGenre}
              onGenreChange={setSelectedGenre}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              totalCount={filteredMovies.length}
            />

            {/* Movie Catalog Grid */}
            <MovieGrid
              movies={filteredMovies}
              loading={loading}
              onSelectMovie={(movie) => setActiveMovieDetail(movie)}
              onOpenAddMovie={() => setAddMovieModalOpen(true)}
              onResetFilter={resetFilters}
            />
          </>
        )}
      </main>

      {/* Movie Details Modal */}
      {activeMovieDetail && (
        <MovieDetailModal
          movie={activeMovieDetail}
          onClose={() => setActiveMovieDetail(null)}
          onProceedToSeatSelection={(target) => {
            setActiveMovieDetail(null);
            setSeatTarget(target);
          }}
        />
      )}

      {/* Add Movie Modal */}
      {addMovieModalOpen && (
        <AddMovieModal
          onClose={() => setAddMovieModalOpen(false)}
          onMovieCreated={handleMovieCreated}
          showToast={showToast}
        />
      )}

      {/* Passport.js Auth Modal */}
      <AuthModal showToast={showToast} />

      {/* Confirmed Ticket Pass Modal */}
      {confirmedBookingPass && (
        <BookingPassModal
          booking={confirmedBookingPass}
          onClose={() => setConfirmedBookingPass(null)}
        />
      )}

      {/* User Bookings History Modal */}
      {myBookingsOpen && (
        <MyBookingsModal
          onClose={() => setMyBookingsOpen(false)}
          onSelectBookingPass={(booking) => {
            setMyBookingsOpen(false);
            setConfirmedBookingPass(booking);
          }}
          onExploreMovies={() => {
            setMyBookingsOpen(false);
            setSeatTarget(null);
          }}
        />
      )}

      {/* Toast Notification Layer */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
