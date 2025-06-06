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

    // add socket
    const io = req.app.get("io");
    io.emit("bookingCreated", {
      message: "A new Booking Created",
      booking,
    });

    res.status(201).json({ message: "booking successful", booking });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

// get all user booking slots
export const getuserBookings = async (req, res) => {
  try {
    const userId = req.user.id;

    if (req.user.role !== "USER") {
      return res.status(403).json({ message: "Only users can book slots" });
    }

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
    if (req.user.role !== "USER") {
      return res.status(403).json({ message: "Only users can book slots" });
    }

    const bookingId = req.params.bookingId;
    const userId = req.user.id;

    // find bookings
    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
    });

    if (!booking) return res.status(404).json({ message: "booking not found" });

    //check only user book user can cancel slot
    if (booking.userId !== userId)
      return res
        .status(403)
        .json({ message: "you cannot cancel this booking" });

    const io = req.app.get("io");
    io.emit("bookingCancelled", {
      message: "A booking was cancelled",
      bookingId: booking.id,
      slotId: booking.slotId,
      userId: booking.userId,
    });

    // delete booking
    await prisma.booking.delete({
      where: { id: Number(bookingId) },
    });

    res.status(200).json({ message: "booking cancelld successfully" });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
};

// get Organizer Bookings
export const getOrganizerBookings = async (req, res) => {
  try {
    if (req.user.role !== "ORGANIZER") {
      return res.status(404).json({ message: "you cannot show bookings " });
    }
    const slots = await prisma.slot.findMany({
      where: {
        organizerId: req.user.id,
      },
      include: {
        Booking: true,
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    return res.status(200).json({ slots });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

// get booking details
export const getBookingDetails = async (req, res) => {
  try {
    if (req.user.role !== "USER") {
      return res.status(404).json({ message: "you can't see users bookings" });
    }
    const { bookingId } = req.params;

    const booking = await prisma.booking.findUnique({
      where: { id: Number(bookingId) },
      include: {
        slot: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    if (!booking) {
      return res.status(404).json({ message: "booking not found" });
    }
    return res.status(200).json({ message: { booking } });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};
