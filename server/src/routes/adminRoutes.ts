import { Router } from "express";
import { adminDeleteItem, adminItems, adminRequests, deleteUser, getSettings, itemStatus, reports, stats, toggleBlock, updateSettings, users } from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/auth.js";

export const adminRoutes = Router();
adminRoutes.use(protect, adminOnly);
adminRoutes.get("/stats", stats);
adminRoutes.get("/users", users);
adminRoutes.patch("/users/:id/block", toggleBlock);
adminRoutes.delete("/users/:id", deleteUser);
adminRoutes.get("/items", adminItems);
adminRoutes.patch("/items/:id/status", itemStatus);
adminRoutes.delete("/items/:id", adminDeleteItem);
adminRoutes.get("/requests", adminRequests);
adminRoutes.get("/reports", reports);
adminRoutes.get("/settings", getSettings);
adminRoutes.put("/settings", updateSettings);
