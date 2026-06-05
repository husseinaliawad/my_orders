import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true, maxlength: 800 }
  },
  { timestamps: true }
);

reviewSchema.index({ item: 1, user: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
