import { PrismaClient } from "@prisma/client";
import Joi from "joi";

const prisma = new PrismaClient();

const createSlotSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  date: Joi.date().required(),
  duration: Joi.number().integer().optional(),
});

export const createSlot = async (req, res) => {
  try {
    const { error } = createSlotSchema.validate(req.body);
    if (error)
      return res.status(403).json({ message: error.details[0].message });

    if (req.user.role !== "ORGANIZER") {
      return res
        .status(400)
        .json({ message: "only  Organizers can create a slots" });
    }

    const { title, description, date, duration } = req.body;

    const newSloat = await prisma.slot.create({
      data: {
        title,
        description,
        date: new Date(date),
        duration,
        organizerId: req.user.id,
      },
    });

    res
      .status(201)
      .json({ message: "slot create successfully", slot: newSloat });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

// get all the slot
export const getAllSlot = async (req, res) => {
  try {
    const slot = await prisma.slot.findMany({
      where: { date: { gte: new Date() } },
      include: { organizer: { select: { id: true, name: true } } },
    });

    res.status(200).json({ slot });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
