export const ListingAndSearchCardSkeleton = () => {
    return (
      <div className="bg-white grid grid-cols-1 gap-5 px-8 justify-items-center
        sm:grid-cols-1 sm:gap-5 sm:px-8 sm:justify-items-start
        md:grid-cols-2 md:gap-5 md:px-8 md:justify-items-center
        lg:grid-cols-2 lg:gap-5 lg:pl-8 lg:justify-items-start
        xl:grid-cols-2 xl:gap-8 xl:px-8 xl:justify-items-center
        2xl:grid-cols-2 2xl:gap-8 2xl:px-16 2xl:justify-center animate-pulse"
      >
        {/* First Action Card Skeleton */}
        <div className="bg-gray-200 flex flex-col justify-center items-center text-center rounded-2xl
          w-80 h-50 p-4 
          sm:w-155 sm:h-50 sm:p-4 
          md:w-88 md:h-50 md:p-2 
          lg:w-115 lg:h-50 lg:p-4 
          xl:w-170 xl:h-50 xl:p-4 
          2xl:max-w-2xl 2xl:p-6"
        >
          <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded mb-6"></div>
          <div className="h-10 w-32 bg-white rounded-md"></div>
        </div>
  
        {/* Second Action Card Skeleton */}
        <div className="bg-gray-200 flex flex-col justify-center items-center text-center rounded-2xl
          w-80 h-50 p-4 
          sm:w-155 sm:h-50 sm:p-4 
          md:w-88 md:h-50 md:p-2 
          lg:w-115 lg:h-50 lg:p-4 
          xl:w-170 xl:h-50 xl:p-4 
          2xl:max-w-2xl 2xl:p-6"
        >
          <div className="h-6 w-3/4 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 w-5/6 bg-gray-300 rounded mb-6"></div>
          <div className="h-10 w-32 bg-white rounded-md"></div>
        </div>
      </div>
    );
  };