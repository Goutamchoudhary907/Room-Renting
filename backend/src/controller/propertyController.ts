import { Request, Response } from 'express';
import { AuthenticatedRequest } from "../middleware/middleware.js";
import { PrismaClient } from "@prisma/client";
import {propertySchema, PropertySchema} from '../../../schema/dist/propertySchema.js'
const prisma = new PrismaClient();
import { ZodError, ZodIssue } from 'zod'; 
import multer, { MulterError } from 'multer';
import dotenv from "dotenv";
const JWT_SECRET = process.env.JWT_SECRET;
import jwt from "jsonwebtoken"
import { deleteFromCloudinary, upload } from '../utils/cloudinary.js';

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


export async function createProperty(req:AuthenticatedRequest, res:Response):Promise<void>{
  console.log("req.body:", req.body);
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
      rentalType,
      ...rest
    } = req.body;

    function parseNumber(
      value: string | undefined | null,
      fieldName: string,
      isRequired: boolean = true
    ): number | undefined {
      // Explicitly handle 'undefined' string
      if (value === 'undefined') value = undefined;
      
      if (value === undefined || value === null || value === '') {
        if (isRequired) {
          throw new Error(`Invalid value for ${fieldName}`);
        }
        return undefined;
      }
      
      const number = Number(value);
      if (isNaN(number)) {
        throw new Error(`Invalid value for ${fieldName}`);
      }
      return number;
    }
      const parsedBody = {
          bedrooms: parseNumber(bedrooms, 'bedrooms') ?? 1,
          bathrooms: parseNumber(bathrooms, 'bathrooms') ?? 1,
          rentalType: req.body.rentalType,
          pricePerMonth: rentalType === 'short-term' 
          ? undefined 
          : parseNumber(pricePerMonth, 'pricePerMonth', true),
          pricePerNight: rentalType === 'long-term' 
          ? undefined 
          : parseNumber(pricePerNight, 'pricePerNight', true),
          depositAmount: parseNumber(depositAmount, 'depositAmount', false) ?? undefined,
          maxGuests: parseNumber(maxGuests, 'maxGuests', false) ?? 1,
          amenities: Array.isArray(amenities) ? amenities : amenities ? [amenities] : [],
          ...rest,
      };

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
  // console.log("req.files:", req.files);
  if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
     res.status(400).json({
        errors: {
            images: ["At least one image is required"]
        }
    });
    return
}

    const newProperty= await prisma.property.create({
        data:{
          ...validatedData ,
          maxGuests: validatedData.maxGuests ?? 1,
          host: { connect: { id: userId } },
          images:{
            create: req.files.map(file => ({
              url: file.path 
            }))
          },
        } ,
        include:{
          images:true,
        },
    });

    // console.log("newProperty created:", newProperty);
    res.status(201).json(newProperty);
    // console.log("Response sent");
    return
  } catch (error:any) {
    console.error("Error creating property: ", error)

   const errorResponse={
    fieldErrors:{} as Record<string, string[]>,
    generalErrors:[] as string[]
   };


    if(error instanceof multer.MulterError){
      if(error.code=== "LIMIT_FILE_SIZE"){
        errorResponse.fieldErrors.images=["File size is too loarge (max 5MB)"]
      }else{
        errorResponse.fieldErrors.images=[error.message];
      }
    }
    else if(error instanceof ZodError){
     error.issues.forEach((issue:ZodIssue) =>{
      const field=issue.path[0] as string;
      if(!errorResponse.fieldErrors[field]){
        errorResponse.fieldErrors[field]=[];
      }
      errorResponse.fieldErrors[field].push(issue.message);
     });
    }

 // Handle foreign key constraint failure
    else if (error.code === 'P2003') {
      errorResponse.generalErrors.push('User does not exist.');
    }

     // Handle Prisma operation failure
    else if (error.code === 'P2016') {
      errorResponse.generalErrors.push('Database operation failed.');
    }
 else{
  errorResponse.generalErrors.push(error.message || 'An unexpected error occurred');
 }

 res.status(error instanceof ZodError || error instanceof multer.MulterError ? 400 : 500).json({
  errors: {
      ...errorResponse.fieldErrors,
      general: errorResponse.generalErrors
  }
});
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


export async function getUserProperties(req:Request, res:Response):Promise<void>{
  try {
    // extract token 
    const token=req.headers.authorization?.split(" ")[1];

    if(!token){
      res.status(401).json({message:"Unauthorized"});
      return;
    }

    // verfit and decode token
    const decodedToken=jwt.verify(token, JWT_SECRET as string) as {userId:number};
    const userId=decodedToken.userId;

    // fetch properties 
    const properties=await prisma.property.findMany({
      where:{
        hostId:userId ,
      },
      include:{
        images:true ,
      }
    })

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error getting user properties:", error);
        res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteProperty(req:Request, res:Response):Promise<void>{
  try {
    const token=req.headers.authorization?.split(" ")[1];
    if(!token){
      res.status(401).json({message:"Unauthorized"})
      return;
    }

    const decodedToken=jwt.verify(token, JWT_SECRET as string) as {userId:number};
    const userId=decodedToken.userId;

    const propertyId=parseInt(req.params.id);

    const property=await prisma.property.delete({
      where:{
        id:propertyId ,
      },
      include:{
        images:true ,
      } 
    })
    res.status(200).json({property, message: "Property deleted successfully" });
  } catch (error) {
    console.error("Error deleting property:", error);
    res.status(500).json({ message: "Error deleting property" });
  }
}

interface AuthenticatedReq extends Request {
  user?: {
    userId: number;
  };
}
export async function updateProperty(req:AuthenticatedReq, res:Response):Promise<void>{
  console.log("Request Body:", req.body);
  const errors: Record<string, string[]> = {};
  try {
  const propertyId = parseInt(req.params.id);
  const userId = req.user?.userId;

  if(!userId){
    res.status(401).json({message:"Unauthorized: User ID not found in token"})
    return;
  }

  const existingProperty=await prisma.property.findUnique({
    where:{
      id:propertyId
    },include:{
      images:true,
      host:true
    }
  });

  if(!existingProperty){
    res.status(404).json({message:"Property not found"});
    return;
  }

  if (existingProperty.hostId !== userId) {
    res.status(403).json({ message: 'Unauthorized: You do not own this property' });
    return;
  }
  const {
    bedrooms,
    bathrooms,
    pricePerMonth,
    pricePerNight,
    amenities,
    rentalType,
    imagesToDelete,   // Array of image IDs to delete
    ...rest
  } = req.body;

  function parseNumber(
    value: any,
    fieldName: string,
    // existingProperty: any,
    isRequired: boolean = true
  ): number | undefined {
    if (value === 'undefined') value = undefined;
    
    if (value === undefined || value === null || value === '') {
      if (!isRequired) return undefined;
      if (!existingProperty) throw new Error(`Property not found`);
      existingProperty[fieldName as keyof typeof existingProperty];
      return
    }
    const number = Number(value);
    if (isNaN(number)) {
      throw new Error(`Invalid value for ${fieldName}`);
    }
    return number;
  }
  const parsedBody={
    bedrooms: bedrooms !== undefined ? Number(bedrooms) : existingProperty.bedrooms,  bathrooms: parseNumber(bathrooms, 'bathrooms') ?? existingProperty.bathrooms,
    rentalType: rentalType ?? existingProperty.rentalType,
    pricePerMonth: rentalType === 'short-term' ? undefined: parseNumber(pricePerMonth, 'pricePerMonth', false) ?? existingProperty.pricePerMonth,
    pricePerNight: rentalType === 'long-term'  ? undefined: parseNumber(pricePerNight, 'pricePerNight', false) ?? existingProperty.pricePerNight,
    amenities: amenities 
    ? (Array.isArray(amenities) ? amenities : [amenities]) 
    : existingProperty.amenities,
  ...rest,
};

let validatedData: PropertySchema;
try {
  validatedData = propertySchema.parse(parsedBody);
} catch (zodError: any) {  
  if (zodError instanceof ZodError) {
    zodError.issues.forEach((issue: ZodIssue) => {
      const field = issue.path[0] as string;
      if (!errors[field]) errors[field] = [];
      errors[field].push(issue.message);
    });
    res.status(400).json({ errors });
    return;
  }
  throw zodError;
}
 // Handle image deletions
 if(imagesToDelete){
  const deleteIds=JSON.parse(imagesToDelete)as number[];

  // Find images to delete
  const imagesToRemove = existingProperty.images
  .filter(img => deleteIds.includes(img.id));

// Delete from Cloudinary first
  await deleteFromCloudinary(
    imagesToRemove.map(img => img.url)
  )

  // Delete from database
  await prisma.image.deleteMany({
    where: {
      id: { in: deleteIds },
      propertyId: propertyId
    }
  });
  }

  // Handle new image uploads
  let newImages: { url: string }[] = [];
  if (req.files && Array.isArray(req.files)) {
    newImages = req.files.map(file => ({
      url: file.path 
    }));
  }

  const updatedProperty = await prisma.property.update({
    where: { id: propertyId },
    data: {
      ...validatedData,
      images: newImages.length > 0 ? {
        create: newImages
      } : undefined,
      updatedAt: new Date()
    },
    include: {
      images: true,
      host: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    }
  });
  console.log("Request Body after all code:", req.body);
    res.status(200).json(updatedProperty);
    return
  }
 catch (error:any) {
  console.log("Request Body in catch block:", req.body);
  console.error("Error updating property:", error);

  const errorResponse = {
    fieldErrors: {} as Record<string, string[]>,
    generalErrors: [] as string[]
  };
  if (error instanceof multer.MulterError) {
    errorResponse.fieldErrors.images = [
      error.code === "LIMIT_FILE_SIZE" 
        ? "File size is too large (max 5MB)" 
        : error.message
    ];
  } 
  else if (error instanceof ZodError) {
    error.issues.forEach((issue: ZodIssue) => {
      const field = issue.path[0] as string;
      if (!errorResponse.fieldErrors[field]) {
        errorResponse.fieldErrors[field] = [];
      }
      errorResponse.fieldErrors[field].push(issue.message);
    });
  }
  else if (error.code === 'P2003') {
    errorResponse.generalErrors.push('Invalid reference data.');
  }
  else if (error.code === 'P2025') {
    errorResponse.generalErrors.push('Property not found.');
  }
  else {
    errorResponse.generalErrors.push(error.message || 'An unexpected error occurred');
  }

  // Send appropriate status code
  const statusCode = error instanceof ZodError || error instanceof multer.MulterError 
    ? 400 
    : 500;
   res.status(statusCode).json({
    errors: {
      ...errorResponse.fieldErrors,
      general: errorResponse.generalErrors
    },
  });
  return
}
}

export const getPropertyById=async (req:Request,res:Response):Promise<void> =>{
try {
  const property=await prisma.property.findUnique({
    where:{
      id:parseInt(req.params.id)
    },
    include:{
      images:true
    }
  })
  if (!property)  {
    res.status(404).json({ error: "Property not found" });
  return
  }
    res.json(property);
  return

} catch (error) {
  res.status(500).json({ error: "Error finding property" });
}
}

export {upload};