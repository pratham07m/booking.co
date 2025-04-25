import express from "express"
import { bookSlot } from "../controllers/booking.controller.js"
import { authenticate } from "../middlewares/auth.middlewares.js"

const router = express.Router();

router.post("/book" , authenticate , bookSlot);

export default router