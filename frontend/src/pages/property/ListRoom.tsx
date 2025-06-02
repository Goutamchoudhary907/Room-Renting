import { ChangeEvent, useEffect, useRef, useState } from "react";
import HomeIcon from "../../assets/Home_icon.png";
import axios from "axios";
import { propertySchema } from "../../../schema/dist/propertySchema.js";
import LocationIcon from "../../assets/LocationIcon.png";
import RoomIcon from "../../assets/RoomSpecificationIcon.png";
import AmenitiesIcon from "../../assets/AmenitiesIcon.png";
import { BACKEND_URL } from "../../config.js";
import { useNavigate } from "react-router-dom";
import { ChildrenProps, RoomFormData } from "../../components/Property/ListRoom/types.js";
import {
  amenityOptions,
  bathroomOptions,
  bedroomOptions,
  kitchenOptions,
  LivingRoomOptions,
  propertyOptions,
} from "../../components/Property/ListRoom/constants.js";
import { PropertyInputField } from "../../components/Property/ListRoom/FormInputs/PropertyInputField.js";
import { ImageUploader } from "../../components/Property/ListRoom/FormInputs/ImageUploader.js";
import { AmenitiesInput } from "../../components/Property/ListRoom/FormInputs/AmenitiesSelector.js";
import { SelectInput } from "../../components/Property/ListRoom/FormInputs/SelectInput.js";
import { RentalTypeInput } from "../../components/Property/ListRoom/FormInputs/RentalType.js";
import { ErrorMessage } from "../../components/Property/ListRoom/FormInputs/ErrorMessage.js";
import { useLoading } from "../../context/LoadingContext.js";
import ListRoomSkeleton from "../skeletons/property/ListRoomSkeleton.js";
import { useAuth } from "../../context/AuthContext.js";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import useMap from "../../hooks/useMap.js";

interface ListRoomProps{
  isEditMode?:boolean;
  initialFormData?:RoomFormData;
  existingImages?:string[];
  onSubmit?:(formData:RoomFormData, images:File[]) => Promise<void>;
  error?: string | null;
  validationErrors?: Record<string, string>;
}
interface Location {
  lat: number;
  lng: number;
}

interface AddressComponents {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  formattedAddress: string;
  flatOrHouse: string,
  landmark: string,
  locality: string
}

const RoomDetailsSection = ({ children }: ChildrenProps) => (
  <div className="mb-6 bg-white p-6 rounded-2xl shadow-md w-full">
    {children}
  </div>
);

const RentalAndPropertySection = ({ children }: ChildrenProps) => (
  <div className="mb-6 bg-white p-6 rounded-2xl shadow-md w-full">
    {children}
  </div>
);

const RoomSpecificationsSection = ({ children }: ChildrenProps) => (
  <div className="mb-6 bg-white p-6 rounded-2xl shadow-md w-full">
    {children}
  </div>
);

const AmenitiesSection = ({ children }: ChildrenProps) => (
  <div className="mb-6 bg-white p-6 rounded-2xl shadow-md w-full">
    {children}
  </div>
);

const RentPricingSection = ({ children }: ChildrenProps) => (
  <div className="mb-6 bg-white p-6 rounded-2xl shadow-md w-full">
    {children}
  </div>
);

const AddressSection = ({ children }: ChildrenProps) => (
  <div className="mb-6 bg-white p-6 rounded-2xl shadow-md w-full">
    {children}
  </div>
);

const libraries: ("places" | "geometry")[] = ['places'];
const MAP_CONTAINER_STYLE = { width: '100%', height: '400px' };
const DEFAULT_CENTER = { lat: 20.5937, lng: 78.9629 };

