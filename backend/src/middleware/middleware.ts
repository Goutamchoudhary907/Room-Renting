import express, {Request,Response ,NextFunction } from 'express'
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
import jwt,{JwtPayload} from 'jsonwebtoken'

 export interface AuthenticatedRequest extends Request{
    user? : JwtPayload;
  }

export async function authMiddleware(req:AuthenticatedRequest,res:Response, next:NextFunction):Promise<void>{

const authHeader=req.headers['authorization'];
console.log('authHeader:', authHeader);
const token=authHeader && authHeader.split(' ')[1];
console.log('token:', token);

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
        console.log('Decoded Payload:', decoded);
   
        req.user = decoded;
        next();
      } catch (err: any) {
        console.error('JWT Verification Error:', err);       // Log full error object
        if (err.name === 'TokenExpiredError') {
          res.status(403).json({ message: 'Forbidden: Token expired' });
        } else if (err.name === 'JsonWebTokenError') {
          res.status(403).json({ message: 'Forbidden: Invalid token' });
        } else {
          res.status(403).json({ message: 'Forbidden: Token verification failed' });
        }
      }
}