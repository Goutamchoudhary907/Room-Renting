import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

interface AvailabilityResponse {
  available: boolean;
  conflict?: {
    bookingId: string;
    dates: {
      from: string;
      to: string;
    };
  };
}

export const checkAvailability = async (
  propertyId: string,
  startDate: Date,
  endDate: Date,
  rentalType: 'short-term' | 'long-term'
) => {
  try {
    const response = await axios.get<AvailabilityResponse>(
      `${BACKEND_URL}/booking/check-availability`,
      {  
        params: {
          propertyId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          rentalType
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Availability check failed:', error);
    throw error;
  }
};