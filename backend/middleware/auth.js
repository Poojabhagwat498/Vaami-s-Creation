import jwt from "jsonwebtoken";
import User from "../models/User.js";

const auth = async (req, res, next) => {
  try {
    if (!req.headers.authorization?.startsWith("Bearer")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded._id;

    req.user = await User.findById(userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();

  } catch (error) {
    console.log("Auth error:", error);
    res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;