import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, revenue: { $sum: "$totalPrice" } } }
    ]);

    const ordersToday = await Order.countDocuments({
      createdAt: {
        $gte: new Date(new Date().setHours(0,0,0,0))
      }
    });

    const topProducts = await Product.find().sort({ sold: -1 }).limit(5);

    res.json({
      totalOrders,
      ordersToday,
      revenue: totalRevenue[0]?.revenue || 0,
      topProducts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
