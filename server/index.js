import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db, init } from "./db.js";

import productsRouter from "./routes/products.js";
import categoriesRouter from "./routes/categories.js";
import cartRouter from "./routes/cart.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT_BACKEND || 4000;

app.use(cors());
app.use(express.json());

// Init database
init();

// Routes
app.use("/api/products", productsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/cart", cartRouter);

app.get("/api/hello", (req, res) =>
  res.json({ message: "Digitalmarket backend berjalan 🚀" })
);

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
