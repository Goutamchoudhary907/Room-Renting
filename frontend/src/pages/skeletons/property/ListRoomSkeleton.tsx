// ListRoomSkeleton.jsx

export default function ListRoomSkeleton() {
    return (
      <div className="flex justify-center items-center bg-[#E6E6E6] min-h-screen p-4 lg:p-20">
        <div className="w-full max-w-5xl animate-pulse">
          {/* Header */}
          <div className="mb-4 lg:mb-10">
            <div className="h-8 lg:h-10 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-5 lg:h-6 bg-gray-300 rounded w-72"></div>
          </div>
  
          {/* Upload Requirements Box */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-6">
            <div className="h-6 bg-blue-300 rounded w-40 mb-3"></div>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <div className="h-4 bg-blue-200 rounded w-60"></div>
              </li>
              <li>
                <div className="h-4 bg-blue-200 rounded w-56"></div>
              </li>
              <li>
                <div className="h-4 bg-blue-200 rounded w-48"></div>
              </li>
            </ul>
          </div>
  
          {/* Room Details Section */}
          <div className="mb-10">
            <div className="flex items-center mb-4">
              <div className="h-6 w-6 bg-gray-300 rounded mr-2"></div>
              <div className="h-6 bg-gray-300 rounded w-40"></div>
            </div>
            <div className="space-y-5">
              <div className="h-10 bg-gray-300 rounded w-full lg:w-3/4"></div>
              <div className="h-20 bg-gray-300 rounded w-full lg:w-3/4"></div>
              <div className="h-28 bg-gray-300 rounded w-full lg:w-3/4"></div>
            </div>
          </div>
  
          {/* Rental and Property Section */}
          <div className="mb-10">
            <div className="flex items-center mb-4">
              <div className="h-6 w-6 bg-gray-300 rounded mr-2"></div>
              <div className="h-6 bg-gray-300 rounded w-52"></div>
            </div>
  
            <div className="h-6 bg-gray-300 rounded w-36 mb-3"></div>
  
            <div className="flex gap-4 flex-wrap">
              <div className="h-10 bg-gray-300 rounded w-32"></div>
              <div className="h-10 bg-gray-300 rounded w-32"></div>
              <div className="h-10 bg-gray-300 rounded w-32"></div>
            </div>
  
            <div className="mt-6 h-12 bg-gray-300 rounded w-40"></div>
          </div>
  
          {/* Room Specifications Section */}
          <div className="mb-10">
            <div className="flex items-center mb-4">
              <div className="h-6 w-6 bg-gray-300 rounded mr-2"></div>
              <div className="h-6 bg-gray-300 rounded w-52"></div>
            </div>
  
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
              <div className="h-12 bg-gray-300 rounded"></div>
            </div>
          </div>
  
          {/* Amenities Section */}
          <div className="mb-10">
            <div className="flex items-center mb-4">
              <div className="h-6 w-6 bg-gray-300 rounded mr-2"></div>
              <div className="h-6 bg-gray-300 rounded w-36"></div>
            </div>
            <div className="h-14 bg-gray-300 rounded w-full lg:w-3/4"></div>
          </div>
  
          {/* Pricing Section */}
          <div className="mb-10">
            <div className="flex items-center mb-4">
              <div className="h-6 w-6 bg-gray-300 rounded mr-2"></div>
              <div className="h-6 bg-gray-300 rounded w-36"></div>
            </div>
  
            <div className="flex gap-6 flex-wrap">
              <div className="h-12 bg-gray-300 rounded w-48"></div>
              <div className="h-12 bg-gray-300 rounded w-48"></div>
            </div>
          </div>
  
          {/* Address Section */}
          <div className="mb-10">
            <div className="flex items-center mb-4">
              <div className="h-6 w-6 bg-gray-300 rounded mr-2"></div>
              <div className="h-6 bg-gray-300 rounded w-36"></div>
            </div>
            <div className="h-10 bg-gray-300 rounded w-full lg:w-3/4"></div>
          </div>
  
          {/* Button */}
          <div className="h-12 bg-blue-400 rounded w-full lg:w-48 cursor-not-allowed"></div>
        </div>
      </div>
    );
  }
  