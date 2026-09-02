import type { Request, Response } from "express";
import { Item, type IItem } from "../models/Item.js";
import { AppError, asyncHandler } from "../middleware/errorHandler.js";

export const getItems = asyncHandler(async (_req: Request, res: Response) => {
  const items = await Item.find().sort({ createdAt: -1 });
  res.json({ status: "success", data: items });
});

export const getItemById = asyncHandler(async (req: Request, res: Response) => {
  const item = await Item.findById(req.params["id"]);
  if (!item) {
    throw new AppError("Item not found", 404);
  }
  res.json({ status: "success", data: item });
});

export const createItem = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, status } = req.body as IItem;
  const item = await Item.create({ name, description, status });
  res.status(201).json({ status: "success", data: item });
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, status } = req.body as Partial<IItem>;
  const item = await Item.findByIdAndUpdate(
    req.params["id"],
    { name, description, status },
    { new: true, runValidators: true }
  );

  if (!item) {
    throw new AppError("Item not found", 404);
  }

  res.json({ status: "success", data: item });
});

export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await Item.findByIdAndDelete(req.params["id"]);
  if (!item) {
    throw new AppError("Item not found", 404);
  }
  res.json({ status: "success", data: null });
});
