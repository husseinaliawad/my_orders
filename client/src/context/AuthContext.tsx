import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { api } from "../api/client";
import type { User } from "../types";

type RegisterResult = { email: string; requiresOtp: boolean };
type AuthContextValue = { user: User | null; loading: boolean; login: (email: string, password: string) => Promise<void>; register: (name: string, email: string, password: string) => Promise<RegisterResult>; verifyOtp: (email: string, otp: string) => Promise<void>; logout: () => void };
const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/auth/me").then((r) => setUser(r.data.user)).catch(() => localStorage.removeItem("token")).finally(() => setLoading(false));
  }, []);

  const auth = async (path: string, payload: object) => {
    const { data } = await api.post(path, payload);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const registerAccount = async (name: string, email: string, password: string) => {
    const { data } = await api.post<RegisterResult>("/auth/register", { name, email, password });
    toast.success("Verification code sent");
    return data;
  };

  const value = useMemo(() => ({
    user,
    loading,
    login: async (email: string, password: string) => { await auth("/auth/login", { email, password }); toast.success("Welcome back"); },
    register: registerAccount,
    verifyOtp: async (email: string, otp: string) => { await auth("/auth/verify-otp", { email, otp }); toast.success("Account verified"); },
    logout: () => { localStorage.removeItem("token"); setUser(null); toast.success("Signed out"); }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
