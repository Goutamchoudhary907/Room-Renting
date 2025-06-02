export const PopularDestinationsSkeleton = () => {
  return (
    <div>
      {/* Heading */}
      <div className="flex justify-center items-center font-medium text-xl mt-6 sm:mt-10 md:font-bold md:text-3xl md:mt-10 lg:font-bold lg:text-3xl lg:mt-20 animate-pulse">
        <div className="h-8 w-48 bg-gray-300 rounded" />
      </div>

      {/* Grid layout */}
      <div
        className="grid grid-cols-2 gap-0 
        sm:gap-4 px-0 sm:px-8
        md:grid md:gap-4 md:px-8 md:grid-cols-2 md:mt-7 
        lg:mt-0 lg:grid-cols-4 xl:grid-cols-4 animate-pulse"
      >
        {[...Array(4)].map((_, index) => (
          <div key={index} className="mt-5 sm:mt-8 md:mt-0 lg:mt-15">
            <div
              className="relative rounded-lg p-4 shadow-md w-full overflow-hidden
              bg-white border border-gray-200"
            >
              <div className="relative pt-1 pb-3 overflow-hidden rounded-md">
                <div className="w-50 h-50 sm:w-full sm:h-60 md:h-70 lg:h-100 bg-gray-300 rounded-xl mb-2" />
                <div className="absolute bottom-10 left-2 h-6 w-24 bg-gray-400 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

