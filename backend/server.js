import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routers/auth.routers.js";
import productRoutes from "./routers/product.routers.js";
import orderRoutes from "./routers/order.routers.js";
import createAdmin from "./utils/createAdmin.js";
import adminRoutes from "./routers/admin.routes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));


app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected");
    await createAdmin();

    app.listen(process.env.PORT || 5000, () =>
      console.log("🚀 Server running")
    );
  })
  .catch(console.error);
