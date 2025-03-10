import React, { ChangeEvent, useRef, useState } from "react";
import HomeIcon from "../../assets/Home_icon.png";
import axios from "axios";
import ImageIcon from "../../assets/ImageIconListRoom.png";

import ApartmentIcon from "../../assets/ApartmentIcon.png"
import HouseIcon from "../../assets/HouseIcon.png"
import StudioIcon from "../../assets/StudioIcon.png"
import VillaIcon from "../../assets/VillaIcon.png"
import CabinIcon from "../../assets/CabinIcon.png"

import WifiIcon from "../../assets/WifiIcon.png"
import ACIcon from "../../assets/ACIcon.png"
import LaundryIcon from "../../assets/LaundryIcon.png"
import ParkingICon from "../../assets/ParkingIcon.png"
import PoolIcon from "../../assets/PoolIcon.png"
import SecurityIcon from "../../assets/SecurityIcon.png"
import ElevatorIcon from "../../assets/ElevatorIcon.png"
import DiningIcon from "../../assets/DiningIcon.png"
import TVIcon from "../../assets/TVIcon.png"
import PetFriendly from "../../assets/PetFriendlyIcon.png"
import WaterIcon from "../../assets/WaterIcon.png"
import GymIcon from "../../assets/GymIcon.png"

import LocationIcon from "../../assets/LocationIcon.png"
import RoomIcon from "../../assets/RoomSpecificationIcon.png"
import AmenitiesIcon from "../../assets/AmenitiesIcon.png"
import { BACKEND_URL } from "../../config";

interface ChildrenProps {
  children: React.ReactNode;
}

const RoomDetailsSection=({children}:ChildrenProps) =>(
  <div className="mb-6 bg-white p-6 rounded-2xl shadow-md w-full">
    {children}
  </div>
)

const RentalAndPropertySection=({children}:ChildrenProps)=>(
  <div className="mb-6 bg-white p-6 rounded-2xl shadow-md w-full">{children}</div>
)

const RoomSpecificationsSection = ({ children }: ChildrenProps) => (
  <div className="mb-6 bg-white p-6 rounded-2xl shadow-md w-full">{children}</div>
);

const AmenitiesSection = ({ children }: ChildrenProps) => (
  <div className="mb-6 bg-white p-6 rounded-2xl shadow-md w-full">{children}</div>
);

const RentPricingSection = ({ children }: ChildrenProps) => (
  <div className="mb-6 bg-white p-6 rounded-2xl shadow-md w-full">{children}</div>
);

const AddressSection = ({ children }: ChildrenProps) => (
  <div className="mb-6 bg-white p-6 rounded-2xl shadow-md w-full">{children}</div>
);

interface FormData {
  title: string;
  description: string;
  bedrooms: string;
  bathrooms: string;
  kitchen: string;
  livingRoom: string;
  propertyType: string;
  rentalType: string;
  pricePerNight: string;
  pricePerMonth: string;
  address: string;
  amenities: string[];
}
export const ListRoom = () => {

   const [formData,setFormData] =useState<FormData>({
    title:"",
    description:"",
    bedrooms:"1" ,
    bathrooms:"1",
    kitchen:"Full Kitchen" ,
    livingRoom: "Separate Living Room",
    propertyType: "apartment",
    rentalType: "short-term",
    pricePerNight: "",
    pricePerMonth: "",
    address: "",
    amenities: [],
   })

const [images,setImages]=useState<FileList| null>(null);   
const fileInputRef=useRef<HTMLInputElement>(null);

const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
  const { name, value, type } = e.target;
  console.log("handleChange: Name:", name, "Value:", value, "Type:", type); 
 
  if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prevData: FormData) => ({
          ...prevData,
          amenities: target.checked
              ? [...prevData.amenities, value]
              : prevData.amenities.filter((item) => item !== value),
      }));
  } else {
    setFormData((prevData: FormData) => {
      console.log("handleChange: Previous Data:", prevData);
      const newData = { ...prevData, [name]: value };
      console.log("handleChange: New Data:", newData); 
      return newData;
    });
  }
};
const handleImageChange=(e:ChangeEvent<HTMLInputElement>)=>{
if(e.target.files){
  setImages(e.target.files);
}
};

const handlePropertyTypeChnage=(value: string) =>{
  setFormData({...formData, propertyType:value});
}

