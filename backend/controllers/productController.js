import Product from "../models/Product.js";

/* ================= GET ALL PRODUCTS ================= */

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET SINGLE PRODUCT ================= */

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= CREATE PRODUCT ================= */

export const createProduct = async (req, res) => {
  try {

    const { name, price, description, category } = req.body;

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "Product image required" });
    }

    if (!name || !price || !description || !category) {
      return res.status(400).json({ message: "All fields required" });
    }

    const product = new Product({
      name: name.trim(),
      price: parseFloat(price),   // FIX
      description: description.trim(),
      category: category.trim(),
      image: `/uploads/${req.file.filename}`,
      stock: 0,
      sold: 0
    });

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);

  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE PRODUCT ================= */

export const updateProduct = async (req, res) => {
  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (req.body.name) product.name = req.body.name.trim();
    if (req.body.description) product.description = req.body.description.trim();
    if (req.body.category) product.category = req.body.category.trim();

    if (req.body.price) {
      product.price = Number(req.body.price);
    }

    if (req.file) {
      product.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await product.save();

    res.json(updatedProduct);

  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE PRODUCT ================= */

export const deleteProduct = async (req, res) => {
  try {

    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });

  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};