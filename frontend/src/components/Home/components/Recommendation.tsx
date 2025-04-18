import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../../config";


interface Property{
    id:string;
    propertyType:string;
    rentalType:string;
    title:string;
    pricePerNight?:number;
    pricePerMonth?:number;
    property:string;
    images?: { url: string }[];
}
export const Recommendation= () =>{

    const [recommendedProperties, setRecommendedProperties] = useState<Property[]>([]); // Use Property[] here
    const [error,setError]=useState(null);

    useEffect(() =>{
       const fetchProperties=async () =>{
        try {
            const response=await axios.get(`${BACKEND_URL}/property/all`);
            const allProperties = response.data;
            const randomProperties = [];
            const available = [...allProperties];
            
            // Select 4 unique random properties
            for (let i = 0; i < 4 && available.length > 0; i++) {
              const randomIndex = Math.floor(Math.random() * available.length);
              randomProperties.push(available[randomIndex]);
              available.splice(randomIndex, 1);
            }
           
            setRecommendedProperties(randomProperties);
        } catch (error:any) {
            setError(error.message);
        }
       }
       fetchProperties();
    },[])
    return(
        <div>

           <div className=" mt-68 font-medium text-xl flex justify-center items-center
            md:mt-8 md:font-bold md:text-3xl 
            lg:mt-8 lg:font-bold lg:text-3xl 
            xl:mt-8 xl:font-bold xl:text-3xl 
            
            ">
            <h2>Your Perfect Stay Awaits</h2>
            </div> 
            <div className="grid grid-cols-2 gap-4 px-8
           md:grid md:gap-4 md:px-8 md:grid-cols-2 md:mt-7 
          lg:mt-0  lg:grid-cols-4  xl:grid-cols-4
           ">
        {recommendedProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
        </div>
    )
}

interface PropertyCardProps{
    property:Property
}

const PropertyCard = ({ property }: PropertyCardProps) => {
    return (
      
      <button className="relative rounded-lg p-4 shadow-md text-left w-full transition-all duration-300 ease-out overflow-hidden
      hover:shadow-lg hover:scale-[1.015] active:scale-100 focus:outline-none">
       
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
        <div className="pb-3">

        <p className="text-[#2563EB] text-sm">{property.propertyType}</p>
          <h3 className="font-medium text-sm pb-4 md:pb-0 md:font-semibold md:text-base">{property.title}</h3>
          <div className="pb-4 md:pb-4">
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
        </div>
      </button>
    );
  };
  
  export default PropertyCard;
  