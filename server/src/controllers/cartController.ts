import type { Response } from "express";
import { Cart } from "../models/Cart.js";
import { Item } from "../models/Item.js";
import { RentalRequest } from "../models/RentalRequest.js";
import type { AuthedRequest } from "../middleware/auth.js";

const populate = { path: "items.item", populate: [{ path: "category" }, { path: "owner", select: "name email" }] };
const daysBetween = (start: string, end: string) => Math.max(1, Math.ceil((+new Date(end) - +new Date(start)) / 86400000));

export async function getCart(req: AuthedRequest, res: Response) {
  const cart = await Cart.findOne({ user: req.user._id }).populate(populate);
  res.json(cart || { user: req.user._id, items: [] });
}

export async function addToCart(req: AuthedRequest, res: Response) {
  const { itemId, startDate, endDate } = req.body;
  const item = await Item.findById(itemId);
  if (!item) return res.status(404).json({ message: "Item not found" });
  const days = daysBetween(startDate, endDate);
  const total = days * item.pricePerDay;
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { items: { item: itemId } } },
    { upsert: true, new: true }
  );
  cart.items.push({ item: item._id, startDate, endDate, days, total } as any);
  await cart.save();
  res.status(201).json(await cart.populate(populate));
}

export async function removeFromCart(req: AuthedRequest, res: Response) {
  const cart = await Cart.findOneAndUpdate({ user: req.user._id }, { $pull: { items: { item: req.params.itemId } } }, { new: true }).populate(populate);
  res.json(cart || { items: [] });
}

export async function checkout(req: AuthedRequest, res: Response) {
  const cart = await Cart.findOne({ user: req.user._id }).populate("items.item");
  if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });
  const requests = await Promise.all(
    cart.items.map((entry: any) =>
      RentalRequest.create({
        item: entry.item._id,
        renter: req.user._id,
        owner: entry.item.owner,
        startDate: entry.startDate,
        endDate: entry.endDate,
        totalAmount: Math.round(entry.total * 1.1),
        status: "pending"
      })
    )
  );
  cart.items.splice(0, cart.items.length);
  await cart.save();
  res.status(201).json({ message: "Rental requests created", requests });
}
