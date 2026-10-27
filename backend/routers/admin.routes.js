import express from "express";
import mongoose from "mongoose";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import { memoryStore } from "../data/store.js";

const isConnected = () => mongoose.connection.readyState === 1;
const router = express.Router();

router.get("/stats", auth, admin, async (req, res) => {
  try {
    if (isConnected()) {
      const users = await User.countDocuments();
      const products = await Product.countDocuments();
      const orders = await Order.countDocuments();
      const totalRevenue = await Order.aggregate([
        { $group: { _id: null, revenue: { $sum: "$totalPrice" } } }
      ]);
      const ordersToday = await Order.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      });
      const topProducts = await Product.find().sort({ sold: -1 }).limit(5);

      return res.json({
        users,
        products,
        orders,
        totalOrders: orders,
        revenue: totalRevenue[0]?.revenue || 0,
        ordersToday,
        topProducts
      });
    }

    return res.json(memoryStore.getStats());
  } catch (error) {
    return res.json(memoryStore.getStats());
  }
});

router.get("/users/:id/orders", auth, admin, async (req, res) => {
  try {
    if (isConnected()) {
      const orders = await Order.find({ user: req.params.id });
      return res.json(orders);
    }
    return res.json(memoryStore.getOrdersByUser(req.params.id));
  } catch (error) {
    res.status(500).json({ message: "Cannot fetch orders" });
  }
});

router.get("/users", auth, admin, async (req, res) => {
  try {
    if (isConnected()) {
      const users = await User.find().select("name email avatar role");
      return res.json(users);
    }
    return res.json(memoryStore.getAllUsers());
  } catch (error) {
    return res.json(memoryStore.getAllUsers());
  }
});

export default router;
