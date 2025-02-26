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
exports.authMiddleware = authMiddleware;
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Auth Middleware Called'); // Log middleware entry
        console.log('JWT_SECRET (Middleware):', JWT_SECRET); // Log JWT_SECRET
        const authHeader = req.headers['authorization'];
        console.log('authHeader:', authHeader);
        const token = authHeader && authHeader.split(' ')[1];
        console.log('token:', token);
        if (token == null) {
            console.log('Token is null'); // Log null token
            res.status(401).json({
                message: 'Unauthorized: Missing token'
            });
            return;
        }
        if (!JWT_SECRET) {
            console.log('JWT_SECRET not configured'); // Log missing JWT_SECRET
            res.status(500).json({ message: 'Internal Server Error: JWT_SECRET not configured' });
            return;
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            console.log('Decoded Payload:', decoded);
            req.user = decoded;
            next();
        }
        catch (err) {
            console.error('JWT Verification Error:', err); // Log full error object
            if (err.name === 'TokenExpiredError') {
                res.status(403).json({ message: 'Forbidden: Token expired' });
            }
            else if (err.name === 'JsonWebTokenError') {
                res.status(403).json({ message: 'Forbidden: Invalid token' });
            }
            else {
                res.status(403).json({ message: 'Forbidden: Token verification failed' });
            }
        }
    });
}
