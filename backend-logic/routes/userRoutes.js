import express from "express";
import { registerUser, loginUser } from "../controllers/userController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

// API routes only
router.post("/register", registerUser);
router.post("/login", loginUser);

// Route to check token validity
router.get("/verify", verifyToken, (req, res) => {
  // res.status(200).json({ message: "Token is valid", user: req.user });
  res.status(200).json({ isValid: true });
});

export default router;