export const ListRoom: React.FC<ListRoomProps> = ({
  isEditMode = false,
  initialFormData: propInitialFormData = null,
  existingImages = [],
  onSubmit,
}) => {
  const initialRoomFormData: RoomFormData = propInitialFormData || {
    title: "",
    description: "",
    bedrooms: 1,
    bathrooms: 1,
    kitchen: "Full Kitchen",
    livingRoom: "Separate Living Room",
    propertyType: "apartment",
    rentalType: "long-term",
    pricePerNight: undefined,
    pricePerMonth: undefined,
    address: {
      country: undefined,
      flatOrHouse: undefined,
      street: undefined,
      landmark: undefined,
      locality: undefined,
      city: undefined,
      state: undefined,
      postalCode: undefined,
    },
    formattedAddress: undefined,
    amenities: [],
    depositAmount: null,
    latitude: null,
    longitude: null,
  };

  const [RoomFormData, setRoomFormData] = useState<RoomFormData>(initialRoomFormData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [generalErrors, setGeneralErrors] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState<string>("long-term");
  const navigate = useNavigate();
  const { isLoading,setLoading } = useLoading();
 const { isLoading: isAuthLoading } = useAuth();
 const [searchInput, setSearchInput] = useState("");
 const [suggestions, setSuggestions] = useState<any[]>([]);
 
 const [map, setMap] = useState<google.maps.Map | null>(null);
 const [marker, setMarker] = useState<google.maps.Marker | null>(null);
 const { isLoaded } = useJsApiLoader({
   googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
   libraries,
 });
 const { geocodeAddress } = useMap();

 const fetchAutocompleteSuggestions = async (input: string) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/map/autocomplete?input=${encodeURIComponent(input)}`);
    setSuggestions(response.data);
  } catch (error) {
    console.error('Autocomplete error:', error);
    setGeneralErrors(["Failed to fetch address suggestions"]);
  }
};
const handlePlaceSelect = async (prediction: any) => {
  try { 
    // Use the address-components endpoint with placeId
    const addressResponse = await axios.get(`${BACKEND_URL}/map/address-components?placeId=${prediction.place_id}`);
    
    setRoomFormData(prev => ({
      ...prev,
      address: {
        country: addressResponse.data.country || 'India',
        flatOrHouse: addressResponse.data.flatOrHouse || '',
        street: addressResponse.data.street || '',
        landmark: addressResponse.data.landmark || '',
        locality: addressResponse.data.locality || '',
        city: addressResponse.data.city || '',
        state: addressResponse.data.state || '',
        postalCode: addressResponse.data.postalCode || ''
      },
      latitude: addressResponse.data.latitude,
      longitude: addressResponse.data.longitude,
      formattedAddress: addressResponse.data.formattedAddress || ''
    }));

    // Update map and marker positions
    if(map && marker) {
      const latLng = new google.maps.LatLng(
        addressResponse.data.latitude,
        addressResponse.data.longitude
      );
      map.panTo(latLng);
      marker.setPosition(latLng);
    }
    
    setSearchInput(prediction.description);
    setSuggestions([]);
  } catch (error) {
    console.error('Error fetching address details:', error);
    setGeneralErrors(["Failed to load address details"]);
  }
};;

const handleMapClick = async (e: google.maps.MapMouseEvent) => {
  if (!map || !e.latLng) return;

  const lat = e.latLng.lat();
  const lng = e.latLng.lng();
  setRoomFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  try {
    const addressComponents = await reverseGeocode({ lat, lng });
    
    setRoomFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        country: addressComponents.country || 'India',
        flatOrHouse: addressComponents.flatOrHouse || '',
        street: addressComponents.street || '',
        landmark: addressComponents.landmark || '',
        locality: addressComponents.locality || '',
        city: addressComponents.city || 'Indore',
        state: addressComponents.state || 'Madhya Pradesh',
        postalCode: addressComponents.postalCode || ''
      },
      latitude: lat,
      longitude: lng,
      formattedAddress: addressComponents.formattedAddress || ''
    }));

    if (marker) marker.setPosition(e.latLng);
  } catch (error) {
    console.error('Map click geocoding error:', error);
    setGeneralErrors(["Couldn't fetch address details for this location"]);
  }
};

const handleLocationButtonClick = () => {
  if (!navigator.geolocation) {
    setGeneralErrors(["Geolocation is not supported by your browser"]);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const addressResponse = await axios.get(`${BACKEND_URL}/map/address-components`, {
          params: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        });

        setRoomFormData(prev => ({
          ...prev,
          address: {
            country: addressResponse.data.country || 'India',
            flatOrHouse: addressResponse.data.flatOrHouse || '',
            street: addressResponse.data.street || '',
            landmark: addressResponse.data.landmark || '',
            locality: addressResponse.data.locality || '',
            city: addressResponse.data.city || '',
            state: addressResponse.data.state || '',
            postalCode: addressResponse.data.postalCode || ''
          },
          latitude: addressResponse.data.latitude,
          longitude: addressResponse.data.longitude,
          formattedAddress: addressResponse.data.formattedAddress || ''
        }));

        if(map && marker) {
          const latLng = new google.maps.LatLng(
            addressResponse.data.latitude,
            addressResponse.data.longitude
          );
          map.panTo(latLng);
          marker.setPosition(latLng);
        }
      } catch (error) {
        console.error('Error fetching location details:', error);
        setGeneralErrors(["Failed to get location details"]);
      }
    },
    (error) => {
      console.error('Error getting location:', error);
      setGeneralErrors(["Please enable location access to use this feature"]);
    }
  );
};

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setRoomFormData((prevData: RoomFormData) => ({
        ...prevData,
        amenities: target.checked
          ? [...prevData.amenities, value]
          : prevData.amenities.filter((item) => item !== value),
      }));
    } else {
      setRoomFormData((prevData: RoomFormData) => ({
        ...prevData,
        [name]: [
          "pricePerNight",
          "pricePerMonth",
          "depositAmount",
          "maxGuests",
          "bedrooms",
          "bathrooms",
        ].includes(name)
          ? value === ""
            ? undefined
            : Math.round(parseFloat(value))
          : value,
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clear previous errors
    setFieldErrors((prev) => ({ ...prev, images: [] }));
  
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
  
    const files = Array.from(e.target.files).filter((file): file is File => {
      if (!file || typeof file !== 'object') {
        console.warn('Invalid file detected in selection');
        return false;
      }
  
      if (typeof file.size === 'undefined' || typeof file.type === 'undefined') {
        console.warn('File missing required properties:', file.name);
        return false;
      }
  
      if (file.size <= 0) {
        console.warn('Empty file detected:', file.name);
        return false;
      }
  
      return true;
    });
  
    if (files.length === 0) {
      setFieldErrors((prev) => ({
        ...prev,
        images: ["No valid images were selected"],
      }));
      return;
    }
  
    if (files.length + images.length > 10) {
      setFieldErrors((prev) => ({
        ...prev,
        images: ["Maximum 10 images allowed"],
      }));
      return;
    }
  
    const validFiles = files.filter((file) => {
      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      const maxSize = 5 * 1024 * 1024; // 5MB
  
      if (!validTypes.includes(file.type)) {
        setFieldErrors((prev) => ({
          ...prev,
          images: ["Only JPG, PNG, or WEBP images are allowed"],
        }));
        return false;
      }
  
      if (file.size > maxSize) {
        setFieldErrors((prev) => ({
          ...prev,
          images: ["Maximum file size is 5MB"],
        }));
        return false;
      }
  
      return true;
    });
  
   const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
  
    setImages((prev) => [...prev, ...validFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  
    return () => {
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  };
  const clearImages = () => {
    setImages([]);
    setImagePreviews([]);
    setFieldErrors((prev) => ({ ...prev, images: [] }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePropertyTypeChnage = (value: string) => {
    setRoomFormData({ ...RoomFormData, propertyType: value });
  };

  const handleSubmit = async () => {
    setFieldErrors({});
    setGeneralErrors([]);

    if (RoomFormData.amenities.length === 0) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        amenities: ["Select at least one amenity"],
      }));
      return;
    }
    setLoading(true);
    const formDataToSend = new FormData();

  // Append address components with proper nesting
  Object.entries(RoomFormData.address).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formDataToSend.append(`address[${key}]`, String(value));
    }
  });

    // Append all properties including numbers and arrays
    const { address, ...restData } = RoomFormData;
    Object.entries(restData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => formDataToSend.append(`${key}[]`, item));
        } else {
          formDataToSend.append(key, String(value));
        }
      }
    });

    images.forEach(file => formDataToSend.append("images", file))

    const dataToValidate = {
       ...RoomFormData ,
       address:{
        ...RoomFormData.address
       },
       depositAmount: undefined,
       latitude: undefined,
       longitude: undefined
      };

    if (RoomFormData.rentalType === "short-term") {
      dataToValidate.pricePerMonth = undefined;      // Explicitly remove for short-term
    } else if (RoomFormData.rentalType === "long-term") {
      dataToValidate.pricePerNight = undefined;      // Explicitly remove for long-term
    }

    const validationResult = propertySchema.safeParse(dataToValidate); // Use the modified copy
    console.log('[5] Validation result:', validationResult.success)
    if (!validationResult.success) {
      console.log('[X] Validation errors:', validationResult.error);
      setFieldErrors(validationResult.error.formErrors.fieldErrors);
      return;
    }

   if(isEditMode && onSubmit){
    console.log('[3] Using onSubmit prop')
    try {
      await onSubmit(RoomFormData,images);
      console.log('[4] onSubmit completed successfully');
      if(!isEditMode){
        setRoomFormData(initialRoomFormData);
        clearImages();
      }
      return
    }
    catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.errors) {
          const errors = error.response.data.errors;
          if (Array.isArray(errors)) {
            let general: string[] = [];
            let fieldErrors: Record<string, string[]> = {};

            errors.forEach((error: any) => {
              if (error.field) {
                fieldErrors[error.field] = fieldErrors[error.field] || [];
                fieldErrors[error.field].push(error.message);
              } else {
                general.push(error.message);
              }
            });
            setFieldErrors(fieldErrors);
            setGeneralErrors(general || []);
          } else {
            let fieldErrors: Record<string, string[]> = {};
            let generalErrors: string[] = [];
            if (errors.general) {
              generalErrors = errors.general;
            }
            for (const key in errors) {
              if (key !== "general") {
                fieldErrors[key] = errors[key];
              }
            }
            setFieldErrors(fieldErrors);
            setGeneralErrors(generalErrors);
          }
        } else {
          setGeneralErrors([error.response.data.message || "Something went wrong."]);
        }
      } else {
        setGeneralErrors(["An unexpected error occurred. Please try again."]);
      }
    }finally{
      setLoading(false);
    }
    }else{
     const formData = new FormData();

         // Handle address nesting for create operation
         Object.entries(RoomFormData.address).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(`address[${key}]`, String(value));
          }
        });

        const { address, ...rest } = RoomFormData;
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    images.forEach(file => formData.append("images", file));

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth/signin");
      return;
    }
    try {
      const response = await axios.post(
        `${BACKEND_URL}/property/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Propery created", response.data);
      setRoomFormData(initialRoomFormData);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setImages([]);
      setImagePreviews([]);
      navigate("/property/my/properties");
    } catch (error: any) {
      console.log("Error while creating propery ", error);
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.data.errors) {
          const { general, ...fieldErrors } = error.response.data.errors;
          setFieldErrors(fieldErrors);
          setGeneralErrors(general || []);
        } else {
          setGeneralErrors([
            error.response.data.message || "Something went wrong.",
          ]);
        }
      } else {
        setGeneralErrors(["An unexpected error occurred. Please try again."]);
        console.error("Non-Axios error:", error);
      }
    }finally{
      setLoading(false);
    }
  };
}

  const handleCheckBoxChange = (type: string) => {
    setIsChecked(type);
    setRoomFormData({ ...RoomFormData, rentalType: type });
  };
  const rentalTypes = [
    { value: "short-term", label: "Short Term" },
    { value: "long-term", label: "Long Term" },
    { value: "both", label: "Both" },
  ];


  // const parseAddressComponents = (components: any[]) => {
  //   const getComponent = (type: string) => 
  //     components.find(c => c.types.includes(type))?.long_name || undefined;
  
  //   return {
  //     country: getComponent('country') || 'India',
  //     flatOrHouse: [getComponent('premise'), getComponent('subpremise')]
  //       .filter(Boolean).join(' ') || undefined,
  //     street: [getComponent('street_number'), getComponent('route')]
  //       .filter(Boolean).join(' ') || undefined,
  //     landmark: getComponent('point_of_interest') || getComponent('establishment') || undefined,
  //     locality: getComponent('sublocality') || getComponent('neighborhood') || undefined,
  //     city: getComponent('locality') || getComponent('postal_town') || undefined,
  //     state: getComponent('administrative_area_level_1') || undefined,
  //     postalCode: getComponent('postal_code') || undefined
  //   };
  // };

  const reverseGeocode = async ({ lat, lng }: Location): Promise<AddressComponents> => {
    try {
      // Use the address-components endpoint for reverse geocoding
      const response = await axios.get(`${BACKEND_URL}/map/address-components?lat=${lat}&lng=${lng}`);
      
      return {
        street: response.data.street || '',
        city: response.data.city || '',
        state: response.data.state || '',
        postalCode: response.data.postalCode || '',
        country: response.data.country || 'India', // Default to India
        formattedAddress: response.data.formattedAddress || '',
        flatOrHouse: response.data.flatOrHouse || '',
        landmark: response.data.landmark || '',
        locality: response.data.locality || ''
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      return { 
        street: '', 
        city: '', 
        state: '', 
        postalCode: '', 
        country: '', 
        formattedAddress: '',
        flatOrHouse: '',
        landmark: '',
        locality: ''
      };
    }
  };


  if(isLoading|| isAuthLoading){
    return <ListRoomSkeleton/>
  }

  const handleMarkerDragEnd = async (e: google.maps.MapMouseEvent) => {
    if (!e.latLng) return;
  
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setRoomFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    try {
      const addressComponents = await reverseGeocode({ lat, lng });
      setRoomFormData(prev => ({
        ...prev,
        ...addressComponents,
        latitude: lat,
        longitude: lng,
        formattedAddress: addressComponents.formattedAddress || ''
      }));
    } catch (error) {
      console.error("Error during reverse geocoding:", error);
      setGeneralErrors(["Failed to update address from marker position"]);
    }
  };

  useEffect(() => {
    const fetchLatLng = async () => {
      if ((!RoomFormData.latitude || !RoomFormData.longitude) && RoomFormData.formattedAddress) {
        const coords = await  geocodeAddress(RoomFormData.formattedAddress);
        if (coords) {
          setRoomFormData((prev) => ({
            ...prev,
            latitude: coords.lat,
            longitude: coords.lng,
          }));

          if (map && marker) {
            const latLng = new google.maps.LatLng(coords.lat, coords.lng);
            map.panTo(latLng);
            marker.setPosition(latLng);
          }
        }
      }
    };
  
    fetchLatLng();
  }, [RoomFormData.formattedAddress, geocodeAddress, map, marker]);
  

useEffect(() => {
  if (isLoaded && propInitialFormData?.formattedAddress) {
    const initializeMapPosition = async () => {
      // Use existing coordinates if available
      if (propInitialFormData.latitude && propInitialFormData.longitude) {
        return;
      }
      
      // Geocode if coordinates are missing
      const coords = await geocodeAddress(propInitialFormData.formattedAddress ?? "");
      if (coords && map) {
        map.panTo(coords);
        if (marker) {
          marker.setPosition(coords);
        }
        
        // Update form data with coordinates
        setRoomFormData(prev => ({
          ...prev,
          latitude: coords.lat,
          longitude: coords.lng
        }));
      }
    };
    
    initializeMapPosition();
  }
}, [isLoaded, propInitialFormData, geocodeAddress, map, marker]);
  return (
    <div className="flex justify-center items-center bg-[#E6E6E6]">
      <div className="h-full pt-4 lg:pt-20 p-4 lg:p-15 w-full lg:w-auto">
        <div className="lg:w-full">
          <h2 className="text-[#111827] font-bold text-xl lg:text-2xl">
            {isEditMode ? 'Edit Your Room' : "List Your Room"}
          </h2>
          <p className="text-base lg:text-[17px] text-[#4B5563] mt-1">
            {isEditMode ? 'Update the details of your listing' : 'Fill in the details to create your listing'}
          </p>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200 text-sm lg:text-base">
          <h3 className="font-semibold text-blue-800 mb-2">Upload Requirements:</h3>
          <ul className="list-disc pl-5 text-blue-700">
            <li>Maximum 10 images per property</li>
            <li>Each image must be under 5MB</li>
            <li>Only JPG/PNG image formats accepted</li>
          </ul>
        </div>

        <div className="h-full flex flex-col items-start w-full pt-4 mt-4 lg:mt-6 rounded-2xl">
          {/* Room Details Section */}
          <RoomDetailsSection>
            <div className="flex items-center">
              <img className="mr-1 w-5 h-5 lg:w-6 lg:h-6" src={HomeIcon} alt="Home Icon" />
              <h3 className="font-semibold text-lg lg:text-xl">Room Details</h3>
            </div>
            <div className="mt-3 lg:mt-4">
              <PropertyInputField
                label="Room Title"
                type="text"
                placeholder="Enter an attractive title for your room"
                id="title"
                name="title"
                value={RoomFormData.title}
                className="mt-1 lg:mt-2"
                onChange={handleChange}
              />
              {fieldErrors.title && (
                <ErrorMessage message={fieldErrors.title[0]} className="mt-1" />
              )}
            </div>

            <div className="mt-3 lg:mt-4">
              <PropertyInputField
                label="Description"
                type="textarea"
                placeholder="Describe your room in detail"
                id="description"
                name="description"
                value={RoomFormData.description}
                className="mt-1 lg:mt-2"
                onChange={handleChange}
              />
              {fieldErrors.description && (
                <ErrorMessage message={fieldErrors.description[0]} className="mt-1" />
              )}
            </div>

            <div className="mt-3 lg:mt-4">
              <ImageUploader
                images={images}
                imagePreviews={[...existingImages, ...imagePreviews]}
                onChange={handleImageChange}
                onClear={clearImages}
                fileInputRef={fileInputRef}
              />
              {fieldErrors.images && (
                <ErrorMessage message={fieldErrors.images[0]} className="mt-1" />
              )}
            </div>
          </RoomDetailsSection>

          {/* Rental and Property Section */}
          <RentalAndPropertySection>
  <div className="flex items-center mb-3 lg:mb-4 w-full">
    <img className="mr-1 w-5 h-5 lg:w-6 lg:h-6" src={LocationIcon} alt="Location Icon" />
    <h3 className="font-semibold text-lg lg:text-xl">Rental and Property Type</h3>
  </div>

  <h2 className="mt-3 lg:mt-5 font-semibold text-[#374151]">Rental Type</h2>

  <div className="flex flex-col lg:flex-row gap-3 lg:gap-6 mt-2">
    {rentalTypes.map((type) => (
      <div
        key={type.value}
        className="pl-3 lg:pl-4 h-9 lg:h-10 w-full lg:w-75 border rounded-lg border-gray-300"
        onClick={() => handleCheckBoxChange(type.value)}
      >
        <label className="relative inline-flex items-center cursor-pointer w-full h-full">
          <input
            type="radio"
            value={type.value}
            id={type.value}
            className="opacity-0 w-0 h-0"
            checked={isChecked === type.value}
            name="rentalType"
            readOnly
          />
          <span className="rounded-full w-4 h-4 border-2 border-blue-500 inline-flex items-center justify-center mr-2">
            {isChecked === type.value && (
              <span className="rounded-full w-2 h-2 bg-blue-500"></span>
            )}
          </span>
          <span className="font-normal text-sm lg:text-base">{type.label}</span>
        </label>
      </div>
    ))}
  </div>

  {fieldErrors.rentalType && (
    <ErrorMessage message={fieldErrors.rentalType[0]} className="mt-2" />
  )}

  <div className="pt-3 lg:pt-5">
    <RentalTypeInput
      label="Property Type"
      id="propertyType"
      options={propertyOptions}
      value={RoomFormData.propertyType}
      onChange={handlePropertyTypeChnage}
    />
    {fieldErrors.propertyType && (
      <ErrorMessage message={fieldErrors.propertyType[0]} className="mt-2" />
    )}
  </div>
</RentalAndPropertySection>


          {/* Room Specifications Section */}
          <RoomSpecificationsSection>
            <div className="flex items-center mb-3 lg:mb-4 w-full">
              <img className="mr-1 w-5 h-5 lg:w-6 lg:h-6" src={RoomIcon} alt="Room Icon" />
              <h3 className="font-semibold text-lg lg:text-xl">Room Specification</h3>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mt-3 lg:mt-4 w-full">
              <div className="w-full lg:w-1/2">
                <SelectInput
                  label="Number of Bedrooms"
                  id="bedroom"
                  name="bedrooms"
                  options={bedroomOptions}
                  value={RoomFormData.bedrooms}
                  onChange={handleChange}
                  error={fieldErrors.bedrooms?.[0]}
                />
              </div>

              <div className="w-full lg:w-1/2">
                <SelectInput
                  label="Number of Bathrooms"
                  id="bathrooms"
                  name="bathrooms"
                  options={bathroomOptions}
                  value={RoomFormData.bathrooms}
                  onChange={handleChange}
                  error={fieldErrors.bathrooms?.[0]}
                />
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 lg:gap-4 mt-3 lg:mt-4 w-full">
              <div className="w-full lg:w-1/2">
                <SelectInput
                  label="Kitchen"
                  id="kitchen"
                  name="kitchen"
                  options={kitchenOptions}
                  value={RoomFormData.kitchen}
                  onChange={handleChange}
                  error={fieldErrors.kitchen?.[0]}
                />
              </div>

              <div className="w-full lg:w-1/2">
                <SelectInput
                  label="Living Room"
                  id="livingRoom"
                  name="livingRoom"
                  options={LivingRoomOptions}
                  value={RoomFormData.livingRoom}
                  onChange={handleChange}
                  error={fieldErrors.livingRoom?.[0]}
                />
              </div>
            </div>
          </RoomSpecificationsSection>

          {/* Amenities Section */}
          <AmenitiesSection>
            <div className="flex items-center mb-3 lg:mb-4 w-full">
              <img className="mr-1 w-5 h-5 lg:w-6 lg:h-6" src={AmenitiesIcon} alt="Amenities Icon" />
              <h3 className="font-semibold text-lg lg:text-xl">Amenities</h3>
            </div>
            
            <AmenitiesInput
              id="amenities"
              value={RoomFormData.amenities}
              options={amenityOptions}
              onChange={(values) => {
                setRoomFormData((prevData: RoomFormData) => ({
                  ...prevData,
                  amenities: values,
                }));
              }}
            />
            {fieldErrors.amenities && (
              <ErrorMessage message={fieldErrors.amenities[0]} className="mt-2" />
            )}
          </AmenitiesSection>

          {/* Rent Pricing Section */}
          <RentPricingSection>
            <div className="flex items-center mb-3 lg:mb-4 w-full">
              <img className="mr-1 w-5 h-5 lg:w-6 lg:h-6" src={AmenitiesIcon} alt="Pricing Icon" />
              <h3 className="font-semibold text-lg lg:text-xl">Pricing</h3>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-15 mt-2">
              {(RoomFormData.rentalType === "short-term" || RoomFormData.rentalType === "both") && (
                <div className="mt-2 flex flex-col w-full lg:w-auto">
                  <label className="mb-1 text-sm lg:text-base" htmlFor="pricePerNight">
                    Price Per Night (₹)
                  </label>
                  <input
                    className="pl-3 lg:pl-4 border border-gray-300 h-9 lg:h-10 w-full lg:w-110 rounded-md focus:outline-none"
                    type="number"
                    placeholder="200"
                    min="200"
                    id="pricePerNight"
                    name="pricePerNight"
                    aria-label="Price Per Night (INR)"
                    value={RoomFormData.pricePerNight === undefined ? "" : RoomFormData.pricePerNight}
                    onChange={handleChange}
                  />
                  {fieldErrors.pricePerNight && (
                    <ErrorMessage message={fieldErrors.pricePerNight[0]} className="mt-1" />
                  )}
                </div>
              )}
              
              {(RoomFormData.rentalType === "long-term" || RoomFormData.rentalType === "both") && (
                <div className="mt-2 flex flex-col w-full lg:w-auto">
                  <label className="mb-1 text-sm lg:text-base" htmlFor="pricePerMonth">
                    Price Per Month (₹)
                  </label>
                  <input
                    className="pl-3 lg:pl-4 border border-gray-300 h-9 lg:h-10 w-full lg:w-110 rounded-md focus:outline-none"
                    type="number"
                    placeholder="5000"
                    min="2000"
                    id="pricePerMonth"
                    name="pricePerMonth"
                    step="1"
                    onBlur={(e) => {
                      const value = e.target.value;
                      if (value) {
                        e.target.value = Math.round(parseFloat(value)).toString();
                      }
                    }}
                    aria-label="Price Per Month (INR)"
                    value={RoomFormData.pricePerMonth === undefined ? "" : RoomFormData.pricePerMonth}
                    onChange={handleChange}
                  />
                  {fieldErrors.pricePerMonth && (
                    <ErrorMessage message={fieldErrors.pricePerMonth[0]} className="mt-1" />
                  )}
                </div>
              )}
            </div>
          </RentPricingSection>

          {/* Address Section */}
          <AddressSection>
  <div className="flex items-center mb-3 lg:mb-4 w-full">
    <img className="mr-1 w-5 h-5 lg:w-6 lg:h-6" src={LocationIcon} alt="Location Icon" />
    <h3 className="font-semibold text-lg lg:text-xl">Location Details</h3>
  </div>

  {isLoaded ? (
    <>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Address (Start typing to see suggestions)
        </label>

        <input
          type="text"
          placeholder="Search property address"
          className="w-full p-3 border rounded-lg mb-4"
          value={searchInput}
          onChange={async (e) => {
            const input = e.target.value;
            setSearchInput(input);
            if (input.length > 2) {
              await fetchAutocompleteSuggestions(input);
            } else {
              setSuggestions([]);
            }
          }}
        />
       {suggestions.length > 0 && (
          <div className="absolute z-10 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((prediction) => (
              <div
                key={prediction.place_id}
                className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handlePlaceSelect(prediction)}
              >
                <div className="font-medium text-gray-800">
                  {prediction.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country/region
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            value="India"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Flat, house no., building, etc.
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            value={RoomFormData.address.flatOrHouse}
            onChange={(e) => setRoomFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                flatOrHouse: e.target.value
              }
            }))}
            placeholder="e.g. Flat 301, Bldg A"
          />
          {fieldErrors.street && (
    <ErrorMessage message={fieldErrors.flatOrHouse[0]} className="mt-1" />
  )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Street address
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            value={RoomFormData.address.street}
            onChange={(e) => setRoomFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                street: e.target.value
              }
            }))}
            placeholder="e.g. MG Road"
          />
          {fieldErrors.street && (
    <ErrorMessage message={fieldErrors.street[0]} className="mt-1" />
  )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nearby landmark (optional)
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            value={RoomFormData.address.landmark}
            onChange={(e) => setRoomFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                landmark: e.target.value
              }
            }))}
            placeholder="e.g. Near City Mall"
          />
          {fieldErrors.street && (
    <ErrorMessage message={fieldErrors.landmark[0]} className="mt-1" />
  )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            District/locality
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            value={RoomFormData.address.locality}
            onChange={(e) => setRoomFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                locality: e.target.value
              }
            }))}
            placeholder="e.g. Andheri East"
          />
          {fieldErrors.street && (
    <ErrorMessage message={fieldErrors.locality[0]} className="mt-1" />
  )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City/town
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            value={RoomFormData.address.city}
            onChange={(e) => setRoomFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                city: e.target.value
              }
            }))}
            placeholder="e.g. Mumbai"
          />
           {fieldErrors.city && (
            <ErrorMessage message={fieldErrors.city[0]} className="mt-1" />
            )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State/UT
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            value={RoomFormData.address.state}
            onChange={(e) => setRoomFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                state: e.target.value
              }
            }))}
            placeholder="e.g. Maharashtra"
          />
          {fieldErrors.street && (
    <ErrorMessage message={fieldErrors.state[0]} className="mt-1" />
  )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PIN code
          </label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg"
            value={RoomFormData.address.postalCode}
            onChange={(e) => setRoomFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                postalCode: e.target.value
              }
            }))}
            placeholder="e.g. 400001"
            maxLength={6}
          />
          {fieldErrors.street && (
    <ErrorMessage message={fieldErrors.postal_code[0]} className="mt-1" />
  )}
        </div>
      </div>
      <div className="mb-4">
  <label className="block font-medium text-gray-700 mb-1">Full Address</label>
  <input
    type="text"
    className="w-full p-3 border rounded-lg bg-gray-100"
    value={RoomFormData.formattedAddress || ''}
    readOnly
    placeholder="Full formatted address will appear here"
  />
