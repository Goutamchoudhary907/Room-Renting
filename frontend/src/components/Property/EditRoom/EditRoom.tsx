import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { RoomFormData } from "../ListRoom/types";
import { BACKEND_URL } from "../../../config";
import axios from "axios";
import { ListRoom } from "../ListRoom/ListRoom";

/*
Use vscode copilot for solve this error
*/








export const EditRoom= () =>{
    const {id} =useParams();
    const navigate=useNavigate();
    const[initialFormData,setInitialFormData]=useState<RoomFormData | null>(null);
    const [existingImages, setExistingImages]=useState<string[]>([]);
    const[isLoading, setIsLoading]=useState(true);

    useEffect(() =>{
        const fetchProperty=async () =>{
            const token=localStorage.getItem("token");
            try {
              const response=await axios.get(`${BACKEND_URL}/property/${id}`,{
                headers:{
                    Authorization:`Bearer ${token}`
                },
              });
              setInitialFormData(response.data);
              setExistingImages(response.data.images?.map((img: { url: any; }) => img.url) || []);
            } catch (error) {
                console.error("Error fetching property:", error);
                navigate("/property/my/properties");
            }finally{
                setIsLoading(false);
            }
        };
        fetchProperty();
    },[id,navigate]);


    
    const handleSubmit = async (formData: RoomFormData, images: File[]) => {

        const formDataToSend = new FormData();
        console.log("Bedroom value: ", formData.bedrooms, typeof formData.bedrooms);
        formDataToSend.append('bedrooms', String(formData.bedrooms));
        console.log("Bedroom value: ", formData.bedrooms, typeof formData.bedrooms);
        console.log('FormData entries before request:');


      Object.entries(formData).forEach(([key, value]) => {
          if (value !== undefined && value !== null && key !== "bedrooms") {
              if (Array.isArray(value)) {
                  value.forEach(item => formDataToSend.append(key, item));
              } else {
                  formDataToSend.append(key, String(value));
              }
          }
      });
      for (const [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }
        if (images) Array.from(images).forEach((file) => formDataToSend.append("images", file));
        console.log("Bedroom value: ", formData.bedrooms, typeof formData.bedrooms);
     
        const token = localStorage.getItem("token");
        try {
          await axios.put(`${BACKEND_URL}/property/edit/${id}`, formDataToSend, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error:any) {
          console.error('Full error details:', {
      config: error.config,
      response: {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      },
      message: error.message,
    });
    
    if (error.response?.data?.errors) {
      console.error('Backend validation errors:', error.response.data.errors);
    }
    
    alert(`Update failed: ${error.response?.data?.message || 'Unknown error'}`);
          
        }
        // navigate("/property/my/properties");
      };
    
      if (isLoading) return <div>Loading...</div>;
      if (!initialFormData) return null;
      console.log("Initial form data:", initialFormData);
      
      return (
        <ListRoom
          isEditMode={true}
          initialFormData={initialFormData}
          existingImages={existingImages}
          onSubmit={handleSubmit}
        />
      );
    };