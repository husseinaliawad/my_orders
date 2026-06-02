import mongoose, { Schema } from "mongoose";

const rentalRequestSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    renter: { type: Schema.Types.ObjectId, ref: "User", required: true },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected", "completed"], default: "pending" }
  },
  { timestamps: true }
);

export const RentalRequest = mongoose.model("RentalRequest", rentalRequestSchema);
