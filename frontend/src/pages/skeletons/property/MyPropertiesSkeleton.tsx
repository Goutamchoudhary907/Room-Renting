export default function MyPropertiesSkeleton() {
    return (
      <div className="flex justify-center items-center bg-[#E6E6E6] min-h-screen p-4 lg:p-20">
        <div className="w-full max-w-7xl animate-pulse">
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="h-10 bg-gray-300 rounded w-48 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-72"></div>
          </div>
  
          {/* Grid of Properties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(12)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-4">
                {/* Image */}
                <div className="bg-gray-300 rounded w-full h-40"></div>
                
                {/* Title */}
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                {/* Location */}
                <div className="h-5 bg-gray-300 rounded w-1/2"></div>
                
                {/* Description lines */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                  <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                </div>
                
                {/* Action buttons */}
                <div className="flex gap-4 mt-auto">
                  <div className="h-10 bg-gray-300 rounded w-24"></div>
                  <div className="h-10 bg-gray-300 rounded w-24"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  