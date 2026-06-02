import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export function AppLayout() {
  return <div className="min-h-screen overflow-hidden bg-[#fbfcff]">
    <Navbar />
    <main><Outlet /></main>
    <Footer />
  </div>;
}
