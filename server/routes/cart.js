import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Get cart items for a session
router.get("/:sessionId", (req, res) => {
  try {
    const { sessionId } = req.params;

    const stmt = db.prepare(`
      SELECT 
        ci.id,
        ci.quantity,
        ci.session_id,
        p.id as product_id,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.stock,
        c.name as category_name,
        (ci.quantity * p.price) as total_price
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE ci.session_id = ? AND p.is_active = 1
      ORDER BY ci.created_at DESC
    `);

    const cartItems = stmt.all(sessionId);

    // Calculate total
    const total = cartItems.reduce((sum, item) => sum + item.total_price, 0);

    res.json({
      items: cartItems,
      total: total,
      count: cartItems.length,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add item to cart
router.post("/", (req, res) => {
  try {
    const { product_id, quantity = 1, session_id } = req.body;

    if (!product_id || !session_id) {
      return res
        .status(400)
        .json({ error: "Product ID and session ID are required" });
    }

    // Check if product exists and is active
    const productStmt = db.prepare(
      "SELECT * FROM products WHERE id = ? AND is_active = 1"
    );
    const product = productStmt.get(product_id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if item already exists in cart
    const existingStmt = db.prepare(
      "SELECT * FROM cart_items WHERE product_id = ? AND session_id = ?"
    );
    const existingItem = existingStmt.get(product_id, session_id);

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity;

      // Check stock
      if (newQuantity > product.stock) {
        return res.status(400).json({
          error: `Not enough stock. Available: ${product.stock}`,
        });
      }

      const updateStmt = db.prepare(
        "UPDATE cart_items SET quantity = ? WHERE id = ?"
      );
      updateStmt.run(newQuantity, existingItem.id);

      res.json({ message: "Cart updated", item_id: existingItem.id });
    } else {
      // Check stock
      if (quantity > product.stock) {
        return res.status(400).json({
          error: `Not enough stock. Available: ${product.stock}`,
        });
      }

      // Add new item
      const insertStmt = db.prepare(
        "INSERT INTO cart_items (product_id, quantity, session_id) VALUES (?, ?, ?)"
      );
      const result = insertStmt.run(product_id, quantity, session_id);

      res
        .status(201)
        .json({
          message: "Item added to cart",
          item_id: result.lastInsertRowid,
        });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update cart item quantity
router.put("/:itemId", (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ error: "Quantity must be at least 1" });
    }

    // Get cart item with product info
    const getStmt = db.prepare(`
      SELECT ci.*, p.stock 
      FROM cart_items ci 
      JOIN products p ON ci.product_id = p.id 
      WHERE ci.id = ?
    `);
    const cartItem = getStmt.get(itemId);

    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    // Check stock
    if (quantity > cartItem.stock) {
      return res.status(400).json({
        error: `Not enough stock. Available: ${cartItem.stock}`,
      });
    }

    const updateStmt = db.prepare(
      "UPDATE cart_items SET quantity = ? WHERE id = ?"
    );
    const result = updateStmt.run(quantity, itemId);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json({ message: "Cart item updated" });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Remove item from cart
router.delete("/:itemId", (req, res) => {
  try {
    const { itemId } = req.params;

    const stmt = db.prepare("DELETE FROM cart_items WHERE id = ?");
    const result = stmt.run(itemId);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    console.error("Error removing cart item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Clear entire cart for session
router.delete("/session/:sessionId", (req, res) => {
  try {
    const { sessionId } = req.params;

    const stmt = db.prepare("DELETE FROM cart_items WHERE session_id = ?");
    const result = stmt.run(sessionId);

    res.json({
      message: `Cart cleared. ${result.changes} items removed.`,
      removed_count: result.changes,
    });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
