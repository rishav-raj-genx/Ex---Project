import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";

import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./config/db.js";
import { configurePassport } from "./config/passport.js";
import { seedMoviesIfEmpty } from "./config/seed.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFound.js";

import authRoutes from "./routes/authRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";

const app = express();

// --------------- Passport Configuration ---------------
configurePassport();

// --------------- Middleware ---------------
app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// --------------- Routes ---------------
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "BookMyShow Backend API",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/items", itemRoutes);

// --------------- Error Handling ---------------
app.use(notFoundHandler);
app.use(errorHandler);

// --------------- Server Bootstrap ---------------
async function bootstrap(): Promise<void> {
  await connectDatabase();
  await seedMoviesIfEmpty();

  const server = app.listen(env.port, () => {
    console.log(
      `[Server] BookMyShow API running on http://localhost:${env.port} (${env.nodeEnv})`
    );
  });

  const shutdown = async (signal: string) => {
    console.log(`\n[Server] ${signal} received — shutting down gracefully`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => void shutdown("SIGINT"));
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
}

bootstrap().catch((err: unknown) => {
  console.error("[Server] Failed to start:", err);
  process.exit(1);
});
