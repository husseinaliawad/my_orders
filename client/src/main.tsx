import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import { router } from "./routes";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <CartProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" />
        </CartProvider>
      </FavoritesProvider>
    </AuthProvider>
  </React.StrictMode>
);