const handleSubmit=async () =>{
  const formDataToSend=new FormData();
  Object.entries(formData).forEach(([key, value]) =>{
    if(Array.isArray(value)){
      value.forEach((item) => formDataToSend.append(key,item));
    }else{
      formDataToSend.append(key,value);
    }
  });
  console.log("Images:", images);
  if(images){
    Array.from(images).forEach((file)=>{
      formDataToSend.append("images", file)
    })
  }
  const token=localStorage.getItem("token");
  console.log("Token", token , "Type:" , typeof token);
  if (typeof token !== "string") {
    console.error("Token is not a string!");
    return; 
  }
  try{
   
    const response=await axios.post(`${BACKEND_URL}/property/create`, formDataToSend, {
  headers:{
    "Content-Type":"multipart/form-data",
    Authorization:`Bearer ${token}`,
  },
    })
    console.log("Propery created", response.data);
  }catch(error){
    console.error("Error creating property:", error);
  }
}
  const bathroomOptions=[
    {value:"1", label:"1"},
    {value:"1.5", label:"1.5"},
    {value:"2", label:"2"},
    {value:"2.5", label:"2.5"},
    {value:"3", label:"3"},
    {value:"3.5", label:"3.5"},
    {value:"4", label:"4"},
    {value:"4+", label:"4+"},
  ];

  const bedroomOptions=[
    {value:"1" , label:"1"},
    {value:"2" , label:"2"},
    {value:"3" , label:"3"},
    {value:"4" , label:"4"},
    {value:"4+" , label:"4+"},
  ]

  const kitchenOptions=[
    {value:"Full Kitchen" , label:"Full Kitchen"},
    {value:"Kitchenette" , label:"Kitchenette"},
    {value:"Shared Kitchen" , label:"Shared Kitchen"},
    {value:"No Kitchen" , label:"No Kitchen"},
  ]

  const LivingRoomOptions=[
    {value:"Separate Living Room" , label:"Separate Living Room"},
    {value:"Combined Living/Dining" , label:"Combined Living/Dining"},
    {value:"No Living Room" , label:"No Living Room "},
    {value:"Open Concept" , label:"Open Concept"},
  ]

    const propertyOptions=[
      { value: 'apartment', label: 'Apartment', imageSrc: ApartmentIcon },
      { value: 'house', label: 'House',   imageSrc: HouseIcon },
      { value: 'studio', label: 'Studio', imageSrc: StudioIcon },
      { value: 'villa', label: 'Villa',   imageSrc:  VillaIcon},
      { value: 'cabin', label: 'Cabin',   imageSrc:  CabinIcon},
      { value: 'other', label: 'Other',   imageSrc: ApartmentIcon },
      
    ]

    const amenityOptions=[
    {value:'wifi', label:"WiFi", imageSrc:WifiIcon},
    {value:"airConditioning", label:"Air Conditioning", imageSrc:ACIcon},
    {value:"laundry", label:"Laundry", imageSrc:LaundryIcon},
    {value:"parking", label:"Parking", imageSrc:ParkingICon},
    {value:"pool", label:"Pool", imageSrc:PoolIcon},
    {value:"security", label:"Security", imageSrc:SecurityIcon}, 
    {value:"elevator", label:"Elevator", imageSrc:ElevatorIcon},
    {value:"dining", label:"Dining", imageSrc:DiningIcon},
    {value:"tv", label:"TV", imageSrc:TVIcon},
    {value:"petFriendly", label:"Pet Friendly", imageSrc:PetFriendly},
    {value:"water", label:"Water", imageSrc:WaterIcon},
    {value:"gym", label:"Gym", imageSrc:GymIcon},
  ]
  

  const [isChecked,setIsChecked]=useState<string | null>(null);
  const handleCheckBoxChange =(type:string) =>{
    setIsChecked(type);
    setFormData({...formData,rentalType:type});
  }
  const rentalTypes=[
    {value:'short-term', label:'Short Term'},
    {value:'long-term', label:'Long Term'},
    {value:'both', label:'Both'},
  ]
  
  return (
    <div className="flex justify-center items-center bg-[#E6E6E6]">
      <div className=" h-full pt-20 p-15 ">
       <div className="">
       <h2 className="text-[#111827] font-bold text-2xl">List Your Room</h2>
        <p className="text-[17px] text-[#4B5563] mt-1">
          Fill in the details to create your listing
        </p>
       </div>

        <div className="  h-full flex flex-col items-start w-full  pt-4 mt-6 rounded-2xl">
        <RoomDetailsSection>
          <div className="flex items-center">
            <img
              className="mr-1 w-6 h-6"
              src={HomeIcon}
              alt="Home Icon"
            />
            <h3 className="font-semibold text-xl">Room Details</h3>
          </div>
          <div className="mt-4">
            <InputField
              label="Room Title"
              placeholder="Enter an attractive title for your room"
              type="text"
              id="title"
              className="mt-2 h-12 rounded-2xl p-3 text-long "
              onChange={handleChange}
            />
          </div>

          <div className="mt-4">
            <InputField
              label="Description"
              placeholder="Describe your room in detail"
              type="textarea"
              id="title"
              className="mt-2 rounded-2xl p-3 text-long"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col mt-4">
            <label
              className="mt-2 font-semibold text-sm text-[#374151]"
              htmlFor="images"
            >
              Upload Images
            </label>

            <div className="mt-2  h-50 border-2 border-dashed border-[#dcdee4] flex flex-col items-center justify-center rounded-lg cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                id="images"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
              />
              <div className="pb-4">
                <img className=" w-8 h-8 " src={ImageIcon} alt="Image" />
              </div>
              <p className=" text-gray-500 text-sm text-center">
                Drag & Drop your images here <br /> or
              </p>
              <button
                type="button"
                className="mt-2 px-4 py-2 text-white bg-[#2563EB] rounded-lg text-sm font-medium"
              >
                Browse Files
              </button>
            </div>
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
            <h3 className="font-semibold text-xl">Rental and Property Type</h3>
          </div>
              <h2 className="mt-5 font-semibold  text-[#374151]">Rental Type</h2>
              <div className="flex gap-6 cursor-pointer">
              {rentalTypes.map((type) =>(
             <div key={type.value} className="pl-4 mt-2 h-10 w-75 border rounded-lg border-gray-300">
            <label className="relative inline-flex items-center cursor-pointer  w-full h-full"
              onClick={() => handleCheckBoxChange(type.value)}>
            <input
            type="radio"
            value={type.value} 
            id={type.value}
            className="opacity-0  w-0 h-0"
             checked={isChecked===type.value} 
             name="rentalType"
             onChange={handleChange}
           />
            <span className="rounded-full w-4 h-4 border-2 border-blue-500 inline-flex items-center justify-center mr-2">
              {isChecked===type.value && (
                <span className="rounded-full w-2 h-2 bg-blue-500"></span>
              )}
            </span>
            <span className="font-normal">{type.label}</span>
            </label>
                </div>
                ))}
             </div>
             </div>
             <div className="pt-5">
              <PropertyTypeInput 
              label="Property Type" 
              id="propertyType"
              options={propertyOptions}
              value={formData.propertyType}
              onChange={handlePropertyTypeChnage}
              />
             </div>
             </RentalAndPropertySection>

             <RoomSpecificationsSection> 
            <div className="w-full">
            <div className="flex items-center mb-4 w-full">
            <img
              className="mr-1 w-6 h-6"
              src={RoomIcon}
              alt="Home Icon"
            />
            <h3 className="font-semibold text-xl">Room Specification</h3>
          </div>
            <div className="flex mt-4 gap-4 w-full">
              <div className="w-1/2">
              <SelectInput label="Number of Bedrooms" id="bedroom" name="bedrooms" options={bedroomOptions}
               value={formData.bedrooms} onChange={handleChange} />
              </div>

               <div className="w-1/2">
               <SelectInput label="Number of Bathrooms" id="bathroom" name="bathrooms" options={bathroomOptions}
               value={formData.bathrooms} onChange={handleChange} />
               </div>
             
            </div>

            <div className="flex mt-4 gap-4 w-full">
              <div className="w-1/2">
              <SelectInput label="Kitchen" name="kitchen" id="kitchen" options={kitchenOptions}
               value={formData.kitchen} onChange={handleChange} />
              </div>

               <div className="w-1/2">
               <SelectInput label="Living Room" name="livingRoom" id="livingRoom" options={LivingRoomOptions}
               value={formData.livingRoom} onChange={handleChange} />
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
            <AmenitiesInput id="amenities" value={formData.amenities}
            options={amenityOptions} 
            onChange={(values) =>{
              setFormData((prevData:FormData) =>({
                ...prevData ,
                amenities:values,
              }))
            }}
            />
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
              {(formData.rentalType==="short-term" || formData.rentalType==="both") && (
              <div className="mt-2 flex flex-col">
              <label className="mb-1" htmlFor="pricePerNight">Price Per Night (₹)</label>
              <input 
              className="pl-4 border border-gray-300 h-10 w-110 rounded-md focus:outline-none"
              type="number" placeholder="200"
              min="200"
              id="pricePerNight"
              name="pricePerNight"
              aria-label="Price Per Night (INR)" 
              value={formData.pricePerNight}
              onChange={handleChange}
              />
              </div>
              )}  
              {(formData.rentalType==="long-term" || formData.rentalType==="both") && (
              <div className="mt-2 flex flex-col">
              <label className="mb-1" htmlFor="pricePerMonth">Price Per Month (₹)</label>
              <input 
              className="pl-4 border border-gray-300 h-10 w-110 rounded-md focus:outline-none"
              type="number" placeholder="5000"
              min="2000"
              id="pricePerMonth"
              name="pricePerMonth"
              aria-label="Price Per Month (INR)" 
              value={formData.pricePerMonth}
              onChange={handleChange}
              />
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
                <input type="text" 
                placeholder="Enter address"
                className="pl-4 border border-gray-300 h-10 rounded-md focus:outline-none w-full"
                value={formData.address}
                onChange={handleChange}
                name="address"
                />
               </div>
            </div>

          </AddressSection>
           <button 
            onClick={handleSubmit}
            className="mt-4 px-4 py-2 text-white bg-[#2563EB] rounded-lg text-sm font-medium">
           Submit
           </button>
        </div>
      </div>
    </div>
  );
};

interface InputFieldType {
  label: string;
  type: string;
  placeholder: string;
  id: string;
  onChange:(e:ChangeEvent<HTMLInputElement| HTMLTextAreaElement>)=> void;
  className?: string;
}

function InputField({
  label,
  type,
  placeholder,
  id,
  className,
  onChange
}: InputFieldType) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="font-semibold text-sm text-[#374151] ">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          onChange={onChange}
          placeholder={placeholder}
          className={` border border-[#ccced3] placeholder-black placeholder-opacity-100 h-24  ${className}`}
        />
      ) : (
        <input
          type={type}
          onChange={onChange}
          id={id}
          placeholder={placeholder}
          className={` border-1 border-[#ccced3] placeholder-black placeholder-opacity-100 ${className}`}
        />
      )}
    </div>
  );
}

