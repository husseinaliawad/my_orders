import { Router } from "express";
import { createRequest, getRequests, incoming, outgoing, updateRequestStatus } from "../controllers/requestController.js";
import { protect } from "../middleware/auth.js";

export const requestRoutes = Router();
requestRoutes.use(protect);
requestRoutes.get("/", getRequests);
requestRoutes.get("/incoming", incoming);
requestRoutes.get("/outgoing", outgoing);
requestRoutes.post("/", createRequest);
requestRoutes.patch("/:id/status", updateRequestStatus);
