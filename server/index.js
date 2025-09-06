import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { init } from "./db.js";
import './seed.js'; // Import seeder to create admin

import cartRouter from "./routes/cart.js";
import categoriesRouter from "./routes/categories.js";
import productsRouter from "./routes/products.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT_BACKEND || 4000;

// --- CORS: harus sebelum route ---
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true, // penting jika mau handle cookies
}));

app.use(express.json());

// Init database
init();

// Routes
app.use("/api/auth", authRouter);
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/cart", cartRouter);

// Health check endpoint
app.get("/api/hello", (req, res) =>
  res.json({ message: "Digitalmarket backend berjalan 🚀" })
);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
  console.log(`Admin credentials: admin@digitalmarket.com / admin123`);
});