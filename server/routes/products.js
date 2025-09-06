import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Get all products
router.get("/", (req, res) => {
  try {
    const { category_id, search } = req.query;

    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.is_active = 1
    `;

    const params = [];

    if (category_id) {
      query += " AND p.category_id = ?";
      params.push(category_id);
    }

    if (search) {
      query += " AND (p.name LIKE ? OR p.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY p.created_at DESC";

    const stmt = db.prepare(query);
    const products = stmt.all(...params);

    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single product
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ? AND p.is_active = 1
    `);

    const product = stmt.get(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new product
router.post("/", (req, res) => {
  try {
    const { name, description, price, category_id, image_url, stock } =
      req.body;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const stmt = db.prepare(`
      INSERT INTO products (name, description, price, category_id, image_url, stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      description,
      price,
      category_id,
      image_url,
      stock || 0
    );

    // Get the created product
    const getStmt = db.prepare("SELECT * FROM products WHERE id = ?");
    const newProduct = getStmt.get(result.lastInsertRowid);

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update product
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      category_id,
      image_url,
      stock,
      is_active,
    } = req.body;

    const stmt = db.prepare(`
  UPDATE products 
  SET name = ?, description = ?, price = ?, category_id = ?, 
      image = ?, stock_quantity = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
  WHERE id = ?
`);

    const result = stmt.run(
      name,
      description,
      price,
      category_id,
      image,
      stock,
      is_active,
      id
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Get updated product
    const getStmt = db.prepare("SELECT * FROM products WHERE id = ?");
    const updatedProduct = getStmt.get(id);

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete product (soft delete)
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare("UPDATE products SET is_active = 0 WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
