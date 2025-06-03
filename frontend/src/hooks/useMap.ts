import { useState, useCallback } from 'react';
import axios from 'axios';
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const useMap = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);

  const geocodeAddress = useCallback(async (address: string) => {
    setLoading(true);
    setError(null);
    try {
      if (!address.trim()) {
        throw new Error('Address is required');
      }

      const response = await axios.get(`${BACKEND_URL}/map/geocode`, {
        params: {address}
      });
      const lat = parseFloat(response.data.lat);
    const lng = parseFloat(response.data.lng);

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Invalid coordinates received from geocoding API');
    }

    return { lat, lng };

    } catch (err:any) {
      setError(err.response?.data?.error || 'Geocoding failed');
      return null;
    } finally {      
      setLoading(false);
    }
  }, []);

  const getRouteAlternatives = useCallback(async (origin: string, destination: string) => {
    setLoading(true);
    setError(null);
    try {
        const directionsService = new google.maps.DirectionsService();
      const result = await new Promise<google.maps.DirectionsResult>((resolve, reject) => {
        directionsService.route(
          {
            origin,
            destination,
            travelMode: google.maps.TravelMode.DRIVING,
            provideRouteAlternatives: true,
          },
          (result, status) => {
            if (status === 'OK' && result) {
              resolve(result);
            } else {
              reject(new Error('Directions request failed: ' + status));
            }
          }
        );
      });
     setRoutes(result.routes)
      return result.routes;
    } catch (err:any) {
      setError(err.response?.data?.error || 'Route fetching failed');
      return null;
    }finally {
      setLoading(false);
    }
  },[])

  return { geocodeAddress, getRouteAlternatives,routes,loading, error };
};

export default useMap;