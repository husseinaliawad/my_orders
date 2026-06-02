import { Router } from "express";
import { login, me, register, verifyOtp } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

export const authRoutes = Router();
authRoutes.post("/register", register);
authRoutes.post("/verify-otp", verifyOtp);
authRoutes.post("/login", login);
authRoutes.get("/me", protect, me);
