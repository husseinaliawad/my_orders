import type { Response } from "express";
import { RentalRequest } from "../models/RentalRequest.js";
import { Item } from "../models/Item.js";
import type { AuthedRequest } from "../middleware/auth.js";

const populate = [
  { path: "item", populate: { path: "category" } },
  { path: "renter", select: "name email avatar" },
  { path: "owner", select: "name email avatar" }
];

export async function getRequests(req: AuthedRequest, res: Response) {
  const requests = await RentalRequest.find({ $or: [{ renter: req.user._id }, { owner: req.user._id }] }).populate(populate).sort({ createdAt: -1 });
  res.json(requests);
}

export async function incoming(req: AuthedRequest, res: Response) {
  res.json(await RentalRequest.find({ owner: req.user._id }).populate(populate).sort({ createdAt: -1 }));
}

export async function outgoing(req: AuthedRequest, res: Response) {
  res.json(await RentalRequest.find({ renter: req.user._id }).populate(populate).sort({ createdAt: -1 }));
}

export async function createRequest(req: AuthedRequest, res: Response) {
  const item = await Item.findById(req.body.item);
  if (!item) return res.status(404).json({ message: "Item not found" });
  const request = await RentalRequest.create({ ...req.body, renter: req.user._id, owner: item.owner });
  res.status(201).json(await request.populate(populate));
}

export async function updateRequestStatus(req: AuthedRequest, res: Response) {
  const request = await RentalRequest.findById(req.params.id);
  if (!request) return res.status(404).json({ message: "Request not found" });
  if (String(request.owner) !== String(req.user._id) && req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  request.status = req.body.status;
  await request.save();
  res.json(await request.populate(populate));
}
