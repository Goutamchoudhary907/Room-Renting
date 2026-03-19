import express, {Request,Response ,NextFunction } from 'express'
import dotenv from "dotenv";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
import jwt,{JwtPayload} from 'jsonwebtoken'

 export interface AuthenticatedRequest extends Request{
    user? : JwtPayload;
  }

export async function authMiddleware(req:AuthenticatedRequest,res:Response, next:NextFunction):Promise<void>{
const authHeader=req.headers['authorization'];
const token=authHeader && authHeader.split(' ')[1];
if(token == null){
    res.status(401).json({
        message:'Unauthorized: Missing token'
    })
    return
}

 if(!JWT_SECRET){
     res.status(500).json({ message: 'Internal Server Error: JWT_SECRET not configured' });
     return
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        req.user = decoded;
        next();
      } catch (err: any) {
        console.error('JWT Verification Error:', err);
        if (err.name === 'TokenExpiredError') {
          res.status(401).json({ message: 'Unauthorized: Token expired' });
        } else if (err.name === 'JsonWebTokenError') {
          res.status(401).json({ message: 'Unauthorized: Invalid token' });
        } else {
          res.status(401).json({ message: 'Unauthorized: Token verification failed' });
        }
      }
}