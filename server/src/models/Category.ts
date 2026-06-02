import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    icon: { type: String, required: true, default: "Package" },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
