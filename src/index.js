import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import http from "http";

import authRoutes from "./routes/auth.routes.js";
import slotrouter from "./routes/slot.routes.js";
import bookingrouter from "../src/routes/booking.routes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("io", io);
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
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
