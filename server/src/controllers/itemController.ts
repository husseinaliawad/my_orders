import type { Response } from "express";
import { Item } from "../models/Item.js";
import type { AuthedRequest } from "../middleware/auth.js";

const populate = [{ path: "category" }, { path: "owner", select: "name email avatar" }];

export async function getItems(req: AuthedRequest, res: Response) {
  const { search, category, location, minPrice, maxPrice, rating, availability, sort, mine, status } = req.query;
  const query: any = mine ? { owner: req.user?._id } : { status: "approved" };
  if (status) query.status = status;
  if (search) query.$or = [{ title: new RegExp(String(search), "i") }, { description: new RegExp(String(search), "i") }];
  if (category) query.category = category;
  if (location) query.location = new RegExp(String(location), "i");
  if (minPrice || maxPrice) query.pricePerDay = { ...(minPrice ? { $gte: Number(minPrice) } : {}), ...(maxPrice ? { $lte: Number(maxPrice) } : {}) };
  if (rating) query.rating = { $gte: Number(rating) };
  if (availability) query.isAvailable = availability === "true";
  const sortMap: Record<string, any> = {
    newest: { createdAt: -1 },
    "price-low": { pricePerDay: 1 },
    "price-high": { pricePerDay: -1 },
    rated: { rating: -1 }
  };
  const items = await Item.find(query).populate(populate).sort(sortMap[String(sort || "newest")]);
  res.json(items);
}

export async function getItem(req: AuthedRequest, res: Response) {
  const item = await Item.findById(req.params.id).populate(populate);
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
}

export async function createItem(req: AuthedRequest, res: Response) {
  const images = ((req.files as Express.Multer.File[]) || []).map((file) => `/uploads/${file.filename}`);
  const item = await Item.create({ ...req.body, images, owner: req.user._id });
  res.status(201).json(await item.populate(populate));
}

export async function updateItem(req: AuthedRequest, res: Response) {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  if (String(item.owner) !== String(req.user._id) && req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  const images = ((req.files as Express.Multer.File[]) || []).map((file) => `/uploads/${file.filename}`);
  Object.assign(item, req.body, images.length ? { images: [...item.images, ...images] } : {});
  await item.save();
  res.json(await item.populate(populate));
}

export async function deleteItem(req: AuthedRequest, res: Response) {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  if (String(item.owner) !== String(req.user._id) && req.user.role !== "admin") return res.status(403).json({ message: "Forbidden" });
  await item.deleteOne();
  res.json({ message: "Item deleted" });
}
