"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = require("../models/userSchema");
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).send({
                success: false,
                message: "Unauthorized User",
            });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await userSchema_1.User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).send({
                success: false,
                message: "User not found or invalid token",
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
exports.protect = protect;
