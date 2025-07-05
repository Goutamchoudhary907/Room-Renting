import { Request, Response } from 'express';
import { AuthenticatedRequest } from "../middleware/middleware.js";
import {PrismaClient } from "@prisma/client";
import {propertySchema, PropertySchema} from '../../schema/src/propertySchema.js'
const prisma = new PrismaClient();
import { ZodError, ZodIssue } from 'zod'; 
import multer, { MulterError } from 'multer';
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
  const { address, ...rest } = req.body;

  if (!address) {
     res.status(400).json({ error: "Address is required" });
     return
  }

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
      address,
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
    const latitude = parseNumber(req.body.latitude, 'latitude', false);
    const longitude = parseNumber(req.body.longitude, 'longitude', false);

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
          formattedAddress: req.body.formattedAddress ?? '',
          address: {
            country: address?.country || 'India',
            flatOrHouse: address?.flatOrHouse || '',
            street: address?.street || '',
            landmark: address?.landmark || '',
            locality: address?.locality || '',
            city: address?.city || '',
            state: address?.state || '',
            postalCode: address?.postalCode || '',
          },
          latitude,
          longitude,
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
console.log("req.files:", req.files);
const {
  country,
  flatOrHouse,
  street,
  landmark,
  locality,
  city,
  state,
  postalCode,
  
} = validatedData.address || {};

