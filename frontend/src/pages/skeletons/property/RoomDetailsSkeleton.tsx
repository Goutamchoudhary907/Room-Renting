export const RoomDetailsSkeleton = () => {
  return (
    <div className="animate-pulse px-8 py-4 space-y-6">
      {/* Image grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 md:row-span-2 h-[50vh] bg-gray-300 rounded-lg" />
        <div className="h-[22vh] bg-gray-300 rounded-lg" />
        <div className="h-[22vh] bg-gray-300 rounded-lg" />
        <div className="h-[22vh] bg-gray-300 rounded-lg" />
        <div className="h-[22vh] bg-gray-300 rounded-lg" />
      </div>

      {/* Title and address */}
      <div className="mt-6">
        <div className="h-8 bg-gray-300 w-2/3 rounded-md mb-2" />
        <div className="h-5 bg-gray-200 w-1/3 rounded-md" />
      </div>

      {/* Icons for bedroom & bathroom */}
      <div className="flex gap-10 mt-4">
        <div className="h-5 bg-gray-300 w-1/4 rounded-md" />
        <div className="h-5 bg-gray-300 w-1/4 rounded-md" />
      </div>

      {/* About this property */}
      <div className="space-y-3 mt-6">
        <div className="h-6 bg-gray-300 w-1/4 rounded-md" />
        <div className="h-4 bg-gray-200 w-full rounded-md" />
        <div className="h-4 bg-gray-200 w-5/6 rounded-md" />
        <div className="h-4 bg-gray-200 w-3/4 rounded-md" />
      </div>

      {/* Amenities */}
      <div className="mt-6 space-y-2">
        <div className="h-6 bg-gray-300 w-1/4 rounded-md" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-2">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="h-6 bg-gray-200 rounded-md" />
          ))}
        </div>
      </div>

      {/* Map section */}
      <div className="mt-6 space-y-2">
        <div className="h-6 bg-gray-300 w-1/4 rounded-md" />
        <div className="h-40 bg-gray-200 rounded-md" />
        <div className="h-5 bg-gray-200 w-1/2 rounded-md" />
      </div>

      {/* Sidebar (Price Box) */}
      <div className="w-full md:w-[25%] bg-gray-100 p-6 rounded-lg mt-10 space-y-4">
        <div className="h-8 bg-gray-300 w-3/4 rounded-md" />
        <div className="h-10 bg-gray-300 w-full rounded-md" />
        <div className="h-10 bg-gray-300 w-full rounded-md" />
      </div>
    </div>
  );
};

export default RoomDetailsSkeleton;
