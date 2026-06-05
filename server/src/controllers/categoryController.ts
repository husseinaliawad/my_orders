import type { Request, Response } from "express";
import { Category } from "../models/Category.js";

export async function getCategories(_req: Request, res: Response) {
  res.json(await Category.find().sort("name"));
}

export async function createCategory(req: Request, res: Response) {
  try {
    const name = String(req.body.name || "").trim();
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const category = await Category.create({
      name,
      icon: req.body.icon || "Package",
      description: req.body.description || "Custom rental category"
    });
    res.status(201).json(category);
  } catch (error: any) {
    if (error?.code === 11000) return res.status(409).json({ message: "Category already exists" });
    res.status(500).json({ message: "Could not create category" });
  }
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
