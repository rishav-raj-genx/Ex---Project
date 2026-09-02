import { Filter } from "lucide-react";

interface GenreFilterProps {
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  totalCount: number;
}

const GENRES = [
  "All",
  "Action",
  "Sci-Fi",
  "Adventure",
  "Drama",
  "Thriller",
  "Animation",
  "Biography",
  "Comedy",
];

const LANGUAGES = ["All", "English", "Hindi", "Telugu", "Tamil"];

export function GenreFilter({
  selectedGenre,
  onGenreChange,
  selectedLanguage,
  onLanguageChange,
  totalCount,
}: GenreFilterProps) {
  return (
    <div className="filter-bar-container">
      <div className="filter-left">
        <div className="filter-title-group">
          <h2 className="filter-section-title">Recommended Movies</h2>
          <span className="movie-count-badge">{totalCount} Movies</span>
        </div>

        {/* Genre Pills */}
        <div className="genre-pills-row">
          {GENRES.map((genre) => (
            <button
              key={genre}
              className={`genre-pill-btn ${
                selectedGenre === genre ? "active" : ""
              }`}
              onClick={() => onGenreChange(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Language Selector */}
      <div className="filter-right">
        <div className="language-filter-wrapper">
          <Filter size={14} className="filter-icon" />
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="language-select"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang === "All" ? "All Languages" : lang}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
