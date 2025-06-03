import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomFormData } from "../../components/Property/ListRoom/types";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import axios from "axios";
import { ListRoom } from "./ListRoom";
import { useLoading } from "../../context/LoadingContext";
import ListRoomSkeleton from "../skeletons/property/ListRoomSkeleton";
import { useAuth } from "../../context/AuthContext";

export const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialFormData, setInitialFormData] = useState<RoomFormData | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
const { isLoading,setLoading } = useLoading();
 const { isLoading: isAuthLoading } = useAuth();
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${BACKEND_URL}/property/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const parseCoordinate = (value: any): number | null => {
          if (value === null || value === undefined) return null;
          if (typeof value === 'number') return value;
          const parsed = parseFloat(value);
          return isNaN(parsed) ? null : parsed;
        };

        const address = {
          country: response.data.country || "India",
          flatOrHouse: response.data.flatOrHouse || "",
          street: response.data.street || "",
          landmark: response.data.landmark || "",
          locality: response.data.locality || "",
          city: response.data.city || "",
          state: response.data.state || "",
          postalCode: response.data.postalCode || "",
        };
        
        setInitialFormData({
          ...response.data,
          address,
          formattedAddress: response.data.formattedAddress || "",
          latitude: parseCoordinate(response.data.latitude),
          longitude: parseCoordinate(response.data.longitude),
          pricePerMonth: response.data.pricePerMonth ?? 0,
          pricePerNight: response.data.pricePerNight ?? 0,
          depositAmount: response.data.depositAmount ?? 0,
        });
        setExistingImages(response.data.images?.map((img: { url: any }) => img.url) || []);
      } catch (error) {
        console.error("Error fetching property:", error);
        navigate("/property/my/properties");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, navigate]);


  
  useEffect(() => {
    console.log("Initial form data:", initialFormData);
  }, [initialFormData]);

  
  const handleSubmit = async (formData: RoomFormData, images: File[]) => {
    setLoading(true);
    setError(null);
    setValidationErrors({});

    const sanitizedData = {
      title: formData.title || "",
      description: formData.description || "",
      // Top-level address fields
      street: formData.address?.street || "",
      city: formData.address?.city || "",
      state: formData.address?.state || "",
      postalCode: formData.address?.postalCode || "",
      country: formData.address?.country || "",
      flatOrHouse: formData.address?.flatOrHouse || "",
      landmark: formData.address?.landmark || "",
      locality: formData.address?.locality || "",      
      formattedAddress: formData.formattedAddress || "",
  
      pricePerNight: formData.pricePerNight ?? 0,
      pricePerMonth: formData.pricePerMonth ?? 0,
      bedrooms: formData.bedrooms ?? 0,
      bathrooms: formData.bathrooms ?? 0,
      rentalType: formData.rentalType,
      propertyType: formData.propertyType,
      amenities: formData.amenities || [],
    };

    const formDataToSend = new FormData();

    Object.entries(sanitizedData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((item) => formDataToSend.append(`${key}[]`, item));
        } else {
          formDataToSend.append(key, String(value));
        }
      }
    });
    console.log("Address object before sending:", formData.address);

    if (images) {
      images.forEach((file) => formDataToSend.append("images", file));
    }
    console.log("Full formData before sending:", formData);
    console.log("Address object before sending:", formData.address);

    const token = localStorage.getItem("token");
    try {
      await axios.put(`${BACKEND_URL}/property/edit/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      navigate("/property/my/properties");
    } catch (error: any) {
      console.error("Error updating property:", error);

      if (error.response?.data?.errors) {
        const errors: Record<string, string> = {};
        const errorList = Array.isArray(error.response.data.errors) 
            ? error.response.data.errors 
            : Object.values(error.response.data.errors).flat();
    
        errorList.forEach((err: any) => {
            const field = err.path?.[0];
            if (field && err.message) {
                errors[field] = err.message;
            }
        });
    
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
        } else {
            setError("Invalid error format received");
        }
    } else {
        setError(error.response?.data?.message || "Update failed");
    }
  }finally{
    setLoading(false)
  }
}

  
  if (isLoading || isAuthLoading){
    return <ListRoomSkeleton/>
  }
  if (!initialFormData) return null;

  return (
    <ListRoom
      isEditMode={true}
      initialFormData={initialFormData}
      existingImages={existingImages}
      onSubmit={handleSubmit}
      error={error}
      validationErrors={validationErrors}
    />
  );
}