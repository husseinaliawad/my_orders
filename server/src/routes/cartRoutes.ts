import { Router } from "express";
import { addToCart, checkout, getCart, removeFromCart } from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

export const cartRoutes = Router();
cartRoutes.use(protect);
cartRoutes.get("/", getCart);
cartRoutes.post("/", addToCart);
cartRoutes.delete("/:itemId", removeFromCart);
cartRoutes.post("/checkout", checkout);
