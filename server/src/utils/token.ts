import jwt from "jsonwebtoken";

export function signToken(id: string) {
  return jwt.sign({ id }, process.env.JWT_SECRET || "dev-secret", { expiresIn: "7d" });
}