const otherData = { ...validatedData, address: undefined };

    const newProperty= await prisma.property.create({
        data:{
          ...otherData,
          country,
          flatOrHouse,
          street,
          landmark,
          locality,
          city,
          state,
          postalCode,
          formattedAddress: validatedData.formattedAddress ?? '',
          latitude: validatedData.latitude ?? null,
          longitude: validatedData.longitude ?? null,
          
          maxGuests: validatedData.maxGuests ?? 1,
          host: { connect: { id: userId } },
          images: {
            create: req.files.map((file: Express.Multer.File) => ({ url: file.path }))
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
  } catch (error: any) {
    console.error("Error creating property: ", error);
    
       const errorResponse = {
        fieldErrors: {} as Record<string, string[]>,
        generalErrors: [] as string[]
       };
  
      if (error instanceof multer.MulterError) {
       if (error.code === "LIMIT_FILE_SIZE") {
        errorResponse.fieldErrors.images = ["File size is too large (max 5MB)"];
        res.status(400).json({ errors: { ...errorResponse.fieldErrors, general: errorResponse.generalErrors } });
        return;
       } else if (error.code === "LIMIT_UNEXPECTED_FILE") {
        errorResponse.fieldErrors.images = [error.message || "Too many files uploaded."];
        res.status(400).json({ errors: { ...errorResponse.fieldErrors, general: errorResponse.generalErrors } });
        return;
       } else {
        errorResponse.fieldErrors.images = [error.message || "Image upload failed."];
        res.status(400).json({ errors: { ...errorResponse.fieldErrors, general: errorResponse.generalErrors } });
        return;
       }
      } else if (error instanceof ZodError) {
       error.issues.forEach((issue: ZodIssue) => {
        const field = issue.path[0] as string;
        if (!errorResponse.fieldErrors[field]) {
         errorResponse.fieldErrors[field] = [];
        }
        errorResponse.fieldErrors[field].push(issue.message);
       });
       res.status(400).json({ errors: errorResponse.fieldErrors });
       return;
      } else if (error.code === 'P2002') {
       // Unique constraint violation (e.g., duplicate title or address if unique)
       errorResponse.generalErrors.push('The provided information already exists.');
       res.status(409).json({ errors: { general: errorResponse.generalErrors } }); // 409 Conflict
       return;
      } else if (error.code === 'P2003') {
       errorResponse.generalErrors.push('Invalid related data (e.g., user not found).');
       res.status(400).json({ errors: { general: errorResponse.generalErrors } }); // 400 Bad Request
       return;
      } else if (error.code === 'P2016') {
       errorResponse.generalErrors.push('Database operation failed due to record not found.');
       res.status(404).json({ errors: { general: errorResponse.generalErrors } }); // 404 Not Found (depending on context)
       return;
      } else {
       // Catch-all for other errors
       errorResponse.generalErrors.push(error.message || 'An unexpected server error occurred.');
       res.status(500).json({ errors: { general: errorResponse.generalErrors } });
       return;
      }
     }  
}

export async function getFilteredProperties(req:Request, res:Response):Promise<void>{
 try {
  const {rentalType,bedrooms,minPrice, maxPrice, address,amenities,checkin, checkout,moveInDate, leaseDuration, excludeHostId} = req.query;
const where: any = {
  AND: [],
};

console.log("excludeHostId from query:", excludeHostId);
if (excludeHostId) {
  where.AND.push({
    hostId: { not: Number(excludeHostId) }
  });
}

    if (rentalType) {
      where.AND.push({
        rentalType: rentalType as string
      });
    }

    if (bedrooms) {
      where.AND.push({
        bedrooms: Number(bedrooms)
      });
    }

    // Price Filter: handled separately
    const priceFilter: any[] = [];

    if (minPrice && maxPrice) {
      priceFilter.push({
        pricePerMonth: {
          gte: Number(minPrice),
          lte: Number(maxPrice)
        }
      });
      priceFilter.push({
        pricePerNight: {
          gte: Number(minPrice),
          lte: Number(maxPrice)
        }
      });
    } else if (minPrice) {
      priceFilter.push(
        { pricePerMonth: { gte: Number(minPrice) } },
        { pricePerNight: { gte: Number(minPrice) } }
      );
    } else if (maxPrice) {
      priceFilter.push(
        { pricePerMonth: { lte: Number(maxPrice) } },
        { pricePerNight: { lte: Number(maxPrice) } }
      );
    }

    if (priceFilter.length > 0) {
      where.AND.push({
        OR: priceFilter
      });
    }

    if (address) {
      where.AND.push({
        address: {
          contains: address as string,
          mode: 'insensitive'
        }
      });
    }

    if (amenities) {
      const amenityList = Array.isArray(amenities) ? amenities : [amenities];
      where.AND.push({
        amenities: {
          hasEvery: amenityList
        }
      });
    }

    const checkinDate = checkin ? new Date(checkin as string) : new Date();

    // Booking status availability logic
    where.AND.push({
      OR: [
        { bookingStatus: 'AVAILABLE' },
        {
          AND: [
            { bookingStatus: { not: 'AVAILABLE' } },
            {
              bookings: {
                none: {
                  release_after: {
                    gt: checkinDate
                  }
                }
              }
            }
          ]
        }
      ]
    });

    if (checkin && checkout) {
      const startDate = new Date(checkin as string);
      const endDate = new Date(checkout as string);

      where.AND.push({
        NOT: {
          bookings: {
            some: {
              paymentStatus: 'SUCCESSFUL',
              OR: [
                {
                  checkinDate: { lt: endDate },
                  checkoutDate: { gt: startDate }
                },
                {
                  moveInDate: { lt: endDate },
                  OR: [
                    { leaseDuration: null },
                    {
                      leaseDuration: {
                        gte: calculateMonthDifference(new Date(moveInDate as string), endDate)
                      }
                    }
                  ]
                }
              ]
            }
          }
        }
      });
    } else if (moveInDate) {
      const startDate = new Date(moveInDate as string);
      const endDate = leaseDuration
        ? new Date(new Date(moveInDate as string).setMonth(startDate.getMonth() + Number(leaseDuration)))
        : new Date('9999-12-31');

      where.AND.push({
        NOT: {
          bookings: {
            some: {
              paymentStatus: 'SUCCESSFUL',
              OR: [
                {
                  checkinDate: { lt: endDate },
                  checkoutDate: { gt: startDate }
                },
                {
                  moveInDate: { lt: endDate },
                  OR: [
                    { leaseDuration: null },
                    {
                      moveInDate: { lte: endDate }
                    }
                  ]
                }
              ]
            }
          }
        }
      });
    }



   const properties = await prisma.property.findMany({
    where,
    include: {
      images: { take: 1 },
      host: {
        select: {
          id: true,
          firstName: true,
          lastName: true
        }
      }
    }
  });
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
 function calculateMonthDifference(startDate: Date, endDate: Date): number {
  return (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
         (endDate.getMonth() - startDate.getMonth());
}
}


export async function getAllProperties(req:Request, res:Response):Promise<void>{
  try {
    const userId = req.query.excludeHostId as string | undefined;

    const properties=await prisma.property.findMany({
        where: userId ? {
        NOT: {
          hostId: Number(userId)
        }
      } : {},
      include: {
        images: true,
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

// Reconstruct nested address object from flat keys in req.body
const addressKeys = [
  'street',
  'city',
  'state',
  'postalCode',
  'country',
  'formattedAddress',
  'flatOrHouse',
  'landmark',
  'locality',
  'latitude',
  'longitude'
];

const reconstructedAddress: Record<string, any> = {};
for (const key of addressKeys) {
  if (req.body[key] !== undefined) {
    reconstructedAddress[key] = req.body[key];
    delete req.body[key]; // Remove from root body
  }
}

// If address not already present as object, inject it
if (Object.keys(reconstructedAddress).length > 0) {
  req.body.address = reconstructedAddress;
}


  const {
    bedrooms,
    bathrooms,
    pricePerMonth,
    pricePerNight,
    amenities,
    rentalType,
    imagesToDelete,   // Array of image IDs to delete
    address,
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
  .filter((img: { id: number; url: string }) => deleteIds.includes(img.id));

// Delete from Cloudinary first
await deleteFromCloudinary(
  imagesToRemove.map((img: { id: number; url: string }) => img.url)
);
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

  const updateData: any = {
    ...validatedData,
    images: newImages.length > 0 ? { create: newImages } : undefined,
    updatedAt: new Date()
  };

  if (address && typeof address === 'object') {
    const addressFields = [
      'street',
      'city',
      'state',
      'postalCode',
      'country',
      'formattedAddress',
      'flatOrHouse',
      'landmark',
      'locality',
      'latitude',
      'longitude'
    ];

    for (const key of addressFields) {
      if (address[key] !== undefined) {
        updateData[key] = address[key];
      }
    }
  }

  const updatedProperty = await prisma.property.update({
    where: { id: propertyId },
    data: updateData,
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