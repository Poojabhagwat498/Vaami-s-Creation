import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./backend/routers/auth.routers.js";
import productRoutes from "./backend/routers/product.routers.js";
import orderRoutes from "./backend/routers/order.routers.js";
import adminRoutes from "./backend/routers/admin.routes.js";
import createAdmin from "./backend/utils/createAdmin.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === "production";

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Copy sample images to uploads directory if not present
const sampleImagesDir = path.join(__dirname, "frontend/src/images");
if (fs.existsSync(sampleImagesDir)) {
  try {
    const files = fs.readdirSync(sampleImagesDir);
    for (const file of files) {
      const dest = path.join(uploadsDir, file);
      if (!fs.existsSync(dest)) {
        fs.copyFileSync(path.join(sampleImagesDir, file), dest);
      }
    }
  } catch (err) {
    console.warn("Could not copy sample images:", err.message);
  }
}

/* ================== MIDDLEWARE ================== */
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded and static jewelry images
app.use("/uploads", express.static(uploadsDir));
app.use("/uploads", express.static(sampleImagesDir));
app.use("/images", express.static(sampleImagesDir));

/* ================== API ROUTES ================== */
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// Health route
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    database: mongoose.connection.readyState === 1 ? "connected" : "in-memory-fallback"
  });
});

/* ================== DATABASE CONNECTION ================== */
// Non-blocking connect as mandated by AI Studio web migration rules
mongoose.set("bufferCommands", false);
if (process.env.MONGO_URI || process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGO_URI || process.env.MONGODB_URI)
    .then(async () => {
      console.log("MongoDB connected successfully ✅");
      try {
        await createAdmin();
      } catch (e) {
        console.warn("createAdmin error:", e.message);
      }
    })
    .catch((error) => {
      console.warn("MongoDB connection failed — using in-memory store fallback:", error.message);
    });
} else {
  console.log("No MONGO_URI set — running with in-memory store fallback.");
}

// Route-level database error fallback
app.use((err, req, res, next) => {
  if (
    err.name === "MongooseError" ||
    err.name === "MongoNetworkError" ||
    (err.message && err.message.includes("buffering timed out"))
  ) {
    console.warn("[AI Studio] Database offline — returning fallback response");
    if (req.method === "GET") {
      return res.json(req.path.endsWith("s") || req.path.endsWith("s/") ? [] : {});
    }
    return res.status(503).json({ error: "Service temporarily unavailable (database offline)" });
  }
  next(err);
});

/* ================== FRONTEND MOUNTING ================== */
async function startServer() {
  if (!isProd) {
    // In dev: mount Vite dev server as middleware
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
      root: path.resolve(__dirname, "frontend"),
    });

    app.use(vite.middlewares);
  } else {
    // In production: serve static build from dist or frontend/dist
    const distPath = fs.existsSync(path.resolve(__dirname, "dist"))
      ? path.resolve(__dirname, "dist")
      : path.resolve(__dirname, "frontend/dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Vaami's Creation server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
