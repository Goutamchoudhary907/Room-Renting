import { ChangeEvent, useRef, useState } from "react";
import HomeIcon from "../../../assets/Home_icon.png";
import axios from "axios";
import { propertySchema } from "../../../../../schema/dist/propertySchema.js";
import LocationIcon from "../../../assets/LocationIcon.png";
import RoomIcon from "../../../assets/RoomSpecificationIcon.png";
import AmenitiesIcon from "../../../assets/AmenitiesIcon.png";
import { BACKEND_URL } from "../../../config.js";
import { useNavigate } from "react-router-dom";
import { ChildrenProps, RoomFormData } from "./types.js";
import {
  amenityOptions,
  bathroomOptions,
  bedroomOptions,
  kitchenOptions,
  LivingRoomOptions,
  propertyOptions,
} from "./constants.js";
import { PropertyInputField } from "./FormInputs/PropertyInputField.js";
import { ImageUploader } from "./FormInputs/ImageUploader.js";
import { AmenitiesInput } from "./FormInputs/AmenitiesSelector.js";
import { SelectInput } from "./FormInputs/SelectInput.js";
import { RentalTypeInput } from "./FormInputs/RentalType.js";
import { ErrorMessage } from "./FormInputs/ErrorMessage.js";

interface ListRoomProps{
  isEditMode?:boolean;
  initialFormData?:RoomFormData;
  existingImages?:string[];
  onSubmit?:(formData:RoomFormData, images:File[]) => Promise<void>;
  error?: string | null;
  validationErrors?: Record<string, string>;
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

export const ListRoom: React.FC<ListRoomProps> = ({
  isEditMode = false,
  initialFormData: propInitialFormData = null,
  existingImages = [],
  onSubmit,
}) => {
  const initialRoomFormData: RoomFormData = propInitialFormData || {
    title: "",
    description: "",
    bedrooms: 1 as number,
    bathrooms: 1 as number,
    kitchen: "Full Kitchen" as string,
    livingRoom: "Separate Living Room" as string,
    propertyType: "apartment",
    rentalType: "long-term",
    pricePerNight: undefined,
    pricePerMonth: undefined,
    address: "",
    amenities: [],
  };

  const [RoomFormData, setRoomFormData] = useState<RoomFormData>(initialRoomFormData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [generalErrors, setGeneralErrors] = useState<string[]>([]);
  const [isChecked, setIsChecked] = useState<string>("long-term");
  const navigate = useNavigate();

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
    const formDataToSend = new FormData();

    // Append all properties including numbers and arrays
    Object.entries(RoomFormData).forEach(([key, value]) => {
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
    }
    }else{
     const formData = new FormData();
    Object.entries(RoomFormData).forEach(([key, value]) => {
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

  return (
    <div className="flex justify-center items-center bg-[#E6E6E6]">
      <div className=" h-full pt-20 p-15 ">
        <div className="">
          <h2 className="text-[#111827] font-bold text-2xl">

             {isEditMode ? 'Edit Your Room' :"List Your Room"}</h2>
          <p className="text-[17px] text-[#4B5563] mt-1">
            {isEditMode ? 'Update the details of your listing' : 
           ' Fill in the details to create your listing'
          }
          </p>
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">
            Upload Requirements:
          </h3>
          <ul className="list-disc pl-5 text-blue-700 text-sm">
            <li>Maximum 10 images per property</li>
            <li>Each image must be under 5MB</li>
            <li>Only JPG/PNG image formats accepted</li>
          </ul>
        </div>
        <div className="  h-full flex flex-col items-start w-full  pt-4 mt-6 rounded-2xl">
          <RoomDetailsSection>
            <div className="flex items-center">
              <img className="mr-1 w-6 h-6" src={HomeIcon} alt="Home Icon" />
              <h3 className="font-semibold text-xl">Room Details</h3>
            </div>
            <div className="mt-4">
              <PropertyInputField
                label="Room Title"
                type="text"
                placeholder="Enter an attractive title for your room"
                id="title"
                name="title"
                value={RoomFormData.title}
                className="mt-2"
                onChange={handleChange}
              />
              {fieldErrors.title && (
                <ErrorMessage message={fieldErrors.title[0]} className="mt-1" />
              )}
            </div>

            {/* Description Field */}
            <div className="mt-4">
              <PropertyInputField
                label="Description"
                type="textarea"
                placeholder="Describe your room in detail"
                id="description"
                name="description"
                value={RoomFormData.description}
                className="mt-2"
                onChange={handleChange}
              />
              {fieldErrors.description && (
                <ErrorMessage
                  message={fieldErrors.description[0]}
                  className="mt-1"
                />
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
                <ErrorMessage
                  message={fieldErrors.images[0]}
                  className="mt-1"
                />
              )}
            </div>
          </RoomDetailsSection>

          <RentalAndPropertySection>
            <div>
              <div className="flex items-center mb-4 w-full">
                <img
                  className="mr-1 w-6 h-6"
                  src={LocationIcon}
                  alt="Home Icon"
                />
                <h3 className="font-semibold text-xl">
                  Rental and Property Type
                </h3>
              </div>
              <h2 className="mt-5 font-semibold  text-[#374151]">
                Rental Type
              </h2>
              <div className="flex gap-6 cursor-pointer">
                {rentalTypes.map((type) => (
                  <div
                    key={type.value}
                    className="pl-4 mt-2 h-10 w-75 border rounded-lg border-gray-300"
                  >
                    <label
                      className="relative inline-flex items-center cursor-pointer  w-full h-full"
                      onClick={() => handleCheckBoxChange(type.value)}
                    >
                      <input
                        type="radio"
                        value={type.value}
                        id={type.value}
                        className="opacity-0  w-0 h-0"
                        checked={isChecked === type.value}
                        name="rentalType"
                        onChange={handleChange}
                      />
                      <span className="rounded-full w-4 h-4 border-2 border-blue-500 inline-flex items-center justify-center mr-2">
                        {isChecked === type.value && (
                          <span className="rounded-full w-2 h-2 bg-blue-500"></span>
                        )}
                      </span>
                      <span className="font-normal">{type.label}</span>
                    </label>
                  </div>
                ))}
              </div>
              {fieldErrors.rentalType && (
                <ErrorMessage
                  message={fieldErrors.rentalType[0]}
                  className="mt-2"
                />
              )}
            </div>
            <div className="pt-5">
              <RentalTypeInput
                label="Property Type"
                id="propertyType"
                options={propertyOptions}
                value={RoomFormData.propertyType}
                onChange={handlePropertyTypeChnage}
              />
              {fieldErrors.propertyType && (
                <ErrorMessage
                  message={fieldErrors.propertyType[0]}
                  className="mt-2"
                />
              )}
            </div>
          </RentalAndPropertySection>

          <RoomSpecificationsSection>
            <div className="w-full">
              <div className="flex items-center mb-4 w-full">
                <img className="mr-1 w-6 h-6" src={RoomIcon} alt="Home Icon" />
                <h3 className="font-semibold text-xl">Room Specification</h3>
              </div>
              <div className="flex mt-4 gap-4 w-full">
                <div className="w-1/2">
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

                <div className="w-1/2">
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

              <div className="flex mt-4 gap-4 w-full">
                <div className="w-1/2">
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

                <div className="w-1/2">
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
            </div>
          </RoomSpecificationsSection>

          <AmenitiesSection>
            <div className="mt-4 mb-4 w-full ">
              <div className="flex items-center mb-4 w-full">
                <img
                  className="mr-1 w-6 h-6"
                  src={AmenitiesIcon}
                  alt="Home Icon"
                />
                <h3 className="font-semibold text-xl">Amenities</h3>
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
                <ErrorMessage
                  message={fieldErrors.amenities[0]}
                  className="mt-2"
                />
              )}
            </div>
          </AmenitiesSection>

          <RentPricingSection>
            <div className="mt-2 font-semibold  text-[#374151]">
              <div className="flex items-center mb-4 w-full">
                <img
                  className="mr-1 w-6 h-6"
                  src={AmenitiesIcon}
                  alt="Home Icon"
                />
                <h3 className="font-semibold text-xl">Pricing</h3>
              </div>
              <div className="flex gap-15">
                {(RoomFormData.rentalType === "short-term" ||
                  RoomFormData.rentalType === "both") && (
                  <div className="mt-2 flex flex-col">
                    <label className="mb-1" htmlFor="pricePerNight">
                      Price Per Night (₹)
                    </label>
                    <input
                      className="pl-4 border border-gray-300 h-10 w-110 rounded-md focus:outline-none"
                      type="number"
                      placeholder="200"
                      min="200"
                      id="pricePerNight"
                      name="pricePerNight"
                      aria-label="Price Per Night (INR)"
                      value={
                        RoomFormData.pricePerNight === undefined
                          ? ""
                          : RoomFormData.pricePerNight
                      }
                      onChange={handleChange}
                    />
                    {fieldErrors.pricePerNight && (
                      <ErrorMessage
                        message={fieldErrors.pricePerNight[0]}
                        className="mt-1"
                      />
                    )}
                  </div>
                )}{" "}
                {(RoomFormData.rentalType === "long-term" ||
                  RoomFormData.rentalType === "both") && (
                  <div className="mt-2 flex flex-col">
                    <label className="mb-1" htmlFor="pricePerMonth">
                      Price Per Month (₹)
                    </label>
                    <input
                      className="pl-4 border border-gray-300 h-10 w-110 rounded-md focus:outline-none"
                      type="number"
                      placeholder="5000"
                      min="2000"
                      id="pricePerMonth"
                      name="pricePerMonth"
                      step="1" 
                      onBlur={(e) => {
                        // Force rounding on blur
                        const value = e.target.value;
                        if (value) {
                          e.target.value = Math.round(parseFloat(value)).toString();
                        }
                      }}
                      aria-label="Price Per Month (INR)"
                      value={
                        RoomFormData.pricePerMonth === undefined
                          ? ""
                          : RoomFormData.pricePerMonth
                      }
                      onChange={handleChange}
                    />
                    {fieldErrors.pricePerMonth && (
                      <ErrorMessage
                        message={fieldErrors.pricePerMonth[0]}
                        className="mt-1"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </RentPricingSection>

          <AddressSection>
            <div className=" font-semibold  text-[#374151]">
              <div className="flex items-center mb-4 w-full">
                <img
                  className="mr-1 w-6 h-6"
                  src={LocationIcon}
                  alt="Home Icon"
                />
                <h3 className="font-semibold text-xl">Location</h3>
              </div>
              <h2>Address</h2>
              <div>
                <input
                  type="text"
                  placeholder="Enter address"
                  className="pl-4 border border-gray-300 h-10 rounded-md focus:outline-none w-full"
                  value={RoomFormData.address}
                  onChange={handleChange}
                  name="address"
                />
                {fieldErrors.address && (
                  <ErrorMessage
                    message={fieldErrors.address[0]}
                    className="mt-1"
                  />
                )}
              </div>
            </div>
          </AddressSection>

          {generalErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500">
              <h3 className="font-semibold text-red-800 mb-2">
                Please correct these issues:
              </h3>
              <ul className="list-disc pl-5 text-red-700">
                {generalErrors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleSubmit}
          type={isEditMode ? "button" : "submit"} 
            className="mt-4 px-4 py-2 text-white bg-[#2563EB] rounded-lg text-sm font-medium cursor-pointer"
          >
            {isEditMode ? 'Save Changes': 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};
