import { useState } from "react";
import {
  X,
  PlusCircle,
  Sparkles,
  Film,
  Clock,
  Star,
  Loader2,
  Lock,
} from "lucide-react";
import type { CreateMoviePayload, Movie } from "../types/movie";
import { movieApi } from "../api/movieApi";
import { useAuth } from "../context/AuthContext";

interface AddMovieModalProps {
  onClose: () => void;
  onMovieCreated: (movie: Movie) => void;
  showToast: (type: "success" | "error" | "info", message: string) => void;
}

const SAMPLE_TEMPLATES: Array<{ name: string; data: CreateMoviePayload }> = [
  {
    name: "Deadpool & Wolverine",
    data: {
      title: "Deadpool & Wolverine",
      description:
        "Wolverine is recovering from his injuries when he crosses paths with the loudmouth, Deadpool. They team up to defeat a common enemy.",
      posterUrl:
        "https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?w=800&auto=format&fit=crop&q=80",
      backdropUrl:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80",
      genres: ["Action", "Comedy", "Sci-Fi"],
      language: "English",
      duration: 128,
      rating: 8.8,
      releaseDate: "2026-07-26",
      theaters: [
        "PVR INOX: Nexus Mall",
        "Cinepolis: Grand Plaza",
        "IMAX: Wave City Center",
      ],
      showtimes: ["10:30 AM", "01:45 PM", "05:15 PM", "08:45 PM", "11:15 PM"],
      tierPricing: { classic: 200, prime: 320, recliner: 500 },
      featured: true,
    },
  },
  {
    name: "Avatar: Fire and Ash",
    data: {
      title: "Avatar: Fire and Ash",
      description:
        "Jake Sully and Neytiri encounter a new, aggressive volcanic clan of Na'vi known as the Ash People on the moon Pandora.",
      posterUrl:
        "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
      backdropUrl:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80",
      genres: ["Sci-Fi", "Adventure", "Action"],
      language: "English",
      duration: 190,
      rating: 9.0,
      releaseDate: "2026-12-18",
      theaters: ["PVR INOX: IMAX 3D", "Cinepolis: VIP Lounge"],
      showtimes: ["11:00 AM", "03:15 PM", "07:30 PM", "11:00 PM"],
      tierPricing: { classic: 220, prime: 350, recliner: 550 },
      featured: true,
    },
  },
  {
    name: "Gladiator II",
    data: {
      title: "Gladiator II",
      description:
        "Years after witnessing the death of the revered hero Maximus, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors.",
      posterUrl:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=80",
      backdropUrl:
        "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=1600&auto=format&fit=crop&q=80",
      genres: ["Action", "Drama", "History"],
      language: "English",
      duration: 148,
      rating: 8.6,
      releaseDate: "2026-11-22",
      theaters: ["PVR INOX: Nexus Mall", "Wave Cinemas: Atmos"],
      showtimes: ["12:15 PM", "04:00 PM", "07:45 PM", "10:50 PM"],
      tierPricing: { classic: 190, prime: 300, recliner: 480 },
      featured: false,
    },
  },
];

const AVAILABLE_GENRES = [
  "Action",
  "Sci-Fi",
  "Adventure",
  "Drama",
  "Thriller",
  "Comedy",
  "Animation",
  "Horror",
  "Romance",
  "Mystery",
];

