import express from "express";
import auth from "../middleware/auth.js";
import admin  from "../middleware/admin.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const router = express.Router();

router.get("/stats", auth,admin, async (req, res) => {
  const users = await User.countDocuments();
  const products = await Product.countDocuments();
  const orders = await Order.countDocuments();

  res.json({ users, products, orders });
});

router.get("/users/:id/orders", auth, admin, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Cannot fetch orders" });
  }
});


router.get("/users", auth, admin, async (req, res) => {
  const users = await User.find().select("name email avatar");
  res.json(users);
});

export default router;


