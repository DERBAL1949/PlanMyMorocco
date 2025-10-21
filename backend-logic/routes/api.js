import express from "express";
import userRouter from "./userRoutes.js";
import cityRouter from "./cityRoutes.js";
import placeRouter from "./placeRoutes.js";
import preferenceRouter from "./preferencesRoutes.js";

const router = express.Router();
// organizing api
router.use("/users", userRouter);
router.use("/cities", cityRouter);
router.use("/places", placeRouter);
router.use("/preferences", preferenceRouter);
router.use("/generateplan", placeRouter);

// export router
export default router;