interface SelectInputType {
    label: string;
    id: string;
    name:string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  }

function SelectInput({label,id,name,onChange,options, value}:SelectInputType){
    return(
        <div>
            <label htmlFor={id} className="block font-semibold text-sm text-[#374151] mb-1">
                {label}
            </label>
            <select 
            id={id}
            name={name} 
            className="w-full border border-[#ccced3] rounded p-2 focus:outline-none" 
            value={value} onChange={onChange}>
                {options.map((options) =>(
                    <option value={options.value} key={options.value}>
                        {options.label}
                    </option>
                ))}
            </select>
        </div>
    )
}


interface PropertyTypeInputProps{
  label:string;
  id:string;
  options:{value:string ; label:string; imageSrc:string}[];
  value:string;
  onChange: (value: string) => void;
}

function PropertyTypeInput({label,id,options,value,onChange}:PropertyTypeInputProps){{
  return(
    <div>
      <label htmlFor={id} className="block font-semibold text-sm text-[#374151] mb-1 pb-4">
        {label}
      </label>

      <div className="grid grid-cols-3 gap-4">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => onChange(option.value)} 
            className={`cursor-pointer pl-5 pt-4 border rounded-lg h-28 transition-colors duration-200  ${ 
              value === option.value ? 'bg-gray-200 border-none shadow-sm' : 'border-gray-300'
            }`}
          >
            <div className=" items-center">
              {option.imageSrc && (
                <img
                  src={option.imageSrc}
                  alt={option.label}
                  className="mr-2 w-6 h-6 mb-1"  
                />
              )}  

              <span className="">{option.label}</span>
              </div>
              </div>
       ))}
     </div>
    </div>
  )
}}


