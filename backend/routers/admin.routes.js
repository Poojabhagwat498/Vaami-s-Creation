import express from "express";
import { getAdminStats } from "../controllers/admin.controller.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";

const router = express.Router();

router.get("/stats", auth, admin, getAdminStats);

export default router;
