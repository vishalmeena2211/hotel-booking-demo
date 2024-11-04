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

export const updateUser = async (req: NewAuthRequest, res: Response) => {
    const { id } = req.user;
    const { aadharNumber } = req.body;
    console.log(req.files);
    console.log(req.body);

    try {
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: {
                imageUrl: (req.files as { [fieldname: string]: Express.Multer.File[] }).profile[0].path,
                aadharNumber,
                aadharPhotoUrl: (req?.files as { [fieldname: string]: Express.Multer.File[] }).aadhar[0].path,
            },
        });

        res.status(200).json({
            imageUrl: updatedUser.imageUrl,
            aadharNumber: updatedUser.aadharNumber,
            aadharPhotoUrl: updatedUser.aadharPhotoUrl,
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update user', msg: error });
    }
};