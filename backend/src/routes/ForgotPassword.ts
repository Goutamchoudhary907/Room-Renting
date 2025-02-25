import express, { Request, Response } from "express";
const router = express.Router();
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import jwt from "jsonwebtoken";
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
import { sendEmail } from "./email-service";
import bcrypt from "bcrypt";
import { forgotPasswordInput, resetPasswordInput } from "../../../schema/dist";

router.post("/auth/forgot-password", async (req: Request, res: Response):Promise<any> => {
  const email = req.body;
  const result=forgotPasswordInput.safeParse(email);

  if(!result.success){   
    console.log("Result error in forgot password",result.error.errors);
    const mappedErrors :{[key:string]:string}={};
    result.error.errors.forEach((err:any) =>{
      mappedErrors["email"]=result.error.errors[0].message; 
    })
    return res.status(400).json({
      errors:mappedErrors,
    });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
      },
    });
    if (!user) {
      return res.status(400).json({
        message: "User not found with this email",
      });
    }

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in the env");
    }
    const resetToken = jwt.sign({ user: user.email }, JWT_SECRET, {
      expiresIn: "10m",
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { reset: resetToken },
    });

    const resetLink = `http://localhost:3000/auth/reset-password?token=${resetToken}`;
    await sendEmail({
      to: email,
      subject: "Reset password requested",
      from: "goutamchoudhary90768@gmail.com",
      html: `
        <p>Click the following link to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        `,
    });
    res.status(200).json("Password reset email send");
  } catch (error) {
    console.error("Error during forgot password", error);
    if(error instanceof Error){
      res.status(500).json({
        message:"Forgot password request failde due to intenal server error.",
        errorCode:"INTERNAL_SERVER_ERROR",
        details:error.message,
      })
    }else{
      res.status(500).json({
        message:"Forgot password request failde due to intenal server error.",
        errorCode:"INTERNAL_SERVER_ERROR",
        details:"An unknown error occurred",
      })
    }
    res.status(500).json("Error sending email");
  }
});

router.post("/reset-password", async (req: Request, res: Response) => {
  const { token, password, confirmPassword } = req.body;

  try {
     const result=resetPasswordInput.safeParse({password,confirmPassword});

     if(!result.success){
      const mappedErrors: { [key: string]: string } = {};
         result.error.errors.forEach((err) => {
                mappedErrors[err.path[0]] = err.message;
            });
             res.status(400).json({ errors: mappedErrors });
             return
      
     }
    if (!JWT_SECRET) {
      res.status(500).json({ message: "Internal server error" });
      return;
    }

    //  verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { user: string };
    const userEmail = decoded.user;

    //  find user
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail,
      },
      select: {
        id: true,
        reset: true,
      },
    });
    if (!user) {
      res.status(400).json({
        message: "User not found with this email",
      });
      return;
    }

    //  verify token in database
    if (user.reset !== token) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }
    //  Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Update Password and clear token
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
        reset: null,
      },
    });
    res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error: any) {
    console.error("Error", error);
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("JWT Error Details:", error.message);
       res.status(401).json({ message: "Invalid token" });
       return
    }

    // Handle other errors (Prisma errors, bcrypt errors, etc.)
    if (error.code === "P2025") {
      // prisma not found error
      res.status(404).json({ message: "User not found" });
      return
    }

    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/reset-password", (req:Request, res:Response) =>{
  const token=req.query.token;

  if(!token){
    res.status(400).send("Missing token");
    return;
  }

 const redirectURL= `http://localhost:5173/reset-password?token=${token}`;
 console.log("Redirecting to:", redirectURL); // Log this!
res.redirect(redirectURL);

})
export default router;
