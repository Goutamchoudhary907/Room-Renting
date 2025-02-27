import z from 'zod';

export const propertySchema=z.object({
  title:z.string().min(3, {message:"Title must be at least 3 characters"}) ,
  description:z.string().min(10,{message:"Description must be at least 10 characters"}) ,
  bedrooms:z.number().int().positive({message: 'Bedrooms must be a positive integer'}) ,
  bathrooms:z.number().int().positive({ message: 'Bathrooms must be a positive integer' }) ,
  rentalType:z.enum(['short-term', 'long-term', 'both']) ,
  pricePerNight: z.number().int().positive().optional(),
  pricePerMonth: z.number().int().positive().optional(),
  depositAmount: z.number().int().positive().optional(),
  address:z.string().min(5, { message: 'Address must be at least 5 characters' }) ,
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  amenities: z.string().array(),
  availability: z.any().optional(),
  maxGuests: z.number().int().positive({ message: 'Max guests must be a positive integer' }),
}).refine(
  (data) =>{
    if(data.rentalType==='short-term' && data.pricePerNight===undefined){
      return false;
    }
    return true;
  },{
    message:"Price per night is required",
    path:['pricePerNight']
  }).refine(
    (data)=>{
      if(data.rentalType==='long-term' && data.pricePerMonth===undefined){
        return false;
      }
      return true;
    },{
      message:"Price per month is required" ,
      path:['pricePerMonth']
    }).refine(
      (data) => {
          if (data.rentalType === 'both' && (data.pricePerNight === undefined || data.pricePerMonth === undefined)) {
              return false;
          }
          return true;
      },
      {
          message: "Both price per night and price per month are required for 'both' rentals",
          path: ['price'], 
      }
  );
  

export type PropertySchema=z.infer<typeof propertySchema>