// routes/cityRoutes.js
import express from "express";
import {
  // createCity,
  getAllCities,
  getPlaces,
} from "../controllers/cityController.js";

const router = express.Router();

// POST /v1/cities
// router.post("/", createCity);

// GET /v1/cities  --> for getting all cities in the dropdown UI
router.get("/", getAllCities);

// @route   GET /api/cities/:id--> get one city with its places
router.get("/:id", getPlaces);

// // @route   PUT /api/cities/:id
// router.put("/:id", updateCity);

// // @route   DELETE /api/cities/:id
// router.delete("/:id", deleteCity);

export default router;
