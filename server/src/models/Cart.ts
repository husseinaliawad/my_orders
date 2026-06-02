import mongoose, { Schema } from "mongoose";

const cartItemSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema]
  },
  { timestamps: true }
);

export const Cart = mongoose.model("Cart", cartSchema);
