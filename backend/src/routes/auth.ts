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
  console.log('Auth Signup: Request received'); 
  const body = req.body;
  const result = signupInput.safeParse(body);

  if (!result.success) {
    console.log("Auth Signup: Input validation failed:", result.error.errors); 
    const mappedErrors:{[key:string]:string}={};
    result.error.errors.forEach((err: any) => {
      mappedErrors[err.path[0]] = err.message;
    });
    return res.status(400).json({
      errors: mappedErrors,
    });
  }
  try {
    const { email,phoneNumber } = result.data;

    console.log('Auth Signup: Checking for existing user by email or phone number');
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { phoneNumber: phoneNumber }
        ]
      }
    });
    console.log('Auth Signup: Finished checking for existing user'); 

    if (existingUser) {
      if (existingUser.email === email) {
        console.log('Auth Signup: Email already registered');
        return res.status(409).json({
          message: "This email is already registered.",
        });
      }
      if (existingUser.phoneNumber === phoneNumber) {
        console.log('Auth Signup: Phone number already registered');
        return res.status(409).json({
          message: "This phone number is already registered.",
        });
      }
    }
    
    console.log('Auth Signup: Hashing password'); 
    const hashedPassword = await bcrypt.hash(result.data.password, 10);
    console.log('Auth Signup: Password hashing complete');

    console.log('Auth Signup: Creating new user in database');
    const newUser = await prisma.user.create({
      data: {
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        password: hashedPassword,
        phoneNumber: result.data.phoneNumber
      },
    });
    console.log('Auth Signup: New user created');

    if (!JWT_SECRET) {
      console.error("Auth Signup: JWT_SECRET is not defined!");
      throw new Error("JWT_SECRET is not defined in the env");
    }
    console.log('Auth Signup: Generating JWT token'); 
    const token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      JWT_SECRET
    );
    console.log('Auth Signup: JWT token generated'); 

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
    console.log('Auth Signup: Response sent successfully'); 
  } catch (error: unknown) {
    console.error("Auth Signup: Error during signup:", error); 

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
  }
});

router.post("/signin", async (req: Request, res: Response): Promise<any> => {
  console.log('Auth Signin: Request received'); 
  const body = req.body;
  const result = signinInput.safeParse(body);
  if (!result.success) {
    console.log("Auth Signin: Input validation failed:", result.error.errors); 
    const mappedErrors:{[key:string]:string}={};
    result.error.errors.forEach((err: any) => {
      mappedErrors[err.path[0]] = err.message;
    });
    return res.status(400).json({
      errors: mappedErrors,
    });
  }
  try {
    console.log('Auth Signin: Searching for user by email');
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    console.log('Auth Signin: Finished searching for user'); 

    if (!user) {
      console.log('Auth Signin: User not found');
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.password) {
      console.log('Auth Signin: User password missing in DB');
      return res.status(500).json({ message: "User password is missing." });
    }

    console.log('Auth Signin: Comparing password'); 
    const passwordMatch = await bcrypt.compare(body.password, user.password);
    console.log('Auth Signin: Password comparison complete'); 

    if (!passwordMatch) {
      console.log('Auth Signin: Incorrect password');
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!JWT_SECRET) {
      console.error("Auth Signin: JWT_SECRET is not defined!"); 
      throw new Error("JWT_SECRET is not defined in the env");
    }
    console.log('Auth Signin: Generating JWT token'); 
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      JWT_SECRET
    );
    console.log('Auth Signin: JWT token generated'); 

    res.status(200).json({ message: "Signin successful",
        token,
      user:{
        id:user.id,
        email:user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }
      });
    console.log('Auth Signin: Response sent successfully'); 
  } catch (error: unknown) {
    console.error("Auth Signin: Error during signin:", error);

    if (error instanceof Error) {
      res.status(500).json({
        message: "Signin failed due to an internal server error.",
        errorCode: "INTERNAL_SERVER_ERROR",
        details: error.message,
      });
    } else {
      res.status(500).json({
        message: "Signin failed due to an internal server error.",
        errorCode: "INTERNAL_SERVER_ERROR",
        details: "An unknown error occurred.",
      });
    }
  }
});

router.get("/me", authMiddleware, async (req:AuthenticatedRequest, res:Response) =>{
  console.log('Auth /me: Request received');
  try {
    if (!req.user || !req.user.email) {
        console.log('Auth /me: Unauthorized - user or email not in token');
        res.status(401).json({ message: "Unauthorized or user email not found in token." });
        return
    }
    console.log(`Auth /me: Fetching user ${req.user.email} from database`);
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
    console.log('Auth /me: Finished fetching user');
    if(!user){
        console.log('Auth /me: User not found in database');
        res.status(404).json({message: "User not found"})
        return
    }
    res.json({user});
    console.log('Auth /me: Response sent successfully');
  } catch (error) {
    console.error("Auth /me: Error fetching user:", error);
    res.status(500).json({ message: "Error fetching user data" });
  }
});

router.put("/update-phone", authMiddleware,async (req:AuthenticatedRequest, res:Response) =>{
  console.log('Auth Update Phone: Request received');
  const {phoneNumber} =updatePhoneInput.parse(req.body);
  try {
    if (!req.user?.email) {
        console.log('Auth Update Phone: Unauthorized - user email not in token');
        res.status(401).json({ message: 'Unauthorized: User email not found in token' });
        return
    }

    console.log(`Auth Update Phone: Updating phone number for user ${req.user.email}`);
    const updatedUser = await prisma.user.update({
      where: { email: req.user.email },
      data: { phoneNumber },
    });
    console.log('Auth Update Phone: Finished updating phone number');

    if(updatedUser){
      res.json({message:'Phone number updated successfully'})
      console.log('Auth Update Phone: Response sent successfully');
    }else{
      console.log('Auth Update Phone: User not found for update');
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Auth Update Phone: Error updating phone number:', error);
    res.status(500).json({ message: 'Failed to update phone number' });
  }
});
export default router;
