// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const userRoutes = require("./routes/users");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Sample route
app.get("/", (req, res) => res.send("API running"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
