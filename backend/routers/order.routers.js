import express from "express";
import Order from "../models/Order.js";
import auth from "../middleware/auth.js";

const router = express.Router();

/* CREATE ORDER */

router.post("/", auth, async (req, res) => {
  try {
    console.log("User from token:", req.user);

    const { items, totalAmount, paymentMethod } = req.body;

    const order = await Order.create({
      user: req.user._id,
      items,
      totalAmount,
      paymentMethod,
    });

    console.log("Order created:", order);

    res.status(201).json(order);
  } catch (err) {
    console.log("Order error:", err);
    res.status(500).json({ message: err.message });
  }
});


/* GET MY ORDERS */
router.get("/my", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

export default router;
