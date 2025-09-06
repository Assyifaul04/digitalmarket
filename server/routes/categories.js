import express from "express";
import { db } from "../db.js";

const router = express.Router();

// Get all categories
router.get("/", (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT c.*, COUNT(p.id) as product_count 
      FROM categories c 
      LEFT JOIN products p ON c.id = p.category_id AND p.is_active = 1
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    const categories = stmt.all();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get single category
router.get("/:id", (req, res) => {
  try {
    const { id } = req.params;

    const stmt = db.prepare("SELECT * FROM categories WHERE id = ?");
    const category = stmt.get(id);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Create new category
router.post("/", (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const stmt = db.prepare(
      "INSERT INTO categories (name, description) VALUES (?, ?)"
    );

    try {
      const result = stmt.run(name, description);

      // Get the created category
      const getStmt = db.prepare("SELECT * FROM categories WHERE id = ?");
      const newCategory = getStmt.get(result.lastInsertRowid);

      res.status(201).json(newCategory);
    } catch (dbError) {
      if (dbError.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return res.status(400).json({ error: "Category name already exists" });
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update category
router.put("/:id", (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Category name is required" });
    }

    const stmt = db.prepare(
      "UPDATE categories SET name = ?, description = ? WHERE id = ?"
    );

    try {
      const result = stmt.run(name, description, id);

      if (result.changes === 0) {
        return res.status(404).json({ error: "Category not found" });
      }

      // Get updated category
      const getStmt = db.prepare("SELECT * FROM categories WHERE id = ?");
      const updatedCategory = getStmt.get(id);

      res.json(updatedCategory);
    } catch (dbError) {
      if (dbError.code === "SQLITE_CONSTRAINT_UNIQUE") {
        return res.status(400).json({ error: "Category name already exists" });
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete category
router.delete("/:id", (req, res) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const checkStmt = db.prepare(
      "SELECT COUNT(*) as count FROM products WHERE category_id = ? AND is_active = 1"
    );
    const { count } = checkStmt.get(id);

    if (count > 0) {
      return res.status(400).json({
        error:
          "Cannot delete category with active products. Please remove or reassign products first.",
      });
    }

    const stmt = db.prepare("DELETE FROM categories WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
