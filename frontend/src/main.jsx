import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Added missing import
import App from "./App";
import "./index.css";
import { BagProvider } from "./context/BagContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { WishlistProvider } from "./context/WishListContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BagProvider>
        <BrowserRouter>
        <WishlistProvider>
          <App />
          </WishlistProvider>
        </BrowserRouter>
      </BagProvider>
    </AuthProvider>
  </React.StrictMode>
);