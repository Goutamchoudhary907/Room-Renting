"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const email_service_1 = require("./email-service");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dist_1 = require("../../../schema/dist");
router.post("/auth/forgot-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body;
    const result = dist_1.forgotPasswordInput.safeParse(email);
    if (!result.success) {
        console.log("Result error in forgot password", result.error.errors);
        const mappedErrors = {};
        result.error.errors.forEach((err) => {
            mappedErrors["email"] = result.error.errors[0].message;
        });
        return res.status(400).json({
            errors: mappedErrors,
        });
    }
    try {
        const user = yield prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
            },
        });
        if (!user) {
            return res.status(400).json({
                message: "User not found with this email",
            });
        }
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the env");
        }
        const resetToken = jsonwebtoken_1.default.sign({ user: user.email }, JWT_SECRET, {
            expiresIn: "10m",
        });
        yield prisma.user.update({
            where: { id: user.id },
            data: { reset: resetToken },
        });
        const resetLink = `http://localhost:3000/auth/reset-password?token=${resetToken}`;
        yield (0, email_service_1.sendEmail)({
            to: email,
            subject: "Reset password requested",
            from: "goutamchoudhary90768@gmail.com",
            html: `
        <p>Click the following link to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        `,
        });
        res.status(200).json("Password reset email send");
    }
    catch (error) {
        console.error("Error during forgot password", error);
        if (error instanceof Error) {
            res.status(500).json({
                message: "Forgot password request failde due to intenal server error.",
                errorCode: "INTERNAL_SERVER_ERROR",
                details: error.message,
            });
        }
        else {
            res.status(500).json({
                message: "Forgot password request failde due to intenal server error.",
                errorCode: "INTERNAL_SERVER_ERROR",
                details: "An unknown error occurred",
            });
        }
        res.status(500).json("Error sending email");
    }
}));
router.post("/reset-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password, confirmPassword } = req.body;
    try {
        const result = dist_1.resetPasswordInput.safeParse({ password, confirmPassword });
        if (!result.success) {
            const mappedErrors = {};
            result.error.errors.forEach((err) => {
                mappedErrors[err.path[0]] = err.message;
            });
            res.status(400).json({ errors: mappedErrors });
            return;
        }
        if (!JWT_SECRET) {
            res.status(500).json({ message: "Internal server error" });
            return;
        }
        //  verify token
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const userEmail = decoded.user;
        //  find user
        const user = yield prisma.user.findUnique({
            where: {
                email: userEmail,
            },
            select: {
                id: true,
                reset: true,
            },
        });
        if (!user) {
            res.status(400).json({
                message: "User not found with this email",
            });
            return;
        }
        //  verify token in database
        if (user.reset !== token) {
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        //  Hash Password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        //  Update Password and clear token
        yield prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword,
                reset: null,
            },
        });
        res.status(200).json({
            message: "Password reset successful",
        });
    }
    catch (error) {
        console.error("Error", error);
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            console.error("JWT Error Details:", error.message);
            res.status(401).json({ message: "Invalid token" });
            return;
        }
        // Handle other errors (Prisma errors, bcrypt errors, etc.)
        if (error.code === "P2025") {
            // prisma not found error
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(500).json({ message: "Internal server error" });
    }
}));
router.get("/reset-password", (req, res) => {
    const token = req.query.token;
    if (!token) {
        res.status(400).send("Missing token");
        return;
    }
    const redirectURL = `http://localhost:5173/reset-password?token=${token}`;
    console.log("Redirecting to:", redirectURL); // Log this!
    res.redirect(redirectURL);
});
exports.default = router;
