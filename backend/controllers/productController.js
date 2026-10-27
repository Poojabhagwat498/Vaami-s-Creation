import mongoose from "mongoose";
import Product from "../models/Product.js";
import { memoryStore } from "../data/store.js";

const isConnected = () => mongoose.connection.readyState === 1;

/* ================= GET ALL PRODUCTS ================= */
export const getProducts = async (req, res) => {
  try {
    if (isConnected()) {
      const products = await Product.find().sort({ createdAt: -1 });
      return res.json(products);
    }
    return res.json(memoryStore.getProducts());
  } catch (error) {
    console.warn("Get products DB error, falling back to memory store:", error.message);
    return res.json(memoryStore.getProducts());
  }
};

/* ================= GET SINGLE PRODUCT ================= */
export const getProductById = async (req, res) => {
  try {
    if (isConnected()) {
      const product = await Product.findById(req.params.id);
      if (product) return res.json(product);
    }
    const memProduct = memoryStore.getProductById(req.params.id);
    if (!memProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(memProduct);
  } catch (error) {
    const memProduct = memoryStore.getProductById(req.params.id);
    if (memProduct) return res.json(memProduct);
    return res.status(404).json({ message: "Product not found" });
  }
};

/* ================= CREATE PRODUCT ================= */
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Product image required" });
    }

    if (!name || !price || !description || !category) {
      return res.status(400).json({ message: "All fields required" });
    }

    const productData = {
      name: name.trim(),
      price: parseFloat(price),
      description: description.trim(),
      category: category.trim(),
      image: `/uploads/${req.file.filename}`,
      stock: 0,
      sold: 0
    };

    if (isConnected()) {
      const product = new Product(productData);
      const savedProduct = await product.save();
      return res.status(201).json(savedProduct);
    }

    const saved = memoryStore.createProduct(productData);
    return res.status(201).json(saved);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= UPDATE PRODUCT ================= */
export const updateProduct = async (req, res) => {
  try {
    const updates = {};
    if (req.body.name) updates.name = req.body.name.trim();
    if (req.body.description) updates.description = req.body.description.trim();
    if (req.body.category) updates.category = req.body.category.trim();
    if (req.body.price) updates.price = Number(req.body.price);
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    if (isConnected()) {
      const product = await Product.findById(req.params.id);
      if (product) {
        Object.assign(product, updates);
        const updated = await product.save();
        return res.json(updated);
      }
    }

    const updatedMem = memoryStore.updateProduct(req.params.id, updates);
    if (!updatedMem) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json(updatedMem);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE PRODUCT ================= */
export const deleteProduct = async (req, res) => {
  try {
    if (isConnected()) {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (product) {
        return res.json({ message: "Product deleted successfully" });
      }
    }

    const deleted = memoryStore.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};