require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");

// Connect to MongoDB
connectDB();

const app = express();

// --- Core middleware ---
app.use(helmet()); // sets a batch of security-related HTTP headers
app.use(cors());
app.use(express.json()); // parse JSON request bodies
app.use(morgan("dev")); // request logging: METHOD /path status time

// --- Health check route ---
app.get("/", (req, res) => {
  res.json({ message: "TCC Blog Platform API is running" });
});

// --- Feature routes ---
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// --- Error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
