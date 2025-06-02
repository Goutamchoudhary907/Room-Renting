export const WhyUsSkeleton = () => {
    return (
      <div className="bg-white">
        <div className="flex justify-center items-center mt-10 md:mt-10 lg:mt-20 animate-pulse">
          <div className="h-6 w-40 bg-gray-200 rounded" />
        </div>
  
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 animate-pulse">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white px-5 pt-4 pb-6 rounded-lg shadow-md w-80 h-40 space-y-3">
              <div className="h-10 w-10 bg-gray-200 rounded" />
              <div className="h-4 w-1/2 bg-gray-300 rounded" />
              <div className="h-3 w-full bg-gray-200 rounded" />
              <div className="h-3 w-3/4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  };
  