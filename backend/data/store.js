import bcrypt from "bcryptjs";

const initialProducts = [
  {
    _id: "prod_pendant_1",
    name: "Royal Polki Pendant",
    price: 3499,
    description: "Intricately crafted Kundan and Polki pendant with authentic gold finish, reflecting Indian royalty.",
    category: "Pendants",
    image: "/uploads/pendant11.jpeg",
    stock: 12,
    sold: 15,
    createdAt: new Date().toISOString()
  },
  {
    _id: "prod_earring_2",
    name: "Emerald Drop Earrings",
    price: 2199,
    description: "Classic Victorian emerald drop earrings featuring delicate cubic zirconia pave settings.",
    category: "Earrings",
    image: "/uploads/earring11.jpeg",
    stock: 8,
    sold: 24,
    createdAt: new Date().toISOString()
  },
  {
    _id: "prod_ring_3",
    name: "Solitaire Crystal Ring",
    price: 1899,
    description: "Timeless solitaire design with shimmering baguette stones crafted in rhodium-plated sterling silver.",
    category: "Rings",
    image: "/uploads/ring11.jpeg",
    stock: 15,
    sold: 30,
    createdAt: new Date().toISOString()
  },
  {
    _id: "prod_bracelet_4",
    name: "Floral Motif Bracelet",
    price: 2799,
    description: "Delicate floral filigree cuff bracelet with rose gold plating and adjustable clasp.",
    category: "Bracelets",
    image: "/uploads/bracelet11.jpeg",
    stock: 10,
    sold: 18,
    createdAt: new Date().toISOString()
  },
  {
    _id: "prod_watch_5",
    name: "Rose Gold Chrono Watch",
    price: 4999,
    description: "Luxury minimalist timepiece with mother-of-pearl dial and diamond-accented indices.",
    category: "Watches",
    image: "/uploads/watch11.jpg",
    stock: 6,
    sold: 9,
    createdAt: new Date().toISOString()
  }
];

class MemoryStore {
  constructor() {
    this.products = [...initialProducts];
    this.users = [];
    this.orders = [];
    this.initAdmin();
  }

  async initAdmin() {
    const adminPassword = await bcrypt.hash("admin111", 10);
    this.users.push({
      _id: "admin_user_01",
      name: "Admin",
      email: "admin@gmail.com",
      password: adminPassword,
      role: "admin",
      createdAt: new Date().toISOString()
    });

    const demoPassword = await bcrypt.hash("demo123", 10);
    this.users.push({
      _id: "demo_user_01",
      name: "Demo Customer",
      email: "demo@vaami.com",
      password: demoPassword,
      role: "user",
      createdAt: new Date().toISOString()
    });
  }

  // Products
  getProducts() {
    return [...this.products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getProductById(id) {
    return this.products.find(p => p._id === id || p.id === id);
  }

  createProduct(data) {
    const newProduct = {
      _id: "prod_" + Date.now(),
      ...data,
      stock: data.stock || 0,
      sold: data.sold || 0,
      createdAt: new Date().toISOString()
    };
    this.products.unshift(newProduct);
    return newProduct;
  }

  updateProduct(id, data) {
    const idx = this.products.findIndex(p => p._id === id || p.id === id);
    if (idx === -1) return null;
    this.products[idx] = { ...this.products[idx], ...data };
    return this.products[idx];
  }

  deleteProduct(id) {
    const idx = this.products.findIndex(p => p._id === id || p.id === id);
    if (idx === -1) return false;
    this.products.splice(idx, 1);
    return true;
  }

  // Users
  findUserByEmail(email) {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id) {
    return this.users.find(u => u._id === id || u.id === id);
  }

  async createUser(data) {
    const newUser = {
      _id: "user_" + Date.now(),
      ...data,
      createdAt: new Date().toISOString()
    };
    this.users.push(newUser);
    return newUser;
  }

  getAllUsers() {
    return this.users.map(({ password, ...u }) => u);
  }

  // Orders
  createOrder(data) {
    const newOrder = {
      _id: "order_" + Date.now(),
      ...data,
      paymentStatus: data.paymentStatus || "paid",
      status: data.status || "processing",
      createdAt: new Date().toISOString()
    };
    this.orders.unshift(newOrder);
    return newOrder;
  }

  getOrdersByUser(userId) {
    return this.orders
      .filter(o => String(o.user) === String(userId) || String(o.user?._id) === String(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getAllOrders() {
    return [...this.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getStats() {
    const totalOrders = this.orders.length;
    const revenue = this.orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ordersToday = this.orders.filter(o => new Date(o.createdAt) >= today).length;
    const topProducts = [...this.products]
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 5);

    return {
      users: this.users.length,
      products: this.products.length,
      orders: totalOrders,
      totalOrders,
      revenue,
      ordersToday,
      topProducts
    };
  }
}

export const memoryStore = new MemoryStore();
