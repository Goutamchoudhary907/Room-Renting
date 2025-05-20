import {Client,TravelMode} from "@googlemaps/google-maps-services-js"
import dotenv from 'dotenv';

dotenv.config();
const client= new Client({});

interface GeocodeResult {
    lat: number;
    lng: number;
  }
  
export default {
    async autoComplete(input:string) {
        try {
            if(!process.env.GOOGLE_MAPS_API_KEY){
                console.error(' Missing GOOGLE_MAPS_API_KEY environment variable');
                throw new Error('Google Maps API key not configured');
            }
            const response=await client.placeAutocomplete({
                params:{
                    input,
                    key:process.env.GOOGLE_MAPS_API_KEY,
                    components: ['country:in'],
                },
            });
             return response.data.predictions;
        } catch (error) {
            throw new Error("Autocomplete failed");
        }
    },

    async getDirections(origin:string, destination:string){
     try {
        if(!process.env.GOOGLE_MAPS_API_KEY){
            console.error(' Missing GOOGLE_MAPS_API_KEY environment variable');
            throw new Error('Google Maps API key not configured');
        }
        const response=await client.directions({
            params:{
                origin,
                destination,
                key:process.env.GOOGLE_MAPS_API_KEY,
                mode: TravelMode.driving,
                alternatives:true,
            },
             timeout:5000
        })
        return response.data;
     } catch (error) {
        console.error('Directions error:', error);
        throw new Error("Failed to get directions. Please check your locations and try again.");
     }
    } ,
    async getPlaceDetails(placeId:string){
        try {
            if(!process.env.GOOGLE_MAPS_API_KEY){
                console.error('❌ Missing GOOGLE_MAPS_API_KEY environment variable');
                throw new Error('Google Maps API key not configured');
            }

            const response=await client.placeDetails({
                params:{
                    place_id:placeId,
                    key:process.env.GOOGLE_MAPS_API_KEY,
                    fields:['geometry', 'name' , 'formatted_address']
                }
            });
            return response.data.result;

        } catch (error) {
             console.error('Place details error:', error);
            throw new Error("Failed to get place details.");
        }
    },

async geocodeAddress(address:string):Promise<GeocodeResult| null> {
    try {
      if(!process.env.GOOGLE_MAPS_API_KEY){
        throw new Error('Google Maps API key not configured');
      }
      const response = await client.geocode({
        params: {
          address,
          key: process.env.GOOGLE_MAPS_API_KEY
        }
      });
      if (!response.data.results || response.data.results.length === 0) {
        return null;
      }

         return {
        lat: response.data.results[0].geometry.location.lat,
        lng: response.data.results[0].geometry.location.lng
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error("Geocoding failed");
    }
  }
}