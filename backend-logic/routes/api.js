import express from "express";
import userRouter from "./userRoutes.js";

const router = express.Router();
// organizing api
router.use("/users", userRouter);

// export router
export default router;
