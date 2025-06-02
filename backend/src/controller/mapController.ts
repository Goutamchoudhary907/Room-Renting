import { Request, Response } from 'express';
import mapService from "../services/mapService.js"

export default {

    async autoComplete(req:Request, res:Response){
        try {
            const {input} =req.query;
            if(!input || typeof input !== 'string'){
                 res.status(400).json({ error: 'Input parameter is required' });
                 return
            }
            const predictions=await mapService.autoComplete(input);
            res.json(predictions);

        } catch (error:any) {
            console.error('Autocomplete error: ', error);
            res.status(500).json({ error: error.message });
        }
    }, 
    async getDirections(req:Request, res:Response) {
        try {
            const {origin,destination} =req.body;
            if(!origin || !destination){
               res.status(400).json({ error: 'Origin and destination are required' });
               return
            }

            const directions=await mapService.getDirections(origin,destination);
            res.json(directions);
        } catch (error:any) {
            console.error('Directions error:', error);
            res.status(500).json({ error: error.message });
        }
    } , 

    async getPlaceDetails(req:Request,res:Response){
        try {
            const {placeId} =req.params;
            if(!placeId){
             res.status(400).json({ error: 'Place ID is required' });
             return
            }

            const details=await mapService.getPlaceDetails(placeId);
            if (!details) {
                res.status(404).json({ error: 'Place details not found' });
                return;
              }
              const parsed = mapService.parseAddressComponents(
                details.address_components || [],
                details.formatted_address || '',
                details.name
              );
              
        
              res.json({
                parsedAddress: parsed,
                rawDetails: details
              });
        
            // res.json(details);
        } catch (error:any) {
            console.error('Place details error:', error);
            res.status(500).json({ error: error.message });
        }
    },

    async geocode(req:Request,res:Response){
        try {
            const {address} =req.query;
            if (!address || typeof address !== 'string') {
                 res.status(400).json({ error: 'Address is required and must be a string' });
                 return
            }
            const location=await mapService.geocodeAddress(address);
            res.json(location);
        } catch (error:any) {
            console.error('Geocoding error:', error);
           res.status(500).json({ error: error.message });
        }
    }
}