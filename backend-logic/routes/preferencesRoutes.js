// routes/preferences.js
import express from "express";

import { savePreferences } from "../controllers/preferenceController.js";

const router = express.Router();

// Save user preferences
router.post("/", savePreferences);

export default router;
