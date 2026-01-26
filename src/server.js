import express from "express";
import cors from "cors";
import "dotenv/config";

import { prisma } from "./config/db.js";

const app = express();

app.use(cors());

// Body parsing middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "API running on PORT: " + process.env.PORT });
});

app.get("/users", async (req, res) => {
  const dataUsers = await prisma.user.findMany();

  return res.json({
    success: true,
    message: "Success get data users",
    data: {
      users: dataUsers,
    },
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
