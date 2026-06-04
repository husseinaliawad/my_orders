import { zodResolver } from "@hookform/resolvers/zod";
import { Package } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { FormField } from "../components/FormField";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

const schema = z.object({ name: z.string().optional(), email: z.string().email(), password: z.string().min(6) });
const otpSchema = z.object({ otp: z.string().min(6).max(6) });
type Form = z.infer<typeof schema>;
type OtpForm = z.infer<typeof otpSchema>;

export function Auth({ mode }: { mode: "login" | "register" | "forgot" }) {
  const { login, register, verifyOtp } = useAuth();
  const nav = useNavigate();
  const [pendingEmail, setPendingEmail] = useState("");
  const { register: field, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) });
  const { register: otpField, handleSubmit: handleOtpSubmit, formState: { errors: otpErrors, isSubmitting: isVerifying } } = useForm<OtpForm>({ resolver: zodResolver(otpSchema) });
  const submit = async (v: Form) => {
    try {
      if (mode === "register") {
        const result = await register(v.name || "User", v.email, v.password);
        setPendingEmail(result.email);
        return;
      } else if (mode === "login") {
        await login(v.email, v.password);
      }
      nav("/");
    } catch (error: any) {
      const fallbackMessage = mode === "register"
        ? "Registration failed. Check your details and try again."
        : "Login failed. Check your email and password.";
      toast.error(error.response?.data?.message || error.message || fallbackMessage);
    }
  };
  const submitOtp = async (v: OtpForm) => {
    try {
      await verifyOtp(pendingEmail, v.otp);
      nav("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || "Invalid verification code.");
    }
  };
  return <div className="grid min-h-screen place-items-center bg-[linear-gradient(115deg,#f7f3ff_0%,#ffffff_45%,#e6f8fb_100%)] px-4">
    <Card className="w-full max-w-md border-white/80 bg-white/90 shadow-[0_28px_90px_rgba(15,23,42,.12)] backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary to-cyan-500 text-white"><Package /></span><div><h1 className="text-2xl font-extrabold">{pendingEmail ? "Verify email" : mode === "register" ? "Create account" : mode === "forgot" ? "Reset password" : "Welcome back"}</h1><p className="text-sm text-slate-500">{pendingEmail || "Share Instead marketplace"}</p></div></div>
      {pendingEmail ? <form onSubmit={handleOtpSubmit(submitOtp)} className="grid gap-4"><FormField label="Verification code" error={otpErrors.otp?.message}><Input placeholder="6-digit code" inputMode="numeric" autoComplete="one-time-code" {...otpField("otp")} /></FormField><Button type="submit" disabled={isVerifying}>{isVerifying ? "Verifying..." : "Verify account"}</Button></form> : mode === "forgot" ? <><FormField label="Email"><Input placeholder="Email address" /></FormField><Button type="button" className="mt-4 w-full">Send reset link</Button></> : <form onSubmit={handleSubmit(submit, () => toast.error("Enter a valid email and a password with at least 6 characters."))} className="grid gap-4">{mode === "register" && <FormField label="Name"><Input placeholder="Name" {...field("name")} /></FormField>}<FormField label="Email" error={errors.email?.message}><Input placeholder="Email" autoComplete="email" {...field("email")} /></FormField><FormField label="Password" error={errors.password?.message}><Input type="password" placeholder="Password" autoComplete={mode === "login" ? "current-password" : "new-password"} {...field("password")} /></FormField><Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Please wait..." : mode === "register" ? "Register" : "Login"}</Button></form>}
      <div className="mt-5 flex justify-between text-sm font-semibold text-primary"><Link to={mode === "register" ? "/login" : "/register"}>{mode === "register" ? "Have an account?" : "Create account"}</Link><Link to="/forgot-password">Forgot password?</Link></div>
    </Card>
  </div>;
}
