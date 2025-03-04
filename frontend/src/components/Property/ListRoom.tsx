import { ChangeEvent, useState } from "react";
import HomeIcon from "../../assets/Home_icon.png";
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



export const ListRoom = () => {

  const [selectValues, setSelectValues]=useState({
    bedoom:'1',
    bathroom:'1',
    kitchen:"Full Kitchen",
    LivingRoom:"Separate Living Room"
  })

  const [propertyType,setPropertyType]=useState('apartment');

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
      { value: 'house', label: 'house',   imageSrc: HouseIcon },
      { value: 'studio', label: 'Studio', imageSrc: StudioIcon },
      { value: 'villa', label: 'Villa',   imageSrc:  VillaIcon},
      { value: 'cabin', label: 'Cabin',   imageSrc:  CabinIcon},
      { value: 'other', label: 'Other',   imageSrc: ApartmentIcon },
      
    ]

    const handlePropertyTypeChnage=(value: string) =>{
      setPropertyType(value);
    }
  const handleChange=(e:ChangeEvent<HTMLSelectElement>) =>{
    const {name, value}=e.target;
    setSelectValues({...selectValues , [name]:value});
  }
  const [selectedAmenities, setSelectedAmenities] =useState([]);

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
  const handleAmenitiesChange = (values:any) => {
    setSelectedAmenities(values);
  };


  const [isChecked,setIsChecked]=useState(false);
  const handleCheckBoxChange=() =>{
   setIsChecked(!isChecked);
  }
  return (
    <div className="flex justify-center items-center bg-[#E6E6E6]">
      <div className=" h-200 w-280 pt-20 p-15">
        <h2 className="text-[#111827] font-bold text-2xl">List Your Room</h2>
        <p className="text-[17px] text-[#4B5563] mt-1">
          Fill in the details to create your listing
        </p>

        <div className=" bg-white h-200 flex flex-col items-start pl-6 pt-4 mt-6 rounded-2xl">
          <div className="flex items-center">
            <img
              className="mr-1 w-6 h-6 mt-2 "
              src={HomeIcon}
              alt="Home Icon"
            />
            <h3 className="font-semibold pt-2 text-xl">Room Details</h3>
          </div>
          <div className="mt-4">
            <InputField
              label="Room Title"
              placeholder="Enter an attractive title for your room"
              type="text"
              id="title"
              className="mt-2 h-12 rounded-2xl p-3 text-long "
            />
          </div>

          <div className="mt-4">
            <InputField
              label="Description"
              placeholder="Describe your room in detail"
              type="textarea"
              id="title"
              className="mt-2 rounded-2xl p-3 text-long"
            />
          </div>

          <div className="flex flex-col mt-4">
            <label
              className="mt-2 font-semibold text-sm text-[#374151]"
              htmlFor="images"
            >
              Upload Images
            </label>

            <div className="mt-2 w-237 h-50 border-2 border-dashed border-[#dcdee4] flex flex-col items-center justify-center rounded-lg cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                id="images"
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

             <div>
              <h2 className="mt-5 font-semibold  text-[#374151]">Rental Type</h2>
             <div className="flex pl-2 items-center mt-2 h-10 w-35 border rounded-lg border-gray-300">
            <label className="relative inline-flex items-center cursor-pointer">
            <input
            type="checkbox"
            value="short-term" 
            id="short-term" 
            className="opacity-0  w-0 h-0" checked={isChecked} 
            onChange={handleCheckBoxChange}/>
            <span className={`rounded-full w-4 h-4  border-2 border-blue-500 inline-block mr-2 
              ${ isChecked ? 'bg-blue-500':""}`}></span>
            <span>Short Term</span>
            </label>
                </div>
             </div>

             <div className="pt-5">
              <PropertyTypeInput 
              label="Property Type" 
              id="propertyType"
              options={propertyOptions}
              value={propertyType}
              onChange={handlePropertyTypeChnage}
              />
             </div>

            <div className="flex mt-4 gap-4">
              <div className="w-1/2">
              <SelectInput label="Number of Bedrooms" id="bedroom" options={bedroomOptions}
               value={selectValues.bedoom} onChange={handleChange} />
              </div>

               <div className="w-1/2">
               <SelectInput label="Number of Bathrooms" id="bathroom" options={bathroomOptions}
               value={selectValues.bathroom} onChange={handleChange} />
               </div>
             
            </div>

            <div className="flex mt-4 gap-4">
              <div className="w-1/2">
              <SelectInput label="Kitchen" id="kitchen" options={kitchenOptions}
               value={selectValues.kitchen} onChange={handleChange} />
              </div>

               <div className="w-1/2">
               <SelectInput label="Living Room" id="livingRoom" options={LivingRoomOptions}
               value={selectValues.LivingRoom} onChange={handleChange} />
               </div>
             
            </div>

            <div className="mt-4 mb-4">
            <AmenitiesInput label="Amenities" id="amenities" value={selectedAmenities}
            options={amenityOptions} onChange={handleAmenitiesChange}
            />
            </div>
          </div>
            
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
  // onChange:(e:ChangeEvent<HTMLInputElement>)=> void;
  className?: string;
}

function InputField({
  label,
  type,
  placeholder,
  id,
  className,
}: InputFieldType) {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="font-semibold text-sm text-[#374151] ">
        {label}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          placeholder={placeholder}
          className={`w-237 border border-[#ccced3] placeholder-black placeholder-opacity-100 h-24  ${className}`}
        />
      ) : (
        <input
          type={type}
          //   onChange={onChange}
          id={id}
          placeholder={placeholder}
          className={`w-237 border-1 border-[#ccced3] placeholder-black placeholder-opacity-100 ${className}`}
        />
      )}
    </div>
  );
}

interface SelectInputType {
    label: string;
    id: string;
    options: { value: string; label: string }[];
    value: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  }

function SelectInput({label,id,onChange,options, value}:SelectInputType){
    return(
        <div>
            <label htmlFor={id} className="block font-semibold text-sm text-[#374151] mb-1">
                {label}
            </label>
            <select id={id} className="w-full border border-[#ccced3] rounded p-2 focus:outline-none" 
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
  label:string;
  id:string;
  value:string[];
  options:{value:string ; label:string; imageSrc:string}[];
  onChange: (values: string[]) => void;
}

function AmenitiesInput({label,id,value,options,onChange}:AmenitiesInputType){
  const handleCheckBoxChange=(optionValue:string) =>{
    if(value.includes(optionValue)){
      onChange(value.filter((item) => item !== optionValue));
    }else{
      onChange([...value,optionValue]);
    }
  }
  
  return(
    <div>
      <label htmlFor={id} className="block font-semibold  text-[#374151] mb-2 pb-5">
     {label}
    </label>

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