import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomFormData } from "../ListRoom/types";
import { BACKEND_URL } from "../../../config";
import axios from "axios";
import { ListRoom } from "../ListRoom/ListRoom";

export const EditRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialFormData, setInitialFormData] = useState<RoomFormData | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchProperty = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${BACKEND_URL}/property/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setInitialFormData({
          ...response.data,
          pricePerMonth: response.data.pricePerMonth ?? 0,
          pricePerNight: response.data.pricePerNight ?? 0,
          depositAmount: response.data.depositAmount ?? 0,
        });
        setExistingImages(response.data.images?.map((img: { url: any }) => img.url) || []);
      } catch (error) {
        console.error("Error fetching property:", error);
        navigate("/property/my/properties");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProperty();
  }, [id, navigate]);

  useEffect(() => {
    console.log("Initial form data:", initialFormData);
  }, [initialFormData]);

  const handleSubmit = async (formData: RoomFormData, images: File[]) => {
    setError(null);
    setValidationErrors({});

    const sanitizedData = {
      title: formData.title || "",
      description: formData.description || "",
      address: formData.address || "",
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
          value.forEach((item) => formDataToSend.append(`${key}[]`,item));
        } else {
          formDataToSend.append(key, String(value));
        }
      }
    });

    if (images) {
      images.forEach((file) => formDataToSend.append("images", file));
    }

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
  }}

  
  if (isLoading) return <div>Loading...</div>;
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