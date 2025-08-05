// routes/cityRoutes.js
import express from "express";
import { createCity, getAllCities } from "../controllers/cityController.js";

const router = express.Router();

// POST /v1/cities
router.post("/", createCity);

// GET /v1/cities
router.get("/", getAllCities);

export default router;
