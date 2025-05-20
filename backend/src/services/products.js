import { dodoPayments } from "./dodoPayments.js";

async function listProducts() {
    try {
        console.log("Attempting to list products...");
        const products = await dodoPayments.products.list();
        console.log("Products retrieved successfully:", products);
    } catch (error) {
        console.error("Product listing failed:", {
            message: error.message,
            code: error.code,
            stack: error.stack
        });
    }
}

listProducts();