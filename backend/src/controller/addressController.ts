import { Request, Response } from 'express';
import mapService from "../services/mapService.js";

interface AddressComponent{
    country?: string;
    establishmentName?: string;
    flatOrHouse?: string;
    street?: string;
    landmark?: string;
    locality?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    formattedAddress?: string; 
}

export default {
    async getAddressComponents(req:Request , res:Response){
        try {
            const {placeId, lat, lng} =req.query;

            if (!placeId && (!lat || !lng)) {
                 res.status(400).json({ error: 'Either placeId or both lat/lng are required' });
                 return
              }
            if(placeId && typeof placeId ==='string'){
                // Get components from place ID
                const details=await mapService.getPlaceDetails(placeId);
                if (!details.address_components) {
                    throw new Error('Address components are undefined');
                }
                const components = mapService.parseAddressComponents(
                  details.address_components,
                   details.formatted_address || '' ,
                  details.name
                  );
                 res.json({
                    ...components,
                    latitude: details.geometry?.location?.lat,
                    longitude: details.geometry?.location?.lng
                })
                return
            }

            if(lat && lng){
             // Reverse geocode from coordinates  
             const latitude = parseFloat(lat as string);
             const longitude = parseFloat(lng as string);
             const components = await mapService.reverseGeocode(latitude, longitude);
              res.json({
               ...components,
               latitude,
               longitude
             });
             return
            }
            res.status(400).json({ error: 'Either placeId or lat/lng coordinates are required' });
        } catch (error:any) {
            console.error('Address components error:', error);
            res.status(500).json({ error: error.message });
        }
    },
    async validateAddress(req: Request, res: Response) {
        try {
          const { address } = req.body;
          if (!address) {
             res.status(400).json({ error: 'Address is required' });
             return
          }
    
          // Forward geocode
          const location = await mapService.geocodeAddress(address);
          if (!location) {
             res.status(404).json({ error: 'Address not found' });
             return
          }
    
          // Get detailed components
          const components = await mapService.reverseGeocode(location.lat, location.lng);
          
          res.json({
            ...components,
            latitude: location.lat,
            longitude: location.lng,
            isValid: true
          });
        } catch (error: any) {
          console.error('Address validation error:', error);
          res.status(500).json({ error: error.message });
        }
      }
}