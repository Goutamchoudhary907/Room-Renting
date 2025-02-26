import { Request, Response } from 'express';
import { AuthenticatedRequest } from "../middleware/middleware";
import { PrismaClient } from "@prisma/client";
import {propertySchema, PropertySchema} from '../../../schema/dist/propertySchema'
const prisma = new PrismaClient();
import { ZodError, ZodIssue } from 'zod'; 
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';


require("dotenv").config();
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

interface MappedErrors{
  title?:string;
  description?:string;
  bedrooms?:string;
  bathrooms?: string;
  rentalType?: string;
  pricePerNight?: string;
  pricePerMonth?: string;
  depositAmount?: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  amenities?: string;
  availability?: string;
  maxGuests?: string;
  images?: string;
  general?: string;
}

cloudinary.config({
  cloud_name:CLOUDINARY_CLOUD_NAME ,
  api_key:CLOUDINARY_API_KEY ,
  api_secret:CLOUDINARY_API_SECRET
})

const storage=new CloudinaryStorage({
  cloudinary:cloudinary,
  params:{
   folder:'property-images' ,
    allowed_formats:['jpg', 'jpeg' , 'png'] ,
    transfromation:[{width:500, height:500, crop:'limit'}]
  } as any ,   // Type assertion here
})

const upload=multer({storage:storage})

export async function createProperty(req:AuthenticatedRequest, res:Response):Promise<void>{
const errors: MappedErrors = {};
  try {
    const userId=req.user?.userId;
    if(!userId){
       res.status(401).json({
            message:"Unauthorized: User ID not found in token"
        })
        return
    }
    const {
      bedrooms,
      bathrooms,
      pricePerMonth,
      pricePerNight,
      depositAmount,
      maxGuests,
      ...rest
    } = req.body;
    
    const parsedBody = {
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      pricePerMonth: pricePerMonth === undefined || pricePerMonth === '' ? undefined : Number(pricePerMonth),   // Handle undefined
      pricePerNight: pricePerNight === undefined || pricePerNight === '' ? undefined : Number(pricePerNight), 
        depositAmount: Number(depositAmount),
      maxGuests: Number(maxGuests),
      ...rest,
    };

    console.log('req.body:', req.body); // Log req.body
    console.log('parsedBody:', parsedBody)
    let validatedData:PropertySchema;
    try {
        validatedData=propertySchema.parse(parsedBody);
    } catch (zodError:any) {
      console.log("Zod Error Caught:", zodError); // Add this line
  
        if (zodError instanceof ZodError) {
            zodError.issues.forEach((issue:ZodIssue) => {
              errors[issue.path[0] as keyof MappedErrors] = issue.message;
            });
            console.log("Sending Zod Error Response:", { errors }); // Add this line
        
              res.status(400).json({errors})
              return
        }
        throw zodError;
        
    }
 
     if(!req.files || (req.files as Express.Multer.File[]).length===0){
      errors.images="At least one image is required."
        res.status(400).json({errors});
        return
     }

    const imageURLs=(req.files as Express.Multer.File[]).map(
      (file:any) => file.path
    );

    const newProperty= await prisma.property.create({
        data:{
          ...validatedData ,
          hostId:userId,
          images:{
            create:imageURLs.map((url) =>({url}))
          },
        } ,
        include:{
          images:true,
        },
    });
    res.status(201).json(newProperty);
    return
  } catch (error:any) {
    console.error("Error creating property: ", error)

    if(error instanceof multer.MulterError){
      errors.images=error.message;
       res.status(400).json({errors})
       return
    }

    if (error.code === 'P2003' && error.meta?.field_name?.includes('hostId')) {
      errors.general = 'User does not exist.';
       res.status(400).json({ errors });
       return
    }
    
    if (error.code === 'P2016') {
      errors.general = 'Database operation failed, try again.';
       res.status(500).json({ errors });
       return
    }

    errors.general = 'Failed to create property. Please try again.';
     res.status(500).json({ errors });
     return
  }   
}

export async function getProperties(req:Request, res:Response):Promise<void>{
  try {
    const properties=prisma.property.findMany({
      include:{
        images:true,
      },
    })
  } catch (error) {
    console.error("Error getting properties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export {upload};