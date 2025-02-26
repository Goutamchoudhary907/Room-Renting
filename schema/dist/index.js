"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordInput = exports.forgotPasswordInput = exports.signinInput = exports.signupInput = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupInput = zod_1.default.object({
    firstName: zod_1.default.string().trim().min(1, { message: "Please enter your first name." }),
    lastName: zod_1.default.string().trim().min(1, { message: "Please enter your last name." }),
    email: zod_1.default.string().trim().email({ message: "Please enter a valid email address." }),
    password: zod_1.default.string().min(8, { message: "Password must be at least 8 characters." })
});
exports.signinInput = zod_1.default.object({
    email: zod_1.default.string().trim().email({ message: "Please enter a valid email address." }),
    password: zod_1.default.string().min(8, { message: "Password must be at least 8 characters." }),
});
exports.forgotPasswordInput = zod_1.default.string().trim().email({ message: "Please enter a valid email address." });
exports.resetPasswordInput = zod_1.default.object({
    password: zod_1.default.string().trim().min(8, { message: "New password must be at least 8 characters." }),
    confirmPassword: zod_1.default.string().trim().min(8, { message: "Confirm password must be at least 8 characters." }),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});
