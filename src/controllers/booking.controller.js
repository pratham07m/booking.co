import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// user book a slot
export const bookSlot = async (req, res) => {
  try {
    if (req.user.role !== "USER") {
      return res.status(403).json({ message: "Only users can book slots" });
    }

    const { slotId } = req.body;
    //check slot exist
    const slot = await prisma.slot.findUnique({ where: { id: slotId } });
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

// get all user booking slots
export const getuserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        slot: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// cancel booking slot
export const cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;
    const userId = req.user.id;
    
    // find bookings
    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
    });

    if (!bookingId)
      return res.status(404).json({ message: "booking not found" });

    //check only user book user can cancel slot
    if (booking.userId !== userId)
      return res
        .ststus(403)
        .json({ message: "you cannot cancel this booking" });

    // delete booking
    await prisma.booking.delete({
      where: { id: Number(bookingId) },
    });

    res.status(200).json({ message: "booking cancelld successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};
