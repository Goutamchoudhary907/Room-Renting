"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = authMiddleware;
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        res.status(401).json({
            message: 'Unauthorized: Missing token'
        });
        return;
    }
    if (!JWT_SECRET) {
        res.status(500).json({ message: 'Internal Server Error: JWT_SECRET not configured' });
        return;
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                res.status(403).json({ message: 'Forbidden: Token expired' });
            }
            else if (err.name === 'JsonWebTokenError') {
                res.status(403).json({ message: 'Forbidden: Invalid token' });
            }
            else {
                res.status(403).json({ message: 'Forbidden: Token verification failed' });
            }
            return;
        }
        if (decoded) {
            next();
        }
    });
}
