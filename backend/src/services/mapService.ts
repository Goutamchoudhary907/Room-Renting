import {AddressComponent, Client, TravelMode, AddressType} from "@googlemaps/google-maps-services-js"
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
                    fields: ['geometry', 'name', 'formatted_address', 'address_components']
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
  },

async reverseGeocode(lat: number, lng: number) {
  try {
    if(!process.env.GOOGLE_MAPS_API_KEY){
      throw new Error('Google Maps API key not configured');
    }
    const response = await client.reverseGeocode({
      params: {
        latlng: `${lat},${lng}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
        result_type: [AddressType.street_address, AddressType.premise, AddressType.subpremise]
      }
    });

    if (!response.data.results || response.data.results.length === 0) {
      return null;
    }

    return this.parseAddressComponents(response.data.results[0].address_components,
       response.data.results[0].formatted_address);
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    throw new Error("Reverse geocoding failed");
  }
},

parseAddressComponents(components: any[], formattedAddress: string , establishmentName?:string): {
  country: string | null;
  establishmentName:string | null,
  flatOrHouse: string | null;
  street: string | null;
  landmark: string | null;
  locality: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  formattedAddress: string | null;
} {
  const getComponent = (type: string) => 
    components.find(c => c.types.includes(type))?.long_name || null;

  const addressParts = formattedAddress.split(',').map(p => p.trim());
  
  return {
    country: getComponent('country') || 'India',
    establishmentName: establishmentName || null,
    flatOrHouse: [
      getComponent('street_number'),
      getComponent('premise'),
      addressParts[0] // First part of formatted address
    ].find(Boolean) || null,
    street: [
      getComponent('route'),
      addressParts[1] // Second part of formatted address
    ].find(Boolean) || null,
    landmark: [
      getComponent('point_of_interest'),
      getComponent('establishment')
    ].find(Boolean) || null,
    locality: [
      getComponent('sublocality'),
      addressParts[2] // Third part of formatted address
    ].find(Boolean) || null,
    city: getComponent('locality') || 'Indore',
    state: getComponent('administrative_area_level_1') || 'Madhya Pradesh',
    postalCode: getComponent('postal_code') || null,
    formattedAddress: formattedAddress || null
  };
  
}
 
  }