import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "./layouts/AppLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { AddItem } from "./pages/AddItem";
import { Auth } from "./pages/Auth";
import { BrowseItems } from "./pages/BrowseItems";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { Home } from "./pages/Home";
import { ItemDetails } from "./pages/ItemDetails";
import { MyProducts } from "./pages/MyProducts";
import { Profile } from "./pages/Profile";
import { Requests } from "./pages/Requests";
import { AdminOverview } from "./pages/admin/AdminOverview";
import { ManageCategories } from "./pages/admin/ManageCategories";
import { ManageItems } from "./pages/admin/ManageItems";
import { ManageRequests } from "./pages/admin/ManageRequests";
import { ManageUsers } from "./pages/admin/ManageUsers";
import { Reports } from "./pages/admin/Reports";
import { Settings } from "./pages/admin/Settings";
import { useAuth } from "./context/AuthContext";

function Protected({ children, admin = false }: { children: React.ReactNode; admin?: boolean }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (admin && user.role !== "admin") return <Navigate to="/" replace />;
  return children;
}

export const router = createBrowserRouter([
  { path: "/login", element: <Auth mode="login" /> },
  { path: "/register", element: <Auth mode="register" /> },
  { path: "/forgot-password", element: <Auth mode="forgot" /> },
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "browse", element: <BrowseItems /> },
      { path: "items/:id", element: <ItemDetails /> },
      { path: "add-item", element: <Protected><AddItem /></Protected> },
      { path: "my-products", element: <Protected><MyProducts /></Protected> },
      { path: "items/:id/edit", element: <Protected><AddItem /></Protected> },
      { path: "requests", element: <Protected><Requests /></Protected> },
      { path: "cart", element: <Protected><Cart /></Protected> },
      { path: "checkout", element: <Protected><Checkout /></Protected> },
      { path: "profile", element: <Protected><Profile /></Protected> }
    ]
  },
  {
    path: "/admin",
    element: <Protected admin><DashboardLayout /></Protected>,
    children: [
      { index: true, element: <AdminOverview /> },
      { path: "users", element: <ManageUsers /> },
      { path: "items", element: <ManageItems /> },
      { path: "categories", element: <ManageCategories /> },
      { path: "requests", element: <ManageRequests /> },
      { path: "reports", element: <Reports /> },
      { path: "settings", element: <Settings /> }
    ]
  }
]);
