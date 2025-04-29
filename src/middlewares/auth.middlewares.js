import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authenticate = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "invalid credentials" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = decoded;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(409).json({ message: "invalid user" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "invalid token" });
  }
};
