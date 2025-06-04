import { useNavigate } from "react-router-dom";

interface RecommendationProps {
  recommendedProperties: Property[];
}
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
export const Recommendation = ({ recommendedProperties }: RecommendationProps) => {
    return(
        <div>
           <div className=" mt-50 font-medium text-xl flex justify-center items-center
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
  const navigte=useNavigate();

   const handleCardClick=() =>{
    navigte(`/property/room-detail/${property.id}`);
   }

  return (
    <div
    onClick={handleCardClick}
      className="relative rounded-lg p-3 sm:p-4 shadow-md text-left w-full transition-all duration-300 ease-out overflow-hidden
      hover:shadow-lg hover:scale-[1.015] active:scale-100 focus:outline-none cursor-pointer"
    >
      <div className="pt-1 pb-3 overflow-hidden rounded-md">
        {property.images && property.images.length > 0 && property.images[0].url ? (
          <img
            src={property.images[0].url}
            alt={property.title}
            className="w-full h-36 sm:h-40 object-cover rounded-md mb-2"
          />
        ) : (
          <div className="w-full h-36 sm:h-45 bg-gray-200 rounded-md mb-2 flex items-center justify-center text-sm text-gray-600">
            No Image
          </div>
        )}
      </div>
      <div className="pb-3">
        <p className="text-[#2563EB] text-xs sm:text-sm">{property.propertyType}</p>
        <h3 className="font-medium text-sm sm:font-semibold sm:text-base pb-2 sm:pb-0">
          {property.title}
        </h3>
        <div className="pb-2 sm:pb-4">
          {property.rentalType === 'short-term' && property.pricePerNight !== null && (
            <div className="flex items-center gap-1">
              <p className="font-bold text-base sm:text-xl text-black">₹{property.pricePerNight}</p>
              <p className="text-[#4B5563] text-sm sm:font-semibold">/night</p>
            </div>
          )}

          {property.rentalType === 'long-term' && property.pricePerMonth !== null && (
            <div className="flex items-center gap-1">
              <p className="font-bold text-base sm:text-xl text-black">₹{property.pricePerMonth}</p>
              <p className="text-[#4B5563] text-sm sm:font-semibold">/month</p>
            </div>
          )}

          {property.rentalType === 'both' && property.pricePerMonth !== null && property.pricePerNight !== null && (
            <div className="grid gap-2 sm:flex sm:justify-between sm:items-center">
              <div className="flex items-center gap-1">
                <p className="font-bold text-base sm:text-xl text-black">₹{property.pricePerNight}</p>
                <p className="text-[#4B5563] text-sm sm:font-semibold">/night</p>
              </div>
              <div className="flex items-center gap-1">
                <p className="font-bold text-base sm:text-xl text-black">₹{property.pricePerMonth}</p>
                <p className="text-[#4B5563] text-sm sm:font-semibold">/month</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

  
  export default PropertyCard;
  