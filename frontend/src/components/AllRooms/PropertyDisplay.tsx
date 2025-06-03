import React from "react";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
interface Property {
  id: string;
  rentalType: string;
  title: string;
  pricePerNight?: number;
  pricePerMonth?: number;
  address: string;
  property: string;
  images?: { url: string }[];
}
interface PropertyDisplayProps {
  properties: Property[];
  onSave: (propertyId: string) => Promise<void>;
  savedPropertyIds: string[];
  savingError: Record<string, string | null>;
  loadingSavedProperties: boolean;
}

export const PropertyDisplay: React.FC<PropertyDisplayProps> = ({
  properties,
  onSave,
  savedPropertyIds,
  savingError,
  loadingSavedProperties,
}) => {
  return (
    <div>
      <div
        className="grid grid-cols-1 gap-4 px-8
           md:grid md:gap-4 md:px-8 md:grid-cols-2 md:mt-7 
          lg:mt-0  lg:grid-cols-4  xl:grid-cols-4
           "
      >
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onSave={onSave}
            isSaved={savedPropertyIds.includes(property.id)}
            saveError={savingError[property.id]}
            loadingSavedProperties={loadingSavedProperties}
          />
        ))}
      </div>
    </div>
  );
};

interface PropertyCardProps {
  property: Property;
  onSave: (propertyId: string) => Promise<void>;
  isSaved: boolean;
  saveError: string | null;

  loadingSavedProperties: boolean;
}

const PropertyCard = ({
  property,
  onSave,
  isSaved,
  saveError,
  loadingSavedProperties,
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    console.log("Card clicked");
    navigate(`/property/room-detail/${property.id}`);
  };

  const formatRentalType = (type: string): string => {
    switch (type) {
      case "short-term":
        return "Short-Term Stay";
      case "long-term":
        return "Long-Term Rental";
      case "both":
        return "Short & Long-Term";
      default:
        return type;
    }
  };

  return (
    <div
      className="relative rounded-lg p-4 shadow-md text-left w-full transition-all duration-300 ease-out overflow-hidden hover:shadow-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      <div className="pt-1 pb-3 overflow-hidden rounded-md">
        {property.images &&
        property.images.length > 0 &&
        property.images[0].url ? (
          <img
            src={property.images[0].url}
            alt={property.title}
            className="w-full h-40 object-cover rounded-md mb-2"
          />
        ) : (
          <div className="w-full h-45 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
            No Image
          </div>
        )}
      </div>

      <div>
      <button
  className="mt-4 mr-4 cursor-pointer absolute top-2 right-2 bg-white rounded-full p-1 shadow-md focus:outline-none"
  onClick={async (e) => { // Add async here
    e.stopPropagation();
    try {
      await onSave(property.id); // Add await
    } catch (error) {
      console.error("Save failed:", error);
    }
  }}
  disabled={loadingSavedProperties || !!saveError}
>
  {isSaved ? (
    <HeartSolidIcon className="h-4 w-4 text-red-500" />
  ) : (
    <HeartIcon className="h-4 w-4 text-gray-400" />
  )}
</button>

  {saveError && <p className="text-red-500 text-xs mt-1">{saveError}</p>}
</div>


      <div className="pb-3">
      <h3 
  className="font-medium text-sm md:font-semibold md:text-base pb-2"
  style={{
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: '1.5rem',
    maxHeight: '1.5rem'
  }}
>
  {property.title}
</h3>
        <p className="text-[#2563EB] text-sm mb-1">
          {formatRentalType(property.rentalType)}
        </p>
        <p className="text-[#4B5563] pt-1">{property.address}</p>

        <div className="pt-1 pb-4 md:pb-4">
          {property.rentalType === "short-term" &&
            property.pricePerNight !== null && (
              <div className="flex items-center">
                <div className="group relative">
                  <p className="font-bold text-sm md:font-bold md:text-xl text-black">
                    ₹{property.pricePerNight}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </p>
                </div>
                <p className="text-[#4B5563] font-normal md:font-semibold ml-2">
                  /night
                </p>
              </div>
            )}
          {property.rentalType === "long-term" &&
            property.pricePerMonth !== null && (
              <div className="flex items-end">
                <div className="group relative">
                  <p className="font-bold text-sm md:font-bold md:text-xl text-black">
                    ₹{property.pricePerMonth}
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                  </p>
                </div>
                <p className="text-[#4B5563] font-normal md:font-semibold ml-2">
                  /month
                </p>
              </div>
            )}
          {property.rentalType === "both" &&
            property.pricePerMonth !== null &&
            property.pricePerNight !== null && (
              <div className="grid md:flex justify-between items-center">
                <div className="flex items-end">
                  <div className="group relative">
                    <p className="font-bold text-sm md:font-bold md:text-xl text-black">
                      ₹{property.pricePerNight}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </p>
                  </div>
                  <p className="text-[#4B5563] font-normal md:font-semibold ml-2">
                    /night
                  </p>
                </div>
                <div className="flex items-end">
                  <div className="group relative">
                    <p className="font-bold text-sm md:font-bold md:text-xl text-black">
                      ₹{property.pricePerMonth}
                      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </p>
                  </div>
                  <p className="text-[#4B5563] font-normal md:font-semibold ml-2">
                    /month
                  </p>
                </div>
              </div>
            )}{" "}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
