import type { Response } from "express";
import { User } from "../models/User.js";
import { Item } from "../models/Item.js";
import { RentalRequest } from "../models/RentalRequest.js";
import type { AuthedRequest } from "../middleware/auth.js";

export async function stats(_req: AuthedRequest, res: Response) {
  const [totalUsers, totalItems, totalRequests, latestUsers, latestRentals, revenueAgg] = await Promise.all([
    User.countDocuments(),
    Item.countDocuments(),
    RentalRequest.countDocuments(),
    User.find().sort({ createdAt: -1 }).limit(5).select("-password"),
    RentalRequest.find().sort({ createdAt: -1 }).limit(5).populate("item renter owner"),
    RentalRequest.aggregate([{ $match: { status: { $in: ["approved", "completed"] } } }, { $group: { _id: null, total: { $sum: "$totalAmount" } } }])
  ]);
  res.json({ totalUsers, totalItems, totalRequests, totalRevenue: revenueAgg[0]?.total || 0, latestUsers, latestRentals });
}

export async function users(req: AuthedRequest, res: Response) {
  const q = req.query.search ? { $or: [{ name: new RegExp(String(req.query.search), "i") }, { email: new RegExp(String(req.query.search), "i") }] } : {};
  res.json(await User.find(q).select("-password").sort({ createdAt: -1 }));
}

export async function toggleBlock(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  user.isBlocked = !user.isBlocked;
  await user.save();
  res.json(user);
}

export async function deleteUser(req: AuthedRequest, res: Response) {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
}

export async function adminItems(_req: AuthedRequest, res: Response) {
  res.json(await Item.find().populate("category owner").sort({ createdAt: -1 }));
}

export async function itemStatus(req: AuthedRequest, res: Response) {
  const item = await Item.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true }).populate("category owner");
  res.json(item);
}

export async function adminDeleteItem(req: AuthedRequest, res: Response) {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
}

export async function adminRequests(_req: AuthedRequest, res: Response) {
  res.json(await RentalRequest.find().populate("item renter owner").sort({ createdAt: -1 }));
}
