// controllers/paymentController.ts

import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware, AuthenticatedRequest } from '../middleware/middleware.js';

const prisma = new PrismaClient();
export const checkout=(req:AuthenticatedRequest, res:Response) =>{
  
}