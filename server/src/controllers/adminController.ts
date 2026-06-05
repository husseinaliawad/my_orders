import type { Response } from "express";
import { User } from "../models/User.js";
import { Item } from "../models/Item.js";
import { RentalRequest } from "../models/RentalRequest.js";
import { Category } from "../models/Category.js";
import { Setting } from "../models/Setting.js";
import type { AuthedRequest } from "../middleware/auth.js";

const defaultSettings = {
  platformName: "Share Instead",
  serviceFeePercent: 10,
  supportEmail: "support@shareinstead.com"
};

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

export async function getSettings(_req: AuthedRequest, res: Response) {
  const settings = await Setting.find();
  const values = settings.reduce((acc: any, entry) => ({ ...acc, [entry.key]: entry.value }), {});
  res.json({ ...defaultSettings, ...values });
}

export async function updateSettings(req: AuthedRequest, res: Response) {
  const platformName = String(req.body.platformName || "").trim();
  const supportEmail = String(req.body.supportEmail || "").trim();
  const serviceFeePercent = Number(req.body.serviceFeePercent);
  if (!platformName) return res.status(400).json({ message: "Platform name is required" });
  if (!supportEmail.includes("@")) return res.status(400).json({ message: "Support email is invalid" });
  if (!Number.isFinite(serviceFeePercent) || serviceFeePercent < 0 || serviceFeePercent > 100) {
    return res.status(400).json({ message: "Service fee must be between 0 and 100" });
  }

  const next = { platformName, supportEmail, serviceFeePercent };
  await Promise.all(Object.entries(next).map(([key, value]) => Setting.findOneAndUpdate({ key }, { value }, { upsert: true })));
  res.json(next);
}

export async function reports(_req: AuthedRequest, res: Response) {
  const [monthlyRentals, revenueByCategory, statusCounts, topItems] = await Promise.all([
    RentalRequest.aggregate([
      { $group: { _id: { $dateToString: { date: "$createdAt", format: "%Y-%m" } }, count: { $sum: 1 }, revenue: { $sum: "$totalAmount" } } },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]),
    RentalRequest.aggregate([
      { $match: { status: { $in: ["approved", "completed"] } } },
      { $lookup: { from: "items", localField: "item", foreignField: "_id", as: "itemDoc" } },
      { $unwind: "$itemDoc" },
      { $lookup: { from: "categories", localField: "itemDoc.category", foreignField: "_id", as: "categoryDoc" } },
      { $unwind: "$categoryDoc" },
      { $group: { _id: "$categoryDoc.name", total: { $sum: "$totalAmount" } } },
      { $sort: { total: -1 } }
    ]),
    RentalRequest.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
    Item.find({ status: "approved" }).populate("category").sort({ rating: -1, createdAt: -1 }).limit(5)
  ]);
  const categories = await Category.countDocuments();
  res.json({ monthlyRentals, revenueByCategory, statusCounts, topItems, categories });
}
