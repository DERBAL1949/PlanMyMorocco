import express from "express";
import userRouter from "./userRoutes.js";
import cityRouter from "./cityRoutes.js";
import placeRouter from "./placeRoutes.js";

const router = express.Router();
// organizing api
router.use("/users", userRouter);
router.use("/cities", cityRouter);
router.use("/places", placeRouter);
// export router
export default router;
