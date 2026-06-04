import type { Response } from "express";
import { Cart } from "../models/Cart.js";
import { RentalRequest } from "../models/RentalRequest.js";
import { Item } from "../models/Item.js";
import type { AuthedRequest } from "../middleware/auth.js";

const populate = [
  { path: "item", populate: { path: "category" } },
  { path: "renter", select: "name email avatar" },
  { path: "owner", select: "name email avatar" }
];

const daysBetween = (start: Date, end: Date) => Math.max(1, Math.ceil((end.getTime() - start.getTime()) / 86400000));

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

  if (request.status === "approved") {
    const cart = await Cart.findOneAndUpdate(
      { user: request.renter },
      { $pull: { items: { item: request.item } } },
      { upsert: true, new: true }
    );
    const item = await Item.findById(request.item);
    const days = daysBetween(request.startDate, request.endDate);
    if (item && cart) {
      cart.items.push({ item: request.item, startDate: request.startDate, endDate: request.endDate, days, total: request.totalAmount } as any);
      await cart.save();
    }
  }

  res.json(await request.populate(populate));
}
