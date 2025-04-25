import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const bookSlot = async (req, res) => {
  try {
    if (req.user.role !== "USER") {
      return res.status(403).json({ message: "Only users can book slots" });
    }

    const { slotId } = req.body;
    console.log(slotId);
    //check slot exist
    const slot = await prisma.slot.findUnique({ where: { id: slotId } });
    console.log(slot);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    //create booking
    const booking = await prisma.booking.create({
      data: {
        slotId,
        userId: req.user.id,
      },
    });

    res.status(201).json({ message: "booking successful", booking });
  } catch (error) {
    return res.status(500).json({ message: "Internal server Error" });
  }
};
