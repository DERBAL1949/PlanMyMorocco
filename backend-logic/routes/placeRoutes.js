// routes/placeRoutes.js
import express from "express";
import { generatePlan } from "../controllers/placeController.js";

const router = express.Router();

router.get("/:userId", generatePlan);

export default router;
