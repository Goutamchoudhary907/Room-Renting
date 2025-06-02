export const RecommendationSkeleton = () => {
    return (
      <div className="animate-pulse">
        {/* Title Skeleton */}
        <div className="h-8 w-1/2 mx-auto bg-gray-200 rounded mb-8"></div>
  
        {/* Property Cards Grid Skeleton */}
        <div className="grid grid-cols-2 gap-4 px-8 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index}
              className="rounded-lg p-4 shadow-md w-full"
            >
              {/* Image Placeholder */}
              <div className="w-full h-36 sm:h-40 bg-gray-200 rounded-md mb-3"></div>
              
              {/* Property Type Placeholder */}
              <div className="h-4 w-1/4 bg-gray-200 rounded mb-2"></div>
              
              {/* Title Placeholder */}
              <div className="h-5 w-3/4 bg-gray-200 rounded mb-3"></div>
              
              {/* Price Placeholder */}
              <div className="space-y-2">
                <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
                <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };