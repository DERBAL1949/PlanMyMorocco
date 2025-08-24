// routes/placeRoutes.js
import express from "express";
import {
  // createPlace,
  getPlaces,
} from "../controllers/placeController.js";

const router = express.Router();

// // POST /v1/places
// // router.post("/", createPlace);

// // GET /v1/places/:cityId
router.get("/:id", getPlaces);

export default router;
