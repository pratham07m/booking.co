import express from "express";
import { SignUp, Login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", SignUp);
router.post("/login", Login);

export default router;
