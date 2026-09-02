import { Router } from "express";
import {
  getItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
} from "../controllers/itemController.js";

const router: Router = Router();

router.route("/").get(getItems).post(createItem);
router.route("/:id").get(getItemById).put(updateItem).delete(deleteItem);

export default router;
