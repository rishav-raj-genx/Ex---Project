import { useState } from "react";
import {
  Film,
  Search,
  MapPin,
  PlusCircle,
  Ticket,
  User as UserIcon,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCity: string;
  onCityChange: (city: string) => void;
  onOpenAddMovie: () => void;
  onOpenMyBookings: () => void;
}

const CITIES = [
  "Mumbai",
  "Delhi-NCR",
  "Bengaluru",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
];

export function Navbar({
  searchTerm,
  onSearchChange,
  selectedCity,
  onCityChange,
  onOpenAddMovie,
  onOpenMyBookings,
}: NavbarProps) {
  const { user, isAuthenticated, logout, openAuthModal } = useAuth();
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Brand Logo */}
        <div className="navbar-left">
          <div className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="logo-badge">
              <Film size={22} color="#ffffff" />
            </div>
            <div className="logo-text">
              <span className="logo-bms">book<span className="logo-my">my</span>show</span>
              <span className="logo-tag">PREMIERE</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="search-bar-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search for Movies, Events, Plays, Sports and Activities"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => onSearchChange("")}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Right Navigation */}
        <div className="navbar-right">
          {/* City Selector */}
          <div className="city-selector-relative">
            <button
              className="city-selector-btn"
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
            >
              <MapPin size={16} className="city-pin-icon" />
              <span>{selectedCity}</span>
              <ChevronDown size={14} />
            </button>

            {cityDropdownOpen && (
              <div className="city-dropdown-menu animate-slide-up">
                <div className="dropdown-header">Popular Cities</div>
                {CITIES.map((city) => (
                  <button
                    key={city}
                    className={`dropdown-item ${
                      selectedCity === city ? "active" : ""
                    }`}
                    onClick={() => {
                      onCityChange(city);
                      setCityDropdownOpen(false);
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Movie Action */}
          <button
            className="add-movie-btn"
            onClick={onOpenAddMovie}
            title="Add a new movie to catalog"
          >
            <PlusCircle size={16} />
            <span>Add Movie</span>
          </button>

          {/* My Bookings */}
          {isAuthenticated && (
            <button
              className="my-bookings-nav-btn"
              onClick={onOpenMyBookings}
              title="View my ticket bookings"
            >
              <Ticket size={16} />
              <span>My Tickets</span>
            </button>
          )}

          {/* Auth State */}
          {isAuthenticated && user ? (
            <div className="user-menu-relative">
              <button
                className="user-profile-btn"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              >
                <div className="user-avatar-badge">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="user-name-text">{user.name.split(" ")[0]}</span>
                <ChevronDown size={14} />
              </button>

              {userDropdownOpen && (
                <div className="user-dropdown-menu animate-slide-up">
                  <div className="user-info-card">
                    <p className="user-full-name">{user.name}</p>
                    <p className="user-email-text">{user.email}</p>
                    <span className="user-role-tag">{user.role}</span>
                  </div>
                  <div className="dropdown-divider" />
                  <button
                    className="dropdown-action-btn"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenMyBookings();
                    }}
                  >
                    <Ticket size={16} />
                    <span>My Bookings</span>
                  </button>
                  <button
                    className="dropdown-action-btn logout-action"
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              className="sign-in-btn"
              onClick={() => openAuthModal("login")}
            >
              <UserIcon size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
