import React from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';
interface Property{
    id:string;
    rentalType:string;
    title:string;
    pricePerNight?:number;
    pricePerMonth?:number;
    address:string;
    property:string;
    images?: { url: string }[];
}
interface PropertyDisplayProps{
  properties: Property[];
  onSave: (propertyId: string) => Promise<void>;
  savedPropertyIds: string[];
  savingError: Record<string, string | null>;

  loadingSavedProperties: boolean;
}

export const PropertyDisplay: React.FC<PropertyDisplayProps> = ({ properties,onSave,savedPropertyIds,savingError,loadingSavedProperties}) => {
    return(
        <div>
            <div className="grid grid-cols-2 gap-4 px-8
           md:grid md:gap-4 md:px-8 md:grid-cols-2 md:mt-7 
          lg:mt-0  lg:grid-cols-4  xl:grid-cols-4
           ">
        {properties.map((property) => (
          <PropertyCard key={property.id} 
          property={property}
          onSave={onSave}
          isSaved={savedPropertyIds.includes(property.id)}
          saveError={savingError[property.id]}

          loadingSavedProperties={loadingSavedProperties}
          />
        ))}
      </div>
        </div>
    )
}

interface PropertyCardProps {
  property: Property;
  onSave:(propertyId:string) => Promise<void>;
  isSaved:boolean;
  saveError: string | null;

  loadingSavedProperties: boolean;
}


const PropertyCard = ({ property,onSave,isSaved,saveError,loadingSavedProperties}: PropertyCardProps) => {

  const handleSaveClick= async () =>{
    await onSave(property.id);
  }
  const formatRentalType = (type: string): string => {
    if (type === 'short-term') {
      return 'Short-Term Stay';
    } else if (type === 'long-term') {
      return 'Long-Term Rental';
    } else if (type === 'both') {
      return 'Short & Long-Term';
    }
    return type;
  };
  const displayedRentalType = formatRentalType(property.rentalType);
  const navigate = useNavigate();

  const handleViewDetailsClick = () => {
    navigate(`/property/room-detail/${property.id}`);
  };
    return (
      
      <div className="relative rounded-lg p-4 shadow-md text-left w-full transition-all duration-300 ease-out overflow-hidden
      focus:outline-none">
       
        <div className="pt-1 pb-3  overflow-hidden rounded-md">
          {property.images && property.images.length > 0 && property.images[0].url ? (
            <img
              src={property.images[0].url}
              alt={property.title}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
          ) : (
            <div className="w-full h-45 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
              {/* Placeholder for no image */}
              No Image
            </div>
          )}
        </div>
        <div>
          <button  className="mt-4 mr-4 cursor-pointer absolute top-2 right-2 bg-white rounded-full p-1 shadow-md focus:outline-none"
           onClick={handleSaveClick}
           disabled={loadingSavedProperties || !!saveError}
           >
           {isSaved ? (
              <HeartSolidIcon className ="h-4 w-4 text-red-500"/>
            ):(
              <HeartIcon className='h-4 w-4 text-gray-400'/>
            )}
          </button>
          {saveError && <p className="text-red-500 text-xs mt-1">{saveError}</p>}
         </div>
        <div className="pb-3">

        {/* <p className="text-[#2563EB] text-sm">{property.propertyType}</p> */}
          <h3 className="font-medium text-sm pb-4 md:pb-0 md:font-semibold md:text-base">{property.title}</h3>
         
          <p className="text-[#2563EB] text-sm mb-1">{displayedRentalType}</p>
          <p className="text-[#4B5563] pt-1">   {property.address}</p>
         
          <div className="pt-1 pb-4 md:pb-4">
    {property.rentalType ==='short-term' && property.pricePerNight !== null && (
        <div className="flex items-center">
            <p className="font-bold text-sm md:font-bold md:text-xl text-black">₹{property.pricePerNight}</p>
            <p className="text-[#4B5563] font-normal md:font-semibold">/night</p>
        </div>
    )}

    {property.rentalType === 'long-term' && property.pricePerMonth !== null && (
        <div className="flex items-end">
            <p className="font-bold text-sm md:font-bold md:text-xl text-black">₹{property.pricePerMonth}</p>
            <p className="text-[#4B5563] font-normal md:font-semibold">/month</p>
        </div>
      )}

      {property.rentalType=== 'both'  && property.pricePerMonth !== null &&  property.pricePerNight !== null &&(
       <div className="grid md:flex justify-between items-center">

         <div className="flex items-end">
         <p className="font-bold text-sm md:font-bold md:text-xl text-black"> ₹{property.pricePerNight}</p>
           <p  className="text-[#4B5563] font-normal md:font-semibold">/night</p>
         </div>

         <div className="flex items-end">
         <p className="font-bold text-sm md:font-bold md:text-xl text-black"> ₹{property.pricePerMonth}</p>
         <p  className="text-[#4B5563] font-normal md:font-semibold">/month</p>
         </div>

        </div>
      )}
    </div>
    <div className="grid grid-cols-2 gap-4 pt-0 text-[#4B5563]  font-medium pb-0">
    
        <button className={`text-white w-32 justify-center items-center border-1 border-gray-200 bg-[#2564ebe0] transition-all duration-300 mr-4 h-10   rounded-xl cursor-pointer`}>
        <div className="flex justify-center items-center">
        Conatct Host
        </div>
        </button>

        <button className={`w-32 justify-center items-center border-1 border-gray-200 bg-white  transition-all duration-300 mr-4 h-10 rounded-xl cursor-pointer focus:bg-[#2564ebcc] focus:text-white`}
          onClick={handleViewDetailsClick}
         >
        <div className="flex justify-center items-center"
        >
        View Details
        </div>
        </button>
        
    </div>

        </div>
      </div>
    );
  };
  
  export default PropertyCard;
  