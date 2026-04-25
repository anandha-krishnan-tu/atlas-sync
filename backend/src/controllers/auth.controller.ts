import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTP } from "../services/email.service";

export async function signup(req: any, res: any) {

    try {

        const {
            name,
            email,
            password
        } = req.body;

        const existing =
            await prisma.user.findUnique({
                where: { email }
            });

        if (existing) {

            if (!existing.otpVerified) {

                const otp =
                    Math.floor(
                        100000 + Math.random() * 900000
                    ).toString();

                console.log("OTP:", otp);

                await prisma.otpCode.create({
                    data: {
                        email,
                        code: otp,
                        expiresAt: new Date(
                            Date.now() + 10 * 60 * 1000
                        )
                    }
                });

                await sendOTP(email, otp);

                return res.json({
                    message: "OTP resent"
                });
            }

            return res.status(400).json({
                message: "User already exists"
            });

        }

        const hashed =
            await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                otpVerified: false
            }
        });

        const otp =
            Math.floor(
                100000 + Math.random() * 900000
            ).toString();

        await prisma.otpCode.create({
            data: {
                email,
                code: otp,
                expiresAt: new Date(
                    Date.now() + 10 * 60 * 1000
                )
            }
        });

        await sendOTP(email, otp);

        res.json({
            message: "OTP sent"
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Signup failed"
        });
    }

}

export async function verifyOTP(
    req: any,
    res: any
) {

    const { email, code } = req.body;

    const record =
        await prisma.otpCode.findFirst({
            where: {
                email,
                code
            }
        });

    if (!record) {
        return res.status(400).json({
            message: "Invalid OTP"
        });
    }

    if (record.expiresAt < new Date()) {
        return res.status(400).json({
            message: "OTP expired"
        });
    }

    await prisma.user.update({
        where: { email },
        data: {
            otpVerified: true
        }
    });

    res.json({
        message: "Verified"
    });

}

export async function login(
    req: any,
    res: any
) {

    const {
        email,
        password
    } = req.body;

    const user =
        await prisma.user.findUnique({
            where: { email }
        });

    if (!user) {
        return res.status(400).json({
            message: "No user"
        });
    }

    if (!user.otpVerified) {
        return res.status(400).json({
            message: "Verify OTP first"
        });
    }

    const valid =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!valid) {
        return res.status(400).json({
            message: "Wrong password"
        });
    }

    const token =
        jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET!,
            { expiresIn: "7d" }
        );

    res.json({
        token,
        user
    });

}