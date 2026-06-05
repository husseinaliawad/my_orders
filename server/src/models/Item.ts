import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    pricePerDay: { type: Number, required: true, min: 0 },
    location: { type: String, required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
  },
  { timestamps: true }
);

export const Item = mongoose.model("Item", itemSchema);
