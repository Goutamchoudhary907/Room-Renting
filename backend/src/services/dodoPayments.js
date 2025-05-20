import DodoPayments from "dodopayments";
import dotenv from "dotenv";
import path from "path";

// Get the path to the root directory (where package.json is)
const rootPath = path.resolve(process.cwd(), '../..'); // Adjust based on your actual structure

// Load environment variables from project root
dotenv.config({ path: path.join(rootPath, '.env') });

// Debug output to verify
console.log("Project root path:", rootPath);
console.log("Loading .env from:", path.join(rootPath, '.env'));
console.log("API Key exists:", !!process.env.DODO_PAYMENTS_API_KEY);

// Initialize client
export const dodoPayments = new DodoPayments({
    bearerToken: process.env.DODO_PAYMENTS_API_KEY || '',
    environment: "test_mode",
    baseURL: null
});

// Throw error if API key is missing
if (!process.env.DODO_PAYMENTS_API_KEY) {
    throw new Error("DODO_PAYMENTS_API_KEY is missing from .env file");
}