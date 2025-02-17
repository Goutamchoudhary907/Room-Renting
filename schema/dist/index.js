"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinInput = exports.signupInput = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupInput = zod_1.default.object({
    firstName: zod_1.default.string().trim().min(1, { message: "Please enter your first name." }),
    lastName: zod_1.default.string().trim().min(1, { message: "Please enter your last name." }),
    email: zod_1.default.string().trim().email({ message: "Please enter a valid email address." }),
    password: zod_1.default.string().min(8, { message: "Password must be at least 8 characters." })
});
exports.signinInput = zod_1.default.object({
    email: zod_1.default.string().trim().email(),
    password: zod_1.default.string().min(8),
});
