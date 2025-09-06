import bcrypt from "bcryptjs";
import { db, init } from "./db.js";

// Initialize database first
init();

async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
    
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, role, is_verified)
      VALUES (?, ?, ?, 'admin', 1)
    `);
    
    stmt.run("Admin", "admin@digitalmarket.com", hashedPassword);
    
    console.log("Admin user created successfully!");
    console.log("Email: admin@digitalmarket.com");
    console.log("Password: admin123");
    
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

// Run seeder
createAdmin();