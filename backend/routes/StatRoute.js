import express from "express";
import { getDashboardStats } from "../controllers/StatController.js";
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/dashboard", verifyUser, getDashboardStats);

export default router;
