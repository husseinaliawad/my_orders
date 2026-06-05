import { Router } from "express";
import { forgotPassword, login, me, register, resetPassword, verifyOtp } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

export const authRoutes = Router();
authRoutes.post("/register", register);
authRoutes.post("/verify-otp", verifyOtp);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetPassword);
authRoutes.post("/login", login);
authRoutes.get("/me", protect, me);
