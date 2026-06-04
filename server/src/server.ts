import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { envPath, legacyUploadDir, uploadDir } from "./config/paths.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { cartRoutes } from "./routes/cartRoutes.js";
import { categoryRoutes } from "./routes/categoryRoutes.js";
import { itemRoutes } from "./routes/itemRoutes.js";
import { requestRoutes } from "./routes/requestRoutes.js";

const app = express();
dotenv.config({ path: envPath });
const allowedOrigins = new Set((process.env.CLIENT_URL || "http://localhost:5173").split(",").map((origin) => origin.trim()).filter(Boolean));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    try {
      const url = new URL(origin);
      const isDevHost = ["localhost", "127.0.0.1"].includes(url.hostname) || /^192\.168\.\d{1,3}\.\d{1,3}$/.test(url.hostname);
      if (allowedOrigins.has(origin) || isDevHost) return callback(null, true);
    } catch {
      // Fall through to the CORS error below.
    }
    return callback(new Error(`Origin ${origin} is not allowed by CORS`));
  }
}));
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(uploadDir));
app.use("/uploads", express.static(legacyUploadDir));

app.get("/", (_req, res) => {
  res.json({
    name: "Share Instead API",
    status: "ok",
    frontend: process.env.CLIENT_URL || "http://localhost:5173",
    health: "/api/health"
  });
});
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/admin", adminRoutes);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

const port = process.env.PORT || 5000;
connectDB().then(() => app.listen(port, () => console.log(`API running on ${port}`)));
