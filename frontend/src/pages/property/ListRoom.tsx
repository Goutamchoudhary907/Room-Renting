import { ChangeEvent, useEffect, useRef, useState } from "react";
import axios from "axios";
import { propertySchema } from "../../../schema/src/propertySchema.js";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { useNavigate } from "react-router-dom";
import { RoomFormData } from "../../components/Property/ListRoom/types.js";
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
import { FormSection, SectionNav } from "../../components/Property/ListRoom/FormSection.js";
import {
  ArrowRightIcon,
  BedIcon,
  HouseIcon,
  MapPinIcon,
  TagIcon,
  ZapIcon,
} from "../../components/Home/icons.js";

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
      country: '',
      flatOrHouse: '',
      street: '',
      landmark: '',
      locality: '',
      city: '',
      state: '',
      postalCode: '',
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
 const [isSubmitting, setIsSubmitting] = useState(false);
 const scrollToFirstError = () => {
  setTimeout(() => {
    const firstErrorField = document.querySelector('[data-error="true"]');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      (firstErrorField as HTMLElement).focus();
    }
  }, 100);
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
      dataToValidate.pricePerMonth = undefined;      
    } else if (RoomFormData.rentalType === "long-term") {
      dataToValidate.pricePerNight = undefined;     
    }

    const validationResult = propertySchema.safeParse(dataToValidate);
    console.log('[5] Validation result:', validationResult.success);
    
    let combinedErrors: Record<string, string[]> = {};
    
    if (!validationResult.success) {
      const rawErrors = validationResult.error.formErrors.fieldErrors;
      Object.entries(rawErrors).forEach(([key, value]) => {
        if (key.startsWith('address.')) {
          const fieldName = key.replace('address.', '');
          combinedErrors[fieldName] = value;
        } else if (key === 'address' && Array.isArray(value)) {
          const addressFields = ['street', 'city', 'state', 'postalCode'];
          value.forEach((msg, index) => {
            if (index < addressFields.length) {
              const field = addressFields[index];
              if (!combinedErrors[field]) combinedErrors[field] = [];
              combinedErrors[field].push(msg);
            }
          });
        } else {
          combinedErrors[key] = value;
        }
      });
    }
    
    if (images.length === 0) {
      combinedErrors.images = ["At least one image is required"];
    }
    
    if (Object.keys(combinedErrors).length > 0) {
      setFieldErrors(combinedErrors);
      setLoading(false);
      scrollToFirstError();
      return;
    }

   if(isEditMode && onSubmit){
    console.log('[3] Using onSubmit prop')
    try {
      setIsSubmitting(true)
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
            scrollToFirstError();  
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
        } else if (error.response.data.error) {
          setGeneralErrors([error.response.data.error]);
        } else if (error.response.data.message) {
          setGeneralErrors([error.response.data.message]);
        } else {
          setGeneralErrors(["Something went wrong."]);
        }
      } else {
        setGeneralErrors(["An unexpected error occurred. Please try again."]);
      }
    }finally{
      setIsSubmitting(false)
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
      setIsSubmitting(true); 
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
          scrollToFirstError();  
        } else if (error.response.data.error) {
          setGeneralErrors([error.response.data.error]);
        } else if (error.response.data.message) {
          setGeneralErrors([error.response.data.message]);
        } else {
          setGeneralErrors(["Something went wrong."]);
        }
      } else {
        setGeneralErrors(["An unexpected error occurred. Please try again."]);
        console.error("Non-Axios error:", error);
      }
    }finally{
      setLoading(false);
      setIsSubmitting(false);
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
  if(isLoading|| isAuthLoading){
    return <ListRoomSkeleton/>
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto flex max-w-[1000px] items-start gap-12 px-6 pb-20 pt-8">
        <SectionNav />

        <div className="min-w-0 flex-1">
          <div className="mb-8">
            <div className="mb-2 flex items-center gap-2">
              <div className="h-0.5 w-5 bg-amber" />
              <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-amber">
                {isEditMode ? 'Edit listing' : 'New listing'}
              </span>
            </div>
            <h1 className="m-0 mb-2 font-serif text-[clamp(28px,4vw,40px)] font-semibold tracking-tight text-ink">
              {isEditMode ? 'Edit Your Room' : 'List Your Room'}
            </h1>
            <p className="m-0 font-sans text-sm text-taupe">
              {isEditMode
                ? 'Update the details of your listing.'
                : 'Tell us about your property — the basics help guests find the right match.'}
            </p>
          </div>

          <div className="mb-5 rounded-2xl border border-cream-border bg-white p-5">
            <h3 className="m-0 mb-2 font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
              Upload requirements
            </h3>
            <ul className="m-0 list-disc pl-5 font-sans text-[13px] leading-relaxed text-taupe">
              <li>Maximum 10 images per property</li>
              <li>Each image must be under 5MB</li>
              <li>Only JPG/PNG image formats accepted</li>
            </ul>
          </div>

          <div className="w-full">
          {/* Room Details Section */}
          <FormSection id="details" title="Room Details" icon={<HouseIcon size={18} />}>
            <div className="flex flex-col gap-5">
            <div>
              <PropertyInputField
                label="Room Title"
                type="text"
                placeholder="Enter an attractive title for your room"
                id="title"
                name="title"
                value={RoomFormData.title}
                onChange={handleChange}
                inputProps={{ 'data-error': fieldErrors.title ? 'true' : undefined } as any}
              />
              {fieldErrors.title && (
                <ErrorMessage message={fieldErrors.title[0]} className="mt-1" />
              )}
            </div>

            <div>
              <PropertyInputField
                label="Description"
                type="textarea"
                placeholder="Describe your room in detail"
                id="description"
                name="description"
                value={RoomFormData.description}
                onChange={handleChange}
                inputProps={{ 'data-error': fieldErrors.description ? 'true' : undefined } as any}
              />
              {fieldErrors.description && (
                <ErrorMessage message={fieldErrors.description[0]} className="mt-1" />
              )}
            </div>

            <div>
              <ImageUploader
                images={images}
                imagePreviews={[...existingImages, ...imagePreviews]}
                onChange={handleImageChange}
                onClear={clearImages}
                fileInputRef={fileInputRef}
              />
             {fieldErrors.images && (
               <>
                 <div tabIndex={-1} data-error="true" style={{ height: 0, overflow: 'hidden' }} />
                 <ErrorMessage message={fieldErrors.images[0]} className="mt-1" />
               </>
             )}
            </div>
            </div>
          </FormSection>

          {/* Rental and Property Section */}
          <FormSection id="rental" title="Rental and Property Type" icon={<TagIcon size={18} />}>

  <h2 className="mb-3 font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">Rental Type</h2>

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
            data-error={fieldErrors.rentalType ? 'true' : undefined}
          />
          <span className="rounded-full w-4 h-4 border-2 border-amber inline-flex items-center justify-center mr-2">
            {isChecked === type.value && (
              <span className="rounded-full w-2 h-2 bg-amber"></span>
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
</FormSection>


          {/* Room Specifications Section */}
          <FormSection id="specification" title="Room Specification" icon={<BedIcon size={18} />}>
            
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
                  inputProps={{ 'data-error': fieldErrors.bedrooms ? 'true' : undefined } as any}
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
                  inputProps={{ 'data-error': fieldErrors.bathrooms ? 'true' : undefined } as any}
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
                  inputProps={{ 'data-error': fieldErrors.kitchen ? 'true' : undefined } as any}
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
                  inputProps={{ 'data-error': fieldErrors.livingRoom ? 'true' : undefined } as any}
                />
              </div>
            </div>
          </FormSection>

          {/* Amenities Section */}
          <FormSection id="amenities" title="Amenities" icon={<ZapIcon size={18} />}>
            
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
              <>
                <div tabIndex={-1} data-error="true" style={{ height: 0, overflow: 'hidden' }} />
                <ErrorMessage message={fieldErrors.amenities[0]} className="mt-2" />
              </>
            )}
          </FormSection>

          {/* Rent Pricing Section */}
          <FormSection id="pricing" title="Pricing" icon={<TagIcon size={18} />}>
            
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
                    data-error={fieldErrors.pricePerNight ? 'true' : undefined}
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
                    aria-label="Price Per Month (INR)"
                    value={RoomFormData.pricePerMonth === undefined ? "" : RoomFormData.pricePerMonth}
                    onChange={handleChange}
                    data-error={fieldErrors.pricePerMonth ? 'true' : undefined}
                  />
                  {fieldErrors.pricePerMonth && (
                    <ErrorMessage message={fieldErrors.pricePerMonth[0]} className="mt-1" />
                  )}
                </div>
              )}
            </div>
          </FormSection>

          {/* Address Section */}
          <FormSection id="location" title="Location Details" icon={<MapPinIcon size={18} />}>

  {isLoaded ? (
    <>
      <div className="mb-4">
        <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
          Search Address (Start typing to see suggestions)
        </label>

        <input
          type="text"
          placeholder="Search property address"
          className="w-full rounded-[14px] border-[1.5px] border-cream-border bg-cream px-4 py-3 font-sans text-sm text-ink placeholder-taupe-light transition-colors focus:border-amber focus:outline-none mb-4"
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
                className="px-4 py-3 hover:bg-cream cursor-pointer border-b border-cream-border-soft last:border-b-0"
                onClick={() => handlePlaceSelect(prediction)}
              >
                <div className="font-sans text-sm font-medium text-ink">
                  {prediction.description}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
            Country/region
          </label>
          <input
            type="text"
            className="w-full rounded-[14px] border-[1.5px] border-cream-border bg-cream px-4 py-3 font-sans text-sm text-ink placeholder-taupe-light transition-colors focus:border-amber focus:outline-none"
            value="India"
            readOnly
          />
        </div>

        <div>
          <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
            Flat, house no., building, etc.
          </label>
          <input
            type="text"
            className="w-full rounded-[14px] border-[1.5px] border-cream-border bg-cream px-4 py-3 font-sans text-sm text-ink placeholder-taupe-light transition-colors focus:border-amber focus:outline-none"
            value={RoomFormData.address.flatOrHouse}
            onChange={(e) => setRoomFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                flatOrHouse: e.target.value
              }
            }))}
            placeholder="e.g. Flat 301, Bldg A"
            data-error={fieldErrors.flatOrHouse ? 'true' : undefined}
          />
          {fieldErrors.flatOrHouse && (
    <ErrorMessage message={fieldErrors.flatOrHouse[0]} className="mt-1" />
  )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4">
        <div>
          <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
            Street address
          </label>
          <input
            type="text"
            className="w-full rounded-[14px] border-[1.5px] border-cream-border bg-cream px-4 py-3 font-sans text-sm text-ink placeholder-taupe-light transition-colors focus:border-amber focus:outline-none"
            value={RoomFormData.address.street}
            onChange={(e) => setRoomFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                street: e.target.value
              }
            }))}
            placeholder="e.g. MG Road"
            data-error={fieldErrors.street ? 'true' : undefined}
          />
          {fieldErrors.street && (
    <ErrorMessage message={fieldErrors.street[0]} className="mt-1" />
  )}
        </div>

        <div>
          <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
            Nearby landmark (optional)
          </label>
          <input
            type="text"
            className="w-full rounded-[14px] border-[1.5px] border-cream-border bg-cream px-4 py-3 font-sans text-sm text-ink placeholder-taupe-light transition-colors focus:border-amber focus:outline-none"
            value={RoomFormData.address.landmark}
            onChange={(e) => setRoomFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                landmark: e.target.value
              }
            }))}
            placeholder="e.g. Near City Mall"
            data-error={fieldErrors.landmark ? 'true' : undefined}
          />
          {fieldErrors.landmark && (
    <ErrorMessage message={fieldErrors.landmark[0]} className="mt-1" />
  )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
            District/locality
          </label>
          <input
            type="text"
            className="w-full rounded-[14px] border-[1.5px] border-cream-border bg-cream px-4 py-3 font-sans text-sm text-ink placeholder-taupe-light transition-colors focus:border-amber focus:outline-none"
            value={RoomFormData.address.locality}
            onChange={(e) => setRoomFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                locality: e.target.value
              }
            }))}
            placeholder="e.g. Andheri East"
            data-error={fieldErrors.locality ? 'true' : undefined}
          />
          {fieldErrors.locality && (
    <ErrorMessage message={fieldErrors.locality[0]} className="mt-1" />
  )}
        </div>

        <div>
          <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
            City/town
          </label>
          <input
            type="text"
            className="w-full rounded-[14px] border-[1.5px] border-cream-border bg-cream px-4 py-3 font-sans text-sm text-ink placeholder-taupe-light transition-colors focus:border-amber focus:outline-none"
            value={RoomFormData.address.city}
            onChange={(e) => setRoomFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                city: e.target.value
              }
            }))}
            placeholder="e.g. Mumbai"
            data-error={fieldErrors.city ? 'true' : undefined}
          />
           {fieldErrors.city && (
            <ErrorMessage message={fieldErrors.city[0]} className="mt-1" />
            )}
        </div>

        <div>
          <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
            State/UT
          </label>
          <input
            type="text"
            className="w-full rounded-[14px] border-[1.5px] border-cream-border bg-cream px-4 py-3 font-sans text-sm text-ink placeholder-taupe-light transition-colors focus:border-amber focus:outline-none"
            value={RoomFormData.address.state}
            onChange={(e) => setRoomFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                state: e.target.value
              }
            }))}
            placeholder="e.g. Maharashtra"
            data-error={fieldErrors.state ? 'true' : undefined}
          />
          {fieldErrors.state && (
    <ErrorMessage message={fieldErrors.state[0]} className="mt-1" />
  )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
            PIN code
          </label>
          <input
            type="text"
            className="w-full rounded-[14px] border-[1.5px] border-cream-border bg-cream px-4 py-3 font-sans text-sm text-ink placeholder-taupe-light transition-colors focus:border-amber focus:outline-none"
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
            data-error={fieldErrors.postalCode ? 'true' : undefined}
          />
       {fieldErrors.postalCode && (
        <ErrorMessage message={fieldErrors.postalCode[0]} className="mt-1" />
         )}
        </div>
      </div>
      <div className="mb-4">
  <label className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">Full Address</label>
  <input
    type="text"
    className="w-full rounded-[14px] border-[1.5px] border-cream-border bg-cream-border-soft px-4 py-3.5 font-sans text-sm text-taupe"
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
    <div className="h-96 rounded-2xl bg-cream-border-soft flex items-center justify-center">
      <p className="font-sans text-sm text-taupe">Loading map...</p>
    </div>
  )}
   </FormSection>


          {generalErrors.length > 0 && (
            <div className="mb-5 rounded-2xl bg-red-50 p-4">
              <h3 className="m-0 mb-1.5 font-sans text-sm font-semibold text-red-700">
                Please correct these issues:
              </h3>
              <ul className="m-0 list-disc pl-5 font-sans text-[13px] leading-relaxed text-red-600">
                {generalErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              type={isEditMode ? "button" : "submit"}
              disabled={isSubmitting}
              className={`flex w-full items-center justify-center gap-2 rounded-[14px] border-none px-8 py-3.5 font-sans text-sm font-semibold transition-all sm:w-auto ${
                isSubmitting
                  ? 'cursor-not-allowed bg-cream-border text-taupe-light'
                  : 'cursor-pointer bg-ink text-cream shadow-[0_4px_16px_rgba(28,25,23,0.15)] hover:bg-amber'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="-ml-1 mr-1 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                <>
                  {isEditMode ? 'Save Changes' : 'Create Listing'}
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
