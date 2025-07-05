import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const useBookingStatus= (propertyId:string) =>{
     const [hasBooked, setHasBooked] = useState(false);
    const { user, token } = useAuth();

     useEffect(() => {
    const checkBookingStatus = async () => {
      if (!user || !propertyId) return;
      
      try {
        const response = await axios.get(
          `${BACKEND_URL}/booking/check-status/${propertyId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHasBooked(response.data.hasBooked);
      } catch (error) {
        console.error("Error checking booking status:", error);
      }
    };

    checkBookingStatus();
  }, [propertyId, user, token]);
  return { hasBooked };
}