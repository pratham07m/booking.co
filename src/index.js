import express from "express";
// import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";

import slotrouter from "./routes/slot.routes.js";

import bookingrouter from "../src/routes/booking.routes.js";

dotenv.config();

const app = express();
// app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes

//Login , signUP
app.use("/api/auth", authRoutes);

//slot creation
app.use("/api/slots", slotrouter);

//book slot
app.use("/api/booking", bookingrouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
