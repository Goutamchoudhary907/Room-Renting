import { Request, Response } from 'express';
import { AuthenticatedRequest } from "../middleware/middleware.js";
import { PrismaClient } from "@prisma/client";
import {propertySchema, PropertySchema} from '../../../schema/dist/propertySchema.js'
const prisma = new PrismaClient();
import { ZodError, ZodIssue } from 'zod'; 
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from "dotenv";
dotenv.config();
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
  const errors: Record<string, string[]> = {};
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
      amenities,
      ...rest
    } = req.body;
    const parseNumber = (value: string | undefined): number | undefined => {
      if (value === undefined || value === "") {
          return undefined;
      }
      const num = Number(value);
      return isNaN(num) ? undefined : num;
  };
    const parsedBody = {
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      pricePerMonth: parseNumber(pricePerMonth),
      pricePerNight: parseNumber(pricePerNight),
      depositAmount: parseNumber(depositAmount),maxGuests: maxGuests !== undefined ? Number(maxGuests) : 1,
      amenities:Array.isArray(amenities) ? amenities:[amenities],
      ...rest,
    };

    // console.log('req.body:', req.body);
    // console.log('parsedBody:', parsedBody)
    let validatedData:PropertySchema;
    try {
        validatedData=propertySchema.parse(parsedBody);
    } catch (zodError:any) {  
        if (zodError instanceof ZodError) {
            zodError.issues.forEach((issue:ZodIssue) => {
              const field = issue.path[0] as string;
              if (!errors[field]) errors[field] = [];
              errors[field].push(issue.message);
            });
        
              res.status(400).json({errors})
              return
        }
        throw zodError;
        
    }
 
     if(!req.files || (req.files as Express.Multer.File[]).length===0){
      errors.images = ["At least one image is required."]; 
        res.status(400).json({errors});
        return
     }

    const imageURLs=(req.files as Express.Multer.File[]).map(
      (file:any) => file.path
    );
    console.log("validatedData:", validatedData);
    console.log("imageURLs:", imageURLs);

    const newProperty= await prisma.property.create({
        data:{
          ...validatedData ,
          maxGuests: validatedData.maxGuests ?? 1,
          host: { connect: { id: userId } },
          images:{
            create:imageURLs.map((url) =>({url}))
          },
        } ,
        include:{
          images:true,
        },
    });

    console.log("newProperty created:", newProperty);
    res.status(201).json(newProperty);
    console.log("Response sent");
    return
  } catch (error:any) {
    console.error("Error creating property: ", error)

    if(error instanceof multer.MulterError){
      errors.images=[error.message];
       res.status(400).json({errors})
       return
    }
    if(error instanceof ZodError){
      const validationErrors: Record<string, string[]> = {};

      error.issues.forEach((issue: ZodIssue) => {
        const field = issue.path[0] as string;
      if (!validationErrors[field]) validationErrors[field] = [];
      validationErrors[field].push(issue.message);
      });
      console.log("Validation Errors:", validationErrors);
      res.status(400).json({ errors: validationErrors });
      return;
    }
 // Handle foreign key constraint failure
    if (error.code === 'P2003' && error.meta?.field_name?.includes('hostId')) {
      errors.general = ['User does not exist.'];
       res.status(400).json({ errors });
       return
    }

     // Handle Prisma operation failure
    if (error.code === 'P2016') {
      errors.general = ['Database operation failed, try again.'];
       res.status(500).json({ errors });
       return
    }

    errors.general = ['Failed to create property. Please try again.'];
     res.status(500).json({ errors });
     return
  }   
}

export async function getFilteredProperties(req:Request, res:Response):Promise<void>{
 try {
  const {rentalType,bedrooms,minPrice, maxPrice, address,amenities,availability} = req.query;

  const where: any={};

  if(rentalType){
    where.rentalType=rentalType as string
  }
  if(bedrooms){
    where.bedrooms=Number(bedrooms);
  }

  if(minPrice && maxPrice){
    where.OR=[
      {pricePerMonth:{gte:Number(minPrice), lte:Number(maxPrice)}},
      {pricePerNight:{gte:Number(minPrice), lte:Number(maxPrice)}}
    ];
  }else if (minPrice){
    where.OR=[
      {pricePerMonth:{gte:Number(minPrice)}},
      {pricePerNight:{gte:Number(minPrice)}},
    ];
  }else if(maxPrice){
    where.OR=[
      {pricePerMonth:{gte:Number(maxPrice)}},
      {pricePerNight:{gte:Number(maxPrice)}},
    ];
  }

  if(address){
    where.address= {contains:address as string, mode:'insesitive'};
  }

  if(amenities){
    // assuming amenities are stored as comma-seperated in query
    const amenityList= (amenities as string).split(',');
    where.amenities={hasEvery:amenityList}
  }
  if(availability){
    where.availability=new Date(availability as string);
  }
   const properties=await prisma.property.findMany({
    where:where,
    include:{
      images:true,
    },
   })
   res.status(200).json(properties);

 } catch (error:any) {
  console.error("Error getting propertis: ", error);
  if(error instanceof ZodError){
     res.status(400).json({errors:error.errors});
     return
  }else if(error.code==='P2001'){
    res.status(400).json({message:"No properties found matching the filter."});
    return
  }else{
    res.status(500).json({
      message:"Internal server error" 
    }) 
    return
  }
 }
}


export async function getAllProperties(req:Request, res:Response):Promise<void>{
  try {
    const properties=await prisma.property.findMany({
      include:{
        images:true,
      }
    })
    res.status(200).json(properties);
  } catch (error) {
    console.error("Error getting all properties:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export {upload};