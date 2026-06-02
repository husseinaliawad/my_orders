import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controllers/categoryController.js";
import { adminOnly, protect } from "../middleware/auth.js";

export const categoryRoutes = Router();
categoryRoutes.get("/", getCategories);
categoryRoutes.post("/", protect, adminOnly, createCategory);
categoryRoutes.put("/:id", protect, adminOnly, updateCategory);
categoryRoutes.delete("/:id", protect, adminOnly, deleteCategory);
