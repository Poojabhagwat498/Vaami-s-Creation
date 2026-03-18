
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

/* ================== MIDDLEWARE ================== */
app.use(
  cors({
    origin: ["http://localhost:5173", "https://vaamis-creation-2026.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);
app.options("*", cors());
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

    // create admin user automatically if not exists
    await createAdmin();

    /* ================== START SERVER ================== */
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed ❌", error);
  });

