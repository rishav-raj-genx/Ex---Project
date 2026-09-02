import { Router } from "express";
import {
  getMovies,
  getMovieById,
  createMovie,
  deleteMovie,
} from "../controllers/movieController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router: Router = Router();

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", requireAuth, createMovie);
router.delete("/:id", requireAuth, deleteMovie);

export default router;