interface AmenitiesInputType{
  id:string;
  value:string[];
  options:{value:string ; label:string; imageSrc:string}[];
  onChange: (values: string[]) => void;
}

function AmenitiesInput({id,value,options,onChange}:AmenitiesInputType){
  const handleCheckBoxChange=(optionValue:string) =>{
    if(value.includes(optionValue)){
      onChange(value.filter((item) => item !== optionValue));
    }else{
      onChange([...value,optionValue]);
    }
  }
  
  return(
    <div>
    <div className="grid grid-cols-4 gap-4 p-2">
    {options.map((option) =>(
      <label key={option.value}
      className="cursor-pointer pl-3 border rounded-lg  flex items-center h-12 text-sm font-semibold border-gray-300"
      >
      <input type="checkbox" value={option.value} checked={value.includes(option.value)}
      onChange={() => handleCheckBoxChange(option.value)}
      className="mr-3 opacity-0 absolute"
      />
      <span className="mr-3 w-5 h-5 border border-gray-300 rounded-sm  flex items-center justify-center" >
      {value.includes(option.value) && <span className="w-3 h-3 bg-blue-500 rounded-sm" />}
      </span>
      {option.imageSrc && (
        <img src={option.imageSrc} alt={option.label}
        className="mr-3 w-5 h-5" />
      )}
        <span>{option.label}</span>
      </label>
    ))}                   
    </div>
    </div>

  )
}