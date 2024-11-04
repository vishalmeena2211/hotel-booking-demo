import { Request, Response } from 'express';
import prisma from '../lib/prisma';

// Define interfaces for the request objects
interface NewAuthRequest extends Request {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}

interface CreateBookingRequest extends NewAuthRequest {
    body: {
        userId: string;
        hotelId: string;
        startDate: string;
        endDate: string;
        members: string;
    };
}

interface UpdateBookingRequest extends NewAuthRequest {
    body: {
        startDate: string;
        endDate: string;
        status: "PENDING" | "APPROVED" | "REJECTED";
    };
}

interface UpdateBookingStatusRequest extends NewAuthRequest {
    body: {
        status: "PENDING" | "APPROVED" | "REJECTED";
    };
}

interface GetBookingsByStatus extends NewAuthRequest {
    params: {
        status: "PENDING" | "APPROVED" | "REJECTED";
    };
}

// Create a new booking
export const createBooking = async (req: CreateBookingRequest, res: Response) => {
    const { userId, hotelId, startDate, endDate, members } = req.body;

    // Parse members JSON string into an array of objects
    const parsedMembers: {
        name: string;
        aadharNumber: string;
    }[] = JSON.parse(members);
    console.log({
        userId,
        hotelId,
        startDate,
        endDate,
        parsedMembers
    })

    // Check for missing required fields
    if (!userId || !hotelId || !startDate || !endDate || !members) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        // Find user by ID
        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Find hotel by ID
        const hotel = await prisma.hotel.findUnique({ where: { id: Number(hotelId) } });
        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        // Check for missing member images
        if (!req.files) {
            return res.status(400).json({ error: 'Missing members images' });
        }

        // Map member images to their respective paths
        const membersImages = Array.isArray(req.files) ? req.files.map((file: Express.Multer.File) => file.path) : [];
        if (membersImages.length !== parsedMembers.length) {
            return res.status(400).json({ error: 'Number of images does not match number of members' });
        }

        // Create a new booking
        const booking = await prisma.booking.create({
            data: {
                userId: Number(userId),
                hotelId: Number(hotelId),
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                members: {
                    create: parsedMembers.map((member, index) => {
                        if (!member.name || !member.aadharNumber) {
                            throw new Error('Each member must have a name and an Aadhar number');
                        }
                        return {
                            name: member.name,
                            aadharNumber: member.aadharNumber,
                            aadharPhotoUrl: membersImages[index] || null, // Handle missing images
                        };
                    }),
                },
            },
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create booking', message: error });
    }
};

// Get all bookings for the authenticated user
export const getBookings = async (req: NewAuthRequest, res: Response) => {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        aadharNumber: true,
                        aadharPhotoUrl: true,
                    }
                },
                hotel: true,
                members: true,
            },
            where: {
                userId: req.user.id
            }
        });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
};

// Get bookings by status
export const getBookingsByStatus = async (req: GetBookingsByStatus, res: Response) => {
    const { status } = req.params;

    // Check for missing status
    if (!status) {
        return res.status(400).json({ error: 'Missing booking status' });
    }

    try {
        const bookings = await prisma.booking.findMany({
            where: { status },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        aadharNumber: true,
                        aadharPhotoUrl: true,
                    }
                },
                hotel: true,
                members: true,
            },
        });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookings by status' });
    }
};

// Get booking by ID
export const getBookingById = async (req: NewAuthRequest, res: Response) => {
    const { id } = req.params;

    // Check for missing booking ID
    if (!id) {
        return res.status(400).json({ error: 'Missing booking ID' });
    }

    try {
        const booking = await prisma.booking.findUnique({
            where: { id: Number(id) },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                        aadharNumber: true,
                        aadharPhotoUrl: true,
                    }
                },
                hotel: true,
                members: true,
            },
        });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found' });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch booking' });
    }
};

// Update booking details
export const updateBooking = async (req: UpdateBookingRequest, res: Response) => {
    const { id } = req.params;
    const { startDate, endDate, status } = req.body;

    // Check for missing required fields
    if (!id || !startDate || !endDate || !status) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const booking = await prisma.booking.update({
            where: { id: Number(id) },
            data: {
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status,
            },
        });

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking' });
    }
};

// Delete a booking
export const deleteBooking = async (req: NewAuthRequest, res: Response) => {
    const { id } = req.params;

    // Check for missing booking ID
    if (!id) {
        return res.status(400).json({ error: 'Missing booking ID' });
    }

    try {
        await prisma.booking.delete({
            where: { id: Number(id) },
        });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete booking' });
    }
};

// Update booking status
export const updateBookingStatus = async (req: UpdateBookingStatusRequest, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    // Check for missing booking ID or status
    if (!id || !status) {
        return res.status(400).json({ error: 'Missing booking ID or status' });
    }

    // Validate status
    if (!['APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        const booking = await prisma.booking.update({
            where: { id: Number(id) },
            data: { status },
        });

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update booking status', msg: error });
    }
};
