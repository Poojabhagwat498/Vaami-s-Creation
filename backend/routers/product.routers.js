import express from "express";
import multer from "multer";
import path from "path";

import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController.js";

const router = express.Router();

/* ================= MULTER CONFIG ================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,

  limits: { fileSize: 5 * 1024 * 1024 },

  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;

    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);

    if (ext && mime) {
      cb(null, true);
    } else {
      cb(new Error("Only image files allowed"));
    }
  }
});

/* ================= ROUTES ================= */

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post(
  "/",
  auth,
  admin,
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  auth,
  admin,
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  auth,
  admin,
  deleteProduct
);

export default router;