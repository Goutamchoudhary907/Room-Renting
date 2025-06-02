import "react-datepicker/dist/react-datepicker.css";

export const SearchBarSkeleton = () => {
  return (
    <div className="w-full flex flex-col">
      <div
        className="w-full h-[300px] sm:h-[300px] md:h-100 lg:h-90 xl:h-100 relative bg-gray-200 animate-pulse"
        style={{
          backgroundSize: "100% 400px",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Gradient overlay mimic */}
        <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-15 z-0" />

        {/* Text skeleton */}
        <div className="text-white flex flex-col items-center justify-center text-center relative z-10 px-4">
          <div className="h-6 sm:h-10 w-48 sm:w-80 bg-gray-300 rounded mb-2 mt-6 sm:mt-16" />
          <div className="hidden sm:block h-6 sm:h-8 w-40 sm:w-64 bg-gray-300 rounded mt-1 sm:mt-2" />
          <div className="hidden lg:block h-4 sm:h-5 w-56 sm:w-80 bg-gray-400 rounded mt-4" />
        </div>

        {/* Search fields skeleton */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-full px-4 sm:px-6 md:px-40 lg:px-80">
          <div className="w-full h-16 bg-gray-300 rounded-lg animate-pulse" />
        </div>

        {/* Rental type button skeletons */}
        <div
          className="w-full md:w-[500px] lg:w-90 xl:w-90 grid grid-cols-1 sm:grid-cols-2
         gap-3 sm:gap-4 md:gap-0 pt-0 lg:pt-0 sm:pt-8
         px-4 sm:px-6 md:px-0 sm:ml-15 lg:ml-80 xl:ml-140 md:ml-40 lg:px-0"
        >
          <div className="h-12 bg-gray-300 rounded-md animate-pulse" />
          <div className="h-12 bg-gray-300 rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
};
