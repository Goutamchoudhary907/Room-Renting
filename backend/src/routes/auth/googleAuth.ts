import express from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { OAuth2Client } from "google-auth-library";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const prisma = new PrismaClient();
const router = express.Router();
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post("/google", async (req, res) => {
 res.header('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
    const {credential} =req.body;
    if(!credential) {
         res.status(400).json({ message: "No credential provided" });
         return;
    }

    try {
        const ticket=await client.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        if(!payload || !payload.email) {
            res.status(400).json({ message: "Invalid Google token" });
            return;
        }
        const {email,given_name:firstName,family_name:lastName,sub:googleId} = payload;

           // Check if user exists
        let user = await prisma.user.findUnique({ where: { email } });

        if(!user){
            // Create new user
            user = await prisma.user.create({
                data: {
                    email,
                    firstName: firstName ?? "",
                    lastName: lastName ?? "",
                    googleId,
                },
            });
        }

        // Generate JWT token  
        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in the environment variables");
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "7d" }
        );
        res.json({token,user});
    } catch (error) {
        console.error("Google Sign-in Error:", error);
        res.status(500).json({ message: "Failed to authenticate with Google" });
    
    }
})
export default router;