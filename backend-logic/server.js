import express from "express";
// import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import apiRoutes from "./routes/api.js";
import connectDB from "./config/database.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ensuring that backend work on vercel
app.get("/", (_, res) => {
  res.send("Welcome to Plan My Morocco API!");
});
// Routes
app.use("/v1", apiRoutes);

// Connect DB and start server
// connectDB().then(() => {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// });

// here we did listen then connect on db not like first
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);

  connectDB()
    .then(() => {
      console.log("✅ Connected to MongoDB");
    })
    .catch((err) => {
      console.error("❌ MongoDB connection failed:", err.message);
    });
});
