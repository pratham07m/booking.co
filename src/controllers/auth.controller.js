import Joi from "joi";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// SignUP
const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().min(10).max(15).required(),
  role: Joi.string().valid("USER", "ORGANIZER", "ADMIN").required(),
});

export const SignUp = async (req, res) => {
  try {
    const { error } = signupSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { name, email, password, phone, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const newuser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedpassword,
        phone,
        role,
      },
    });

    //   const token = jwt.sign(
    //     { userId: newuser.id, role: newuser.role },
    //     process.env.JWT_SECRET,
    //     { expiresIn: process.env.JWT_EXPIRY || "7d" }
    //   );

    //   res.cookie("token", token , {
    //     expires: new Date(Date.now() + 8 * 3600000),
    // });

    res.status(201).json({
      message: "User registered successfully",
      userId: newuser.id,
      name: newuser.name,
      role: newuser.role,
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const Login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password " });
    }

    const validatePass = await bcrypt.compare(password, user.password);
    if (!validatePass) {
      res.status(401).json({ message: "invalid password" });
    }

    // sent cookie
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRY || "7d" }
    );

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.status(200).json({
      message: "Login successful",
      Id: user.id,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