</div>

      <div className="h-96 rounded-lg overflow-hidden mb-4 border relative">
        <GoogleMap
         options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              gestureHandling: "greedy",
            }}
          mapContainerStyle={MAP_CONTAINER_STYLE}
          center={
            RoomFormData.latitude && RoomFormData.longitude
              ? { 
                  lat: RoomFormData.latitude, 
                  lng: RoomFormData.longitude 
                }
              : DEFAULT_CENTER
          }
          zoom={15}
          onLoad={(mapInstance) => {
            setMap(mapInstance);
            // Center to initial position if coordinates exist
            if (RoomFormData.latitude && RoomFormData.longitude) {
              mapInstance.panTo({ 
                lat: RoomFormData.latitude, 
                lng: RoomFormData.longitude 
              });
            }
          }}
          onClick={handleMapClick}
        >
          <Marker
            position={
              RoomFormData.latitude && RoomFormData.longitude
                ? { 
                    lat: RoomFormData.latitude, 
                    lng: RoomFormData.longitude 
                  }
                : DEFAULT_CENTER
            }
            onLoad={(markerInstance) => {
              setMarker(markerInstance);
              // Set to initial position if coordinates exist
              if (RoomFormData.latitude && RoomFormData.longitude) {
                markerInstance.setPosition({ 
                  lat: RoomFormData.latitude, 
                  lng: RoomFormData.longitude 
                });
              }
            }}
            draggable={true}
            onDragEnd={handleMarkerDragEnd}
          />
        </GoogleMap>

    
      </div>

      <div className="text-sm text-gray-500 mb-4">
        <p>Please verify the pin location is accurate. Guests will see this exact location.</p>
      </div>
    </>
  ) : (
    <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
      <p>Loading map...</p>
    </div>
  )}
   </AddressSection>


          {generalErrors.length > 0 && (
            <div className="mb-4 lg:mb-6 p-3 lg:p-4 bg-red-50 border-l-4 border-red-500">
              <h3 className="font-semibold text-red-800 mb-1 lg:mb-2 text-sm lg:text-base">
                Please correct these issues:
              </h3>
              <ul className="list-disc pl-4 lg:pl-5 text-red-700 text-xs lg:text-sm">
                {generalErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleSubmit}
            type={isEditMode ? "button" : "submit"}
            className="mt-3 lg:mt-4 px-4 py-2 text-white bg-[#2563EB] rounded-lg text-sm lg:text-base font-medium cursor-pointer w-full lg:w-auto"
          >
            {isEditMode ? 'Save Changes' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};
