import { Request, Response } from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

dotenv.config();

export const signUp = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, email, password } = req.body;

        const checkExistance = await prisma.user.findUnique({ where: { email } });
        if (checkExistance) {
            return res.status(401).json({
                success: false,
                message: "Account already exist with this email address"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const savedData = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,

            }
        });
        console.log("Data saved successfully");
        savedData.password = undefined;

        return res.status(200).json({
            success: true,
            message: "Data saved successfully",
            data: savedData,
        });

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: `Error while signup ${(error as Error).message}`
        });
    }
}

export const login = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;

        let isUser = await prisma.user.findUnique({ where: { email } });
        if (!isUser) {
            return res.status(401).json({
                success: false,
                message: "No User Exist"
            });
        }

        const checkPassword = isUser.password && await bcrypt.compare(password, isUser.password);
        if (checkPassword) {
            const payload = {
                id: isUser.id,
                email: isUser.email,
                name: isUser.name,
                role: isUser.role,
                aadharNumber: isUser.aadharNumber,
                aadharPhotoUrl: isUser.aadharPhotoUrl,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "30d" });
            isUser.password = undefined;
            console.log("Login successfully");
            return res.status(200).json({
                success: true,
                message: "Login successful",
                data: {
                    user: isUser,
                    token
                }
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "Wrong password"
            });
        }
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: `Error when trying to log in ${(error as Error).message}`
        });
    }
}