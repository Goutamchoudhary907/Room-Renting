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
const index_1 = require("../../../schema/dist/index");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const middleware_1 = require("../middleware/middleware");
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = index_1.signupInput.safeParse(body);
    if (!result.success) {
        console.log("result.error.errors:", result.error.errors);
        const mappedErrors = {};
        result.error.errors.forEach((err) => {
            mappedErrors[err.path[0]] = err.message;
        });
        return res.status(400).json({
            // message: "Incorrect inputs",
            errors: mappedErrors,
        });
    }
    try {
        const { email } = result.data;
        const existingUser = yield prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (existingUser) {
            return res.status(409).json({
                message: "This email is already registered.",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(result.data.password, 10);
        const newUser = yield prisma.user.create({
            data: {
                firstName: result.data.firstName,
                lastName: result.data.lastName,
                email: result.data.email,
                password: hashedPassword,
            },
        });
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the env");
        }
        const token = jsonwebtoken_1.default.sign({
            userId: newUser.id,
            email: newUser.email,
        }, JWT_SECRET);
        res.status(201).json({ message: "Signup successful", token });
    }
    catch (error) {
        console.error("Error during signup:", error);
        if (error instanceof Error) {
            res.status(500).json({
                message: "Signup failed due to an internal server error.",
                errorCode: "INTERNAL_SERVER_ERROR",
                details: error.message,
            });
        }
        else {
            res.status(500).json({
                message: "Signup failed due to an internal server error.",
                errorCode: "INTERNAL_SERVER_ERROR",
                details: "An unknown error occurred.",
            });
        }
    }
    finally {
        yield prisma.$disconnect();
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const result = index_1.signinInput.safeParse(body);
    if (!result.success) {
        return res.status(400).json({
            // message: "Incorrect inputs",
            errors: result.error.errors,
        });
    }
    try {
        const user = yield prisma.user.findUnique({
            where: {
                email: body.email,
            },
        });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const passwordMatch = yield bcrypt_1.default.compare(body.password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the env");
        }
        const token = jsonwebtoken_1.default.sign({
            userId: user.id,
            email: user.email,
        }, JWT_SECRET);
        res.status(200).json({ message: "Signin successful", token });
    }
    catch (error) {
        console.error("Error during signup:", error);
        if (error instanceof Error) {
            res.status(500).json({
                message: "Signin failed due to an internal server error.",
                errorCode: "INTERNAL_SERVER_ERROR",
                details: error.message,
            });
        }
        else {
            // if error is not of type Error then general error message 
            res.status(500).json({
                message: "Signin failed due to an internal server error.",
                errorCode: "INTERNAL_SERVER_ERROR",
                details: "An unknown error occurred.",
            });
        }
    }
    finally {
        yield prisma.$disconnect();
    }
}));
router.get("/test", middleware_1.authMiddleware, (req, res) => {
    res.json({
        message: "Middleware works"
    });
});
exports.default = router;