export function AddMovieModal({
  onClose,
  onMovieCreated,
  showToast,
}: AddMovieModalProps) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [formData, setFormData] = useState<CreateMoviePayload>({
    title: "",
    description: "",
    posterUrl: "",
    backdropUrl: "",
    genres: ["Action"],
    language: "English",
    duration: 120,
    rating: 8.5,
    releaseDate: new Date().toISOString().split("T")[0]!,
    theaters: ["PVR INOX: Nexus Mall", "Cinepolis: Grand Plaza"],
    showtimes: ["10:30 AM", "01:45 PM", "05:15 PM", "08:45 PM"],
    tierPricing: { classic: 180, prime: 280, recliner: 450 },
    featured: false,
  });

  const [loading, setLoading] = useState(false);

  const applyTemplate = (template: CreateMoviePayload) => {
    setFormData({ ...template });
    showToast("info", `Applied template: ${template.title}`);
  };

  const toggleGenre = (genre: string) => {
    setFormData((prev) => {
      const exists = prev.genres.includes(genre);
      if (exists) {
        if (prev.genres.length === 1) return prev; // keep at least 1
        return { ...prev, genres: prev.genres.filter((g) => g !== genre) };
      }
      return { ...prev, genres: [...prev.genres, genre] };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      showToast("error", "You must be logged in to add a movie");
      openAuthModal("login");
      return;
    }

    if (!formData.title.trim()) {
      showToast("error", "Movie title is required");
      return;
    }
    if (!formData.description.trim()) {
      showToast("error", "Movie description is required");
      return;
    }
    if (!formData.posterUrl.trim()) {
      showToast("error", "Poster image URL is required");
      return;
    }

    setLoading(true);
    try {
      const createdMovie = await movieApi.createMovie(formData);
      showToast("success", `"${createdMovie.title}" added to BookMyShow!`);
      onMovieCreated(createdMovie);
      onClose();
    } catch (err: unknown) {
      const message =
        err && typeof err === "object" && "response" in err
          ? (
              (err as { response?: { data?: { message?: string } } })
                .response?.data?.message ?? "Failed to create movie"
            )
          : "Network error creating movie";
      showToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop animate-fade" onClick={onClose}>
      <div
        className="add-movie-modal glass-panel animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-top-bar">
          <div className="modal-header-title">
            <Film size={22} color="#f84464" />
            <h3>Add New Movie to Catalog</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Auth prompt if unauthenticated */}
        {!isAuthenticated && (
          <div className="auth-warning-banner">
            <Lock size={16} />
            <span>
              Authentication required. You will be asked to login with Passport.js before publishing.
            </span>
          </div>
        )}

        {/* Quick Fill Templates */}
        <div className="sample-templates-bar">
          <span className="templates-label">
            <Sparkles size={14} color="#fbbf24" /> Quick Fill Templates:
          </span>
          <div className="templates-list">
            {SAMPLE_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.name}
                type="button"
                className="template-chip-btn"
                onClick={() => applyTemplate(tmpl.data)}
              >
                {tmpl.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="add-movie-form">
          <div className="form-grid-layout">
            {/* Left Fields */}
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">Movie Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inception: The Awakening"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="form-input"
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Language *</label>
                  <select
                    value={formData.language}
                    onChange={(e) =>
                      setFormData({ ...formData, language: e.target.value })
                    }
                    className="form-input"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Telugu">Telugu</option>
                    <option value="Tamil">Tamil</option>
                    <option value="Malayalam">Malayalam</option>
                    <option value="Kannada">Kannada</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Rating (0 - 10) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        rating: parseFloat(e.target.value) || 8.0,
                      })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-label">Duration (Minutes) *</label>
                  <input
                    type="number"
                    min="30"
                    max="360"
                    required
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: parseInt(e.target.value, 10) || 120,
                      })
                    }
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Release Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.releaseDate}
                    onChange={(e) =>
                      setFormData({ ...formData, releaseDate: e.target.value })
                    }
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Genres (Select Multiple) *</label>
                <div className="genre-toggle-chips">
                  {AVAILABLE_GENRES.map((g) => {
                    const active = formData.genres.includes(g);
                    return (
                      <button
                        type="button"
                        key={g}
                        className={`genre-toggle-chip ${active ? "active" : ""}`}
                        onClick={() => toggleGenre(g)}
                      >
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description / Synopsis *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Enter a brief plot synopsis..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="form-textarea"
                />
              </div>
            </div>

            {/* Right Fields & Preview */}
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">Poster Image URL *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.posterUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, posterUrl: e.target.value })
                  }
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Backdrop Banner URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.backdropUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, backdropUrl: e.target.value })
                  }
                  className="form-input"
                />
              </div>

              {/* Pricing Tiers */}
              <div className="form-group">
                <label className="form-label">Seat Tier Pricing (₹ INR)</label>
                <div className="pricing-inputs-grid">
                  <div>
                    <span className="sub-label">Classic</span>
                    <input
                      type="number"
                      value={formData.tierPricing.classic}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tierPricing: {
                            ...formData.tierPricing,
                            classic: parseInt(e.target.value, 10) || 180,
                          },
                        })
                      }
                      className="form-input"
                    />
                  </div>
                  <div>
                    <span className="sub-label">Prime Plus</span>
                    <input
                      type="number"
                      value={formData.tierPricing.prime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tierPricing: {
                            ...formData.tierPricing,
                            prime: parseInt(e.target.value, 10) || 280,
                          },
                        })
                      }
                      className="form-input"
                    />
                  </div>
                  <div>
                    <span className="sub-label">VIP Recliner</span>
                    <input
                      type="number"
                      value={formData.tierPricing.recliner}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tierPricing: {
                            ...formData.tierPricing,
                            recliner: parseInt(e.target.value, 10) || 450,
                          },
                        })
                      }
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Live Preview Card */}
              <div className="form-group">
                <label className="form-label">Live Card Preview</label>
                <div className="movie-preview-box">
                  <div className="preview-poster">
                    {formData.posterUrl ? (
                      <img
                        src={formData.posterUrl}
                        alt="Preview"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80";
                        }}
                      />
                    ) : (
                      <div className="poster-placeholder">
                        <Film size={28} />
                      </div>
                    )}
                  </div>
                  <div className="preview-details">
                    <h5 className="preview-title">
                      {formData.title || "Movie Title"}
                    </h5>
                    <div className="preview-meta">
                      <span className="preview-rating">
                        <Star size={12} fill="#fbbf24" color="#fbbf24" />
                        {formData.rating.toFixed(1)}
                      </span>
                      <span>•</span>
                      <span>{formData.language}</span>
                      <span>•</span>
                      <span>
                        <Clock size={11} /> {formData.duration}m
                      </span>
                    </div>
                    <div className="preview-genres">
                      {formData.genres.join(" / ")}
                    </div>
                    <div className="preview-price">
                      Classic: ₹{formData.tierPricing.classic}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="modal-bottom-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit-movie"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="spinner" size={18} />
                  <span>Saving Movie...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={18} />
                  <span>Publish Movie</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
