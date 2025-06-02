import React from "react";
const PropertyCardSkeleton = () => {
  return (
    <div className="relative rounded-lg p-4 shadow-md w-full overflow-hidden animate-pulse bg-white">
      {/* Image Placeholder */}
      <div className="w-full h-40 bg-gray-300 rounded-md mb-2" />

      {/* Title */}
      <div className="w-3/4 h-4 bg-gray-300 rounded mb-2" />

      {/* Rental Type */}
      <div className="w-1/2 h-3 bg-gray-200 rounded mb-2" />

      {/* Address */}
      <div className="w-full h-3 bg-gray-200 rounded mb-4" />

      {/* Price placeholders */}
      <div className="flex justify-between items-end space-x-4">
        <div className="w-1/3 h-4 bg-gray-300 rounded" />
        <div className="w-1/3 h-4 bg-gray-300 rounded" />
      </div>
    </div>
  );
};
export const PropertyDisplaySkeleton: React.FC<{ count?: number }> = ({
  count = 4,
}) => {
  return (
    <div
      className="grid grid-cols-1 gap-4 px-8
        md:grid-cols-2 md:mt-7 
        lg:grid-cols-4 xl:grid-cols-4"
    >
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default PropertyDisplaySkeleton;
