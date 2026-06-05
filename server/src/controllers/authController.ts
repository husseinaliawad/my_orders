import type { Response } from "express";
import { User } from "../models/User.js";
import { signToken } from "../utils/token.js";
import type { AuthedRequest } from "../middleware/auth.js";
import { generateOtp, hashOtp, otpExpiry } from "../utils/otp.js";
import { sendOtpEmail } from "../utils/mailer.js";

const publicUser = (user: any) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
  isBlocked: user.isBlocked,
  isEmailVerified: user.isEmailVerified !== false,
  createdAt: user.createdAt
});

export async function register(req: AuthedRequest, res: Response) {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) return res.status(409).json({ message: "Email already registered" });
  const otp = generateOtp();
  const user = await User.create({ name, email, password, emailOtpHash: hashOtp(otp), emailOtpExpires: otpExpiry() });
  try {
    await sendOtpEmail(user.email, otp);
    res.status(201).json({ message: "Verification code sent", email: user.email, requiresOtp: true });
  } catch (error) {
    await User.findByIdAndDelete(user._id);
    console.error("Failed to send verification email", error);
    res.status(503).json({ message: "Could not send verification email. Check SMTP settings." });
  }
}

export async function login(req: AuthedRequest, res: Response) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "Account not found" });
  }
  if (!(await (user as any).comparePassword(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  if (user.isBlocked) return res.status(403).json({ message: "Account blocked" });
  if (user.isEmailVerified === false) return res.status(403).json({ message: "Please verify your email before logging in" });
  res.json({ token: signToken(user.id), user: publicUser(user) });
}

export async function verifyOtp(req: AuthedRequest, res: Response) {
  const { email, otp } = req.body;
  const user = await User.findOne({ email }).select("+emailOtpHash +emailOtpExpires");
  if (!user) return res.status(404).json({ message: "User not found" });
  if (user.isEmailVerified) return res.json({ token: signToken(user.id), user: publicUser(user) });
  if (!user.emailOtpHash || !user.emailOtpExpires || user.emailOtpExpires.getTime() < Date.now()) {
    return res.status(400).json({ message: "Verification code expired" });
  }
  if (user.emailOtpHash !== hashOtp(String(otp || ""))) {
    return res.status(400).json({ message: "Invalid verification code" });
  }

  user.isEmailVerified = true;
  user.emailOtpHash = undefined;
  user.emailOtpExpires = undefined;
  await user.save();
  res.json({ token: signToken(user.id), user: publicUser(user) });
}

export async function forgotPassword(req: AuthedRequest, res: Response) {
  const { email } = req.body;
  const user = await User.findOne({ email }).select("+resetOtpHash +resetOtpExpires");
  if (!user) return res.status(404).json({ message: "Account not found" });

  const otp = generateOtp();
  user.resetOtpHash = hashOtp(otp);
  user.resetOtpExpires = otpExpiry();
  await user.save();

  try {
    await sendOtpEmail(user.email, otp);
    res.json({ message: "Reset code sent", email: user.email });
  } catch (error) {
    console.error("Failed to send reset email", error);
    res.status(503).json({ message: "Could not send reset email. Check SMTP settings." });
  }
}

export async function resetPassword(req: AuthedRequest, res: Response) {
  const { email, otp, password } = req.body;
  if (!password || String(password).length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

  const user = await User.findOne({ email }).select("+resetOtpHash +resetOtpExpires");
  if (!user) return res.status(404).json({ message: "Account not found" });
  if (!user.resetOtpHash || !user.resetOtpExpires || user.resetOtpExpires.getTime() < Date.now()) {
    return res.status(400).json({ message: "Reset code expired" });
  }
  if (user.resetOtpHash !== hashOtp(String(otp || ""))) return res.status(400).json({ message: "Invalid reset code" });

  user.password = password;
  user.resetOtpHash = undefined;
  user.resetOtpExpires = undefined;
  await user.save();
  res.json({ message: "Password reset successfully" });
}

export async function me(req: AuthedRequest, res: Response) {
  res.json({ user: req.user });
}
