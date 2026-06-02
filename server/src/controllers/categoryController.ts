import type { Request, Response } from "express";
import { Category } from "../models/Category.js";

export async function getCategories(_req: Request, res: Response) {
  res.json(await Category.find().sort("name"));
}

export async function createCategory(req: Request, res: Response) {
  res.status(201).json(await Category.create(req.body));
}

export async function updateCategory(req: Request, res: Response) {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).json({ message: "Category not found" });
  res.json(category);
}

export async function deleteCategory(req: Request, res: Response) {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: "Category deleted" });
}
