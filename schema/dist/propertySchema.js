"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.propertySchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.propertySchema = zod_1.default.object({
    title: zod_1.default.string().min(3, { message: "Title must be at least 3 characters" }),
    description: zod_1.default.string().min(10, { message: "Description must be at least 10 characters" }),
    bedrooms: zod_1.default.number().int().positive({ message: 'Bedrooms must be a positive integer' }),
    bathrooms: zod_1.default.number().int().positive({ message: 'Bathrooms must be a positive integer' }),
    rentalType: zod_1.default.enum(['short-term', 'long-term', 'both']),
    pricePerNight: zod_1.default.number().int().positive().optional(),
    pricePerMonth: zod_1.default.number().int().positive().optional(),
    depositAmount: zod_1.default.number().int().positive().optional(),
    address: zod_1.default.string().min(5, { message: 'Address must be at least 5 characters' }),
    latitude: zod_1.default.number().optional(),
    longitude: zod_1.default.number().optional(),
    amenities: zod_1.default.string().array(),
    availability: zod_1.default.any().optional(),
    maxGuests: zod_1.default.number().int().positive({ message: 'Max guests must be a positive integer' }),
}).refine((data) => {
    if (data.rentalType === 'short-term' && data.pricePerNight === undefined) {
        return false;
    }
    if (data.rentalType === 'long-term' && data.pricePerMonth === undefined) {
        return false;
    }
    if (data.rentalType === 'both' && data.pricePerNight === undefined || data.pricePerMonth === undefined) {
        return false;
    }
    return true;
}, {
    message: "Price is required",
    path: ['price']
});
