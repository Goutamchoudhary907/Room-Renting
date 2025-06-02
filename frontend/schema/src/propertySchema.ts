import {z} from 'zod';

const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  formattedAddress: z.string().optional(),
  flatOrHouse: z.string().optional(),
  landmark: z.string().optional(),
  locality: z.string().optional(),
});

export const propertySchema=z.object({
  title:z.string().min(3, {message:"Title must be at least 3 characters"}) ,
  description:z.string().min(10,{message:"Description must be at least 10 characters"}) ,
  bedrooms:z.number().int().positive({message: 'Bedrooms must be a positive integer'}) ,
  bathrooms:z.number().positive({ message: 'Bathrooms must be a positive number' }) ,

  rentalType:z.enum(['short-term', 'long-term', 'both'],{
    message: 'Rental type must be either short-term, long-term, or both',
  }) ,
  pricePerNight: z.number().int().positive().optional(),
  pricePerMonth: z.number().int().positive().nullable().optional(),
 depositAmount: z.number().int().positive().optional(),
 maxGuests: z.number().min(1).default(1),
 address:addressSchema.optional() ,
 formattedAddress: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  amenities: z.string().array(),
  availability: z.any().optional(),
  })
  .refine(
    (data) => {
      if (data.rentalType === 'short-term' && (!data.pricePerNight || data.pricePerNight <= 0)) {
        return false;
      }
      if (data.rentalType === 'long-term' && (!data.pricePerMonth || data.pricePerMonth <= 0)) {
        return false;
      }
      if (data.rentalType === 'both' && (!data.pricePerNight || data.pricePerNight <= 0) && (!data.pricePerMonth || data.pricePerMonth <= 0)) {
        return false;
      }else{
        return true;
      }      
    },
    (data)=> { 
      if (data.rentalType === 'short-term' && (!data.pricePerNight || data.pricePerNight <= 0)) {
          return {
              message: 'Provide a valid pricePerNight for short-term rentals.',
              path: ['pricePerNight'],
          };
      }
      if (data.rentalType === 'long-term' && (!data.pricePerMonth || data.pricePerMonth <= 0)) {
          return {
              message: 'Provide a valid pricePerMonth for long-term rentals.',
              path: ['pricePerMonth'],
          };
      }
      if (data.rentalType === 'both' && (!data.pricePerNight || data.pricePerNight <= 0) && (!data.pricePerMonth || data.pricePerMonth <= 0)) {
          return {
              message: 'Provide valid pricePerNight and pricePerMonth for both rental types.',
              path: ['price'],
          };
      }
      return {
        message: 'Provide a valid price.',
        path: ['price'],
    };
  }
);
export type PropertySchema = z.infer<typeof propertySchema>;