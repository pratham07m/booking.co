import express from "express";
import { createSlot } from "../controllers/slot.controller.js";
import { authenticate } from "../middlewares/auth.middlewares.js";
import { getAllSlot } from "../controllers/slot.controller.js";

const router = express.Router();
router.post("/createslots", authenticate, createSlot);

router.get("/all", authenticate, getAllSlot);

export default router;
