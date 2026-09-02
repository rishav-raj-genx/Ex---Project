import { Movie } from "../models/Movie.js";

const initialMovies = [
  {
    title: "Dune: Part Two",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe.",
    posterUrl:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80",
    genres: ["Sci-Fi", "Adventure", "Action"],
    language: "English",
    duration: 166,
    rating: 8.9,
    releaseDate: "2026-03-01",
    theaters: ["PVR INOX: IMAX 4DX", "Cinepolis: VIP Lounge", "Wave Cinemas: Atmos"],
    showtimes: ["10:00 AM", "01:30 PM", "05:00 PM", "08:30 PM", "11:45 PM"],
    tierPricing: { classic: 200, prime: 320, recliner: 500 },
    featured: true,
  },
  {
    title: "Oppenheimer",
    description:
      "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II.",
    posterUrl:
      "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&auto=format&fit=crop&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&auto=format&fit=crop&q=80",
    genres: ["Biography", "Drama", "History"],
    language: "English",
    duration: 180,
    rating: 8.8,
    releaseDate: "2026-02-15",
    theaters: ["PVR INOX: Nexus Mall", "Cinepolis: Grand Plaza"],
    showtimes: ["11:15 AM", "03:00 PM", "06:45 PM", "10:15 PM"],
    tierPricing: { classic: 180, prime: 290, recliner: 460 },
    featured: true,
  },
  {
    title: "Interstellar: Beyond Time",
    description:
      "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival as Earth faces catastrophic extinction.",
    posterUrl:
      "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1600&auto=format&fit=crop&q=80",
    genres: ["Sci-Fi", "Drama", "Adventure"],
    language: "English",
    duration: 169,
    rating: 9.1,
    releaseDate: "2026-01-20",
    theaters: ["IMAX: Wave City Center", "PVR INOX: Gold Class"],
    showtimes: ["12:00 PM", "04:15 PM", "08:00 PM", "11:30 PM"],
    tierPricing: { classic: 220, prime: 350, recliner: 550 },
    featured: true,
  },
  {
    title: "Spider-Man: Beyond The Multiverse",
    description:
      "Miles Morales catapults across the multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    posterUrl:
      "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=800&auto=format&fit=crop&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1600&auto=format&fit=crop&q=80",
    genres: ["Animation", "Action", "Adventure"],
    language: "Hindi",
    duration: 140,
    rating: 8.7,
    releaseDate: "2026-04-10",
    theaters: ["PVR INOX: Nexus Mall", "Cinepolis: Grand Plaza"],
    showtimes: ["10:30 AM", "01:45 PM", "05:00 PM", "08:15 PM"],
    tierPricing: { classic: 160, prime: 260, recliner: 420 },
    featured: false,
  },
  {
    title: "Cyberpunk: Neo Tokyo",
    description:
      "In a neon-drenched metropolis of 2088, an undercover operative uncovers a conspiracy that threatens to rewrite human consciousness.",
    posterUrl:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&auto=format&fit=crop&q=80",
    genres: ["Action", "Sci-Fi", "Thriller"],
    language: "English",
    duration: 135,
    rating: 8.4,
    releaseDate: "2026-05-01",
    theaters: ["PVR INOX: Nexus Mall", "Wave Cinemas: Atmos"],
    showtimes: ["02:00 PM", "05:30 PM", "09:00 PM"],
    tierPricing: { classic: 180, prime: 280, recliner: 450 },
    featured: false,
  },
  {
    title: "Kalki 2898 AD",
    description:
      "A modern avatar of Hindu god Vishnu descends to earth to protect the world from evil forces in a futuristic post-apocalyptic realm.",
    posterUrl:
      "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    backdropUrl:
      "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80",
    genres: ["Sci-Fi", "Action", "Mythology"],
    language: "Telugu",
    duration: 178,
    rating: 8.6,
    releaseDate: "2026-06-15",
    theaters: ["PVR INOX: Nexus Mall", "Cinepolis: Grand Plaza"],
    showtimes: ["11:00 AM", "02:45 PM", "06:30 PM", "10:00 PM"],
    tierPricing: { classic: 190, prime: 300, recliner: 480 },
    featured: false,
  },
];

export async function seedMoviesIfEmpty(): Promise<void> {
  try {
    const count = await Movie.countDocuments();
    if (count === 0) {
      console.log("[DB] No movies found in database. Auto-seeding initial movie catalog...");
      await Movie.insertMany(initialMovies);
      console.log(`[DB] Successfully seeded ${initialMovies.length} movies!`);
    } else {
      console.log(`[DB] Catalog contains ${count} movies.`);
    }
  } catch (err) {
    console.error("[DB] Failed to seed movies:", err);
  }
}
