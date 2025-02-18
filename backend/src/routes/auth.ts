import express, { Request, Response } from "express";
const router = express.Router();
import { signupInput, signinInput } from "../../../schema/dist/index";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
import {authMiddleware} from '../middleware/middleware';

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
    const { email } = result.data;
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      return res.status(409).json({
        message: "This email is already registered.",
      });
    }
    const hashedPassword = await bcrypt.hash(result.data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        firstName: result.data.firstName,
        lastName: result.data.lastName,
        email: result.data.email,
        password: hashedPassword,
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

    res.status(201).json({ message: "Signup successful", token });
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
    res.status(200).json({ message: "Signin successful", token });
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

router.get("/test",authMiddleware, (req: Request, res: Response) =>{
  res.json({
    message:"Middleware works"
  })
})

export default router;