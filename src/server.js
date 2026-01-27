import express from "express";
import cors from "cors";
import "dotenv/config";

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import mustahikRoutes from "./routes/mustahikRoutes.js";

const app = express();

app.use(cors());

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/auth", authRoutes);
app.use("/api/mustahik", mustahikRoutes);

// Access Public Folder
app.use(express.static("public"));

// Access File Upload
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.json({ message: "API running on PORT: " + process.env.PORT });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
