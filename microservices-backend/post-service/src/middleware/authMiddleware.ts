import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { User } from "../models/userSchema";

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1]
        }

        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized User",
            });
        }

        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string)

        const user = await User.findById(decoded.id).select("-password")

        if (!user) {
            return res.status(401).send({
                success: false,
                message: "User not found or invalid token",
            });
        }

        (req as any).user = user
        next()
    } catch (error: any) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
        });
    }
}