import express, {Request,Response ,NextFunction } from 'express'
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
import jwt,{JwtPayload} from 'jsonwebtoken'


export function authMiddleware(req:Request,res:Response, next:NextFunction){
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

 jwt.verify(token,JWT_SECRET, (err,decoded) =>{
    if(err){
        if(err.name === 'TokenExpiredError'){
             res.status(403).json({ message: 'Forbidden: Token expired' });
        } else if(err.name === 'JsonWebTokenError'){
             res.status(403).json({ message: 'Forbidden: Invalid token' });
        } else{
            res.status(403).json({ message: 'Forbidden: Token verification failed' });
        }
        return
    }
    if(decoded){
        next();
    }
 })
}