import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { db } from "../db.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "secret_key";

// --- Register (User only) ---
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name)
      return res.status(400).json({ error: "Name, email, password required" });

    // Check if user exists
    const exists = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (exists)
      return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const stmt = db.prepare(`
      INSERT INTO users (name, email, password, role, is_verified, verification_code, code_expires)
      VALUES (?, ?, ?, 'user', 0, ?, ?)
    `);
    stmt.run(name, email, hashedPassword, verificationCode, codeExpires.toISOString());

    // Send verification email
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Digitalmarket" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email - Digitalmarket",
      html: `
        <h2>Email Verification</h2>
        <p>Your verification code is: <strong>${verificationCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    res.status(201).json({ 
      message: "User registered. Please check your email for verification code.",
      email: email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Verify Email with Code ---
router.post("/verify-email", async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) 
      return res.status(400).json({ error: "Email and verification code required" });

    const user = db.prepare("SELECT * FROM users WHERE email = ? AND verification_code = ?").get(email, code);
    
    if (!user) 
      return res.status(400).json({ error: "Invalid verification code" });

    // Check if code is expired
    const now = new Date();
    const codeExpires = new Date(user.code_expires);
    
    if (now > codeExpires) 
      return res.status(400).json({ error: "Verification code has expired" });

    // Verify user
    const stmt = db.prepare(`
      UPDATE users 
      SET is_verified = 1, verification_code = NULL, code_expires = NULL 
      WHERE id = ?
    `);
    stmt.run(user.id);

    res.json({ message: "Email verified successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Login (Admin & User) ---
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) 
      return res.status(400).json({ error: "Email and password required" });

    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
    if (!user) 
      return res.status(400).json({ error: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) 
      return res.status(400).json({ error: "Invalid credentials" });

    // Check if user is verified (except for admin)
    if (!user.is_verified && user.role === "user")
      return res.status(403).json({ error: "Email not verified" });

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- Resend Verification Code ---
router.post("/resend-code", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) 
      return res.status(400).json({ error: "Email required" });

    const user = db.prepare("SELECT * FROM users WHERE email = ? AND is_verified = 0").get(email);
    if (!user) 
      return res.status(400).json({ error: "User not found or already verified" });

    // Generate new verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const codeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const stmt = db.prepare(`
      UPDATE users 
      SET verification_code = ?, code_expires = ? 
      WHERE id = ?
    `);
    stmt.run(verificationCode, codeExpires.toISOString(), user.id);

    // Send verification email
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Digitalmarket" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "New Verification Code - Digitalmarket",
      html: `
        <h2>New Verification Code</h2>
        <p>Your new verification code is: <strong>${verificationCode}</strong></p>
        <p>This code will expire in 10 minutes.</p>
      `,
    });

    res.json({ message: "New verification code sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;