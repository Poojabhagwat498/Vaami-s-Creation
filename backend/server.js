import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routers/auth.routers.js";
import productRoutes from "./routers/product.routers.js";
import orderRoutes from "./routers/order.routers.js";
import adminRoutes from "./routers/admin.routes.js";
import createAdmin from "./utils/createAdmin.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ================== PATH CONFIG ================== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ================== CORS FIX (FINAL) ================== */

const allowedOrigins = [
  "http://localhost:5173",
  "https://vaami-s-creation.vercel.app"
];

app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});



// ✅ HANDLE PREFLIGHT REQUESTS
app.options("*", cors({
  origin: allowedOrigins,
  credentials: true
}));

/* ================== MIDDLEWARE ================== */
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================== ROOT ROUTE ================== */
app.get("/", (req, res) => {
  res.send("Vaami's Creation Backend API is running 🚀");
});

/* ================== API ROUTES ================== */
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

/* ================== DATABASE CONNECTION ================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected successfully ✅");

    await createAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌", error);
  });