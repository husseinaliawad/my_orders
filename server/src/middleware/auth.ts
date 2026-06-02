import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export interface AuthedRequest extends Request {
  user?: any;
}

export async function protect(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.split(" ")[1]
    : undefined;
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as { id: string };
    const user = await User.findById(decoded.id).select("-password");
    if (!user || user.isBlocked) return res.status(401).json({ message: "Account unavailable" });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}

export function adminOnly(req: AuthedRequest, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
}
