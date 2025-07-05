import express, { Request, Response } from "express";
const router = express.Router();
import { signupInput, signinInput,updatePhoneInput } from "../../schema/src/authSchema.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
import {AuthenticatedRequest, authMiddleware} from '../middleware/middleware.js';

router.post("/signup", async (req: Request, res: Response): Promise<any> => {
  const body = req.body;
  const result = signupInput.safeParse(body);

  if (!result.success) {
    console.log("result.error.errors:", result.error.errors);
    const mappedErrors:{[key:string]:string}={};
    result.error.errors.forEach((err: any) => {
      mappedErrors[err.path[0]] = err.message;
    });
    return res.status(400).json({
      // message: "Incorrect inputs",
      errors: mappedErrors,
    });
  }
  try {
    const { email,phoneNumber } = result.data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phoneNumber: phoneNumber }
        ]
      }
    });
    if (existingUser) {
      if (existingUser.email === email) {
        return res.status(409).json({
          message: "This email is already registered.",
        });
      }
      if (existingUser.phoneNumber === phoneNumber) {
        return res.status(409).json({
          message: "This phone number is already registered.",
        });
      }
    }
    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        password: hashedPassword,
        phoneNumber: result.data.phoneNumber
      },
    });

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the env");
    }
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      JWT_SECRET
    );

    res.status(201).json({ 
      message: "Signup successful", 
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        phoneNumber: newUser.phoneNumber
      }
    });
  } catch (error: unknown) {
    console.error("Error during signup:", error);

    if (error instanceof Error) {
      res.status(500).json({
        message: "Signup failed due to an internal server error.",
        errorCode: "INTERNAL_SERVER_ERROR",
        details: error.message,
      });
    } else {
      res.status(500).json({
        message: "Signup failed due to an internal server error.",
        errorCode: "INTERNAL_SERVER_ERROR",
        details: "An unknown error occurred.",
      });
    }
  } finally {
    await prisma.$disconnect();
  }
});

router.post("/signin", async (req: Request, res: Response): Promise<any> => {
  const body = req.body;
  const result = signinInput.safeParse(body);
  if (!result.success) {
    console.log("result.error.errors:", result.error.errors);
    const mappedErrors:{[key:string]:string}={};
    result.error.errors.forEach((err: any) => {
      mappedErrors[err.path[0]] = err.message;
    });
    return res.status(400).json({
      // message: "Incorrect inputs",
      errors: mappedErrors,
    });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(500).json({ message: "User password is missing." });
    }
    const passwordMatch = await bcrypt.compare(body.password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the env");
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET
    );
    res.status(200).json({ message: "Signin successful",
       token,
      user:{
        id:user.id,
        email:user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
      });
  } catch (error: unknown) {
    console.error("Error during signup:", error);

    if (error instanceof Error) {
      res.status(500).json({
        message: "Signin failed due to an internal server error.",
        errorCode: "INTERNAL_SERVER_ERROR",
        details: error.message,
      });
    } else {
// if error is not of type Error then general error message 
      res.status(500).json({
        message: "Signin failed due to an internal server error.",
        errorCode: "INTERNAL_SERVER_ERROR",
        details: "An unknown error occurred.",
      });
    }
  } finally {
    await prisma.$disconnect();
  }
});

router.get("/me", authMiddleware, async (req:AuthenticatedRequest, res:Response) =>{
  try {
    if (!req.user || !req.user.email) {
       res.status(401).json({ message: "Unauthorized or user email not found in token." });
       return
    }
    const user=await prisma.user.findUnique({
      where:{
        email:req.user.email
      },
      select:{
         id: true,
        email:true,
        firstName:true,
        lastName:true,
        phoneNumber:true
      }
    });
    if(!user){
       res.status(404).json({message: "User not found"})
       return
    }
    res.json({user});
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
})

router.put("/update-phone", authMiddleware,async (req:AuthenticatedRequest, res:Response) =>{
  const {phoneNumber} =updatePhoneInput.parse(req.body);
  try {
    if (!req.user?.email) {
       res.status(401).json({ message: 'Unauthorized: User email not found in token' });
       return
    }

    const updatedUser = await prisma.user.update({
      where: { email: req.user.email },
      data: { phoneNumber },
    });

    if(updatedUser){
      res.json({message:'Phone number updated successfully'})
    }else{
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating phone number:', error);
    res.status(500).json({ message: 'Failed to update phone number' });
  } finally {
    await prisma.$disconnect();
  }
});
export default router;