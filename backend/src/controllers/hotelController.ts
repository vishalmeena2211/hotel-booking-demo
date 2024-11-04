import { Request, Response } from 'express';
import prisma from '../lib/prisma';


export const getHotels = async (req: Request, res: Response) => {
    try {
        const hotels = await prisma.hotel.findMany();
        res.status(200).json(hotels);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hotels' });
    }
};

export const getHotelById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const hotel = await prisma.hotel.findUnique({
            where: { id: Number(id) },
        });
        if (hotel) {
            res.status(200).json(hotel);
        } else {
            res.status(404).json({ error: 'Hotel not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch hotel' });
    }
};

export const createHotel = async (req: Request, res: Response) => {
    const { name, location, rating } = req.body;
    try {
        const newHotel = await prisma.hotel.create({
            data: {
                name,
                location,
            },
        });
        res.status(201).json(newHotel);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create hotel' });
    }
};

export const updateHotel = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, location } = req.body;
    try {
        const updatedHotel = await prisma.hotel.update({
            where: { id: Number(id) },
            data: {
                name,
                location,
            },
        });
        res.status(200).json(updatedHotel);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update hotel' });
    }
};

export const deleteHotel = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.hotel.delete({
            where: { id: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete hotel' });
    }
};