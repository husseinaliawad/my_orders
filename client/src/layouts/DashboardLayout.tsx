import { Outlet } from "react-router-dom";
import { AdminSidebar } from "../components/AdminSidebar";

export function DashboardLayout() {
  return <div className="min-h-screen bg-slate-100 lg:flex">
    <AdminSidebar />
    <section className="min-w-0 flex-1 p-5 lg:p-8"><Outlet /></section>
  </div>;
}
