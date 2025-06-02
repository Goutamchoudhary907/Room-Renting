export const HowItWorksSkeleton = () => {
    return (
      <div className="bg-white py-20 animate-pulse">
        {/* Title Skeleton */}
        <div className="flex justify-center items-center">
          <div className="h-8 w-64 bg-gray-200 rounded-md"></div>
        </div>
  
        {/* Cards Grid Skeleton */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 mx-auto px-4 max-w-[1200px]">
          {[1, 2, 3].map((item) => (
            <div key={item} className="px-4 py-6">
              {/* Image Placeholder (Circle) */}
              <div className="relative w-45 h-45 sm:w-45 sm:h-45 md:w-45 md:h-45 lg:w-60 lg:h-60 mx-auto rounded-full overflow-hidden bg-gray-200"></div>
              
              {/* Text Content Placeholders */}
              <div className="mt-6 text-center space-y-2">
                <div className="h-4 w-8 mx-auto bg-gray-200 rounded"></div>
                <div className="h-5 w-32 mx-auto bg-gray-200 rounded"></div>
                <div className="h-3 w-40 mx-auto bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };