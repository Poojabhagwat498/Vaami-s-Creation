import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import auth from "../middleware/auth.js";
import { memoryStore } from "../data/store.js";

const isConnected = () => mongoose.connection.readyState === 1;
const router = express.Router();

/* CREATE ORDER */
router.post("/", auth, async (req, res) => {
  try {
    const { items, totalPrice, paymentMethod, deliveryAddress } = req.body;
    const userId = req.user._id || req.user.id;

    if (isConnected()) {
      const order = await Order.create({
        user: userId,
        items,
        totalPrice,
        paymentMethod,
        deliveryAddress,
        paymentStatus: "paid",
        status: "processing",
      });
      return res.status(201).json(order);
    }

    const memOrder = memoryStore.createOrder({
      user: userId,
      items,
      totalPrice,
      paymentMethod,
      deliveryAddress,
      paymentStatus: "paid",
      status: "processing",
    });

    return res.status(201).json(memOrder);
  } catch (err) {
    console.log("Order error:", err);
    res.status(500).json({ message: err.message });
  }
});

/* GET MY ORDERS */
router.get("/my", auth, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (isConnected()) {
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
      return res.json(orders);
    }

    return res.json(memoryStore.getOrdersByUser(userId));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET ALL ORDERS (FOR ADMIN) */
router.get("/", auth, async (req, res) => {
  try {
    if (isConnected()) {
      const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
      return res.json(orders);
    }
    return res.json(memoryStore.getAllOrders());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;