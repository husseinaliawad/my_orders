import bcrypt from "bcryptjs";
import mongoose, { Schema, type InferSchemaType } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: { type: Boolean, default: false },
    isEmailVerified: { type: Boolean, default: false },
    emailOtpHash: { type: String, select: false },
    emailOtpExpires: { type: Date, select: false }
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (password: string) {
  return bcrypt.compare(password, this.password);
};

export type UserDoc = InferSchemaType<typeof userSchema> & {
  comparePassword(password: string): Promise<boolean>;
};

export const User = mongoose.model("User", userSchema);
