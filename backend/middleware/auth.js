import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { memoryStore } from "../data/store.js";

const JWT_SECRET = process.env.JWT_SECRET || "vaami_jwt_secret_dev_key_2026";
const isConnected = () => mongoose.connection.readyState === 1;

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ message: "Invalid token" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    let user = null;
    if (isConnected()) {
      user = await User.findById(decoded.id).select("-password");
    }
    if (!user) {
      user = memoryStore.findUserById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Auth error:", error.message);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;