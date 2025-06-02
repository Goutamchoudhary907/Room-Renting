export const SearchFieldsSkeleton = () => {
    return (
      <div className="mx-4 sm:mx-8 my-4 animate-pulse">
        {/* Mobile Layout Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden lg:hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="h-5 w-3/4 bg-gray-200 rounded" />
          </div>
  
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            <div className="p-4">
              <div className="h-4 w-1/2 bg-gray-200 mb-2 rounded" />
              <div className="h-6 w-full bg-gray-200 rounded" />
            </div>
            <div className="p-4">
              <div className="h-4 w-1/2 bg-gray-200 mb-2 rounded" />
              <div className="h-6 w-full bg-gray-200 rounded" />
            </div>
          </div>
  
          <div className="p-4 bg-gray-50">
            <div className="w-full h-10 bg-gray-300 rounded-lg" />
          </div>
        </div>
  
        {/* Desktop Layout Skeleton */}
        <div className="hidden lg:flex w-full max-w-5xl mx-auto bg-white rounded-full shadow-sm border border-blue-100 px-3 py-4 items-center gap-3 animate-pulse">
          <div className="flex-[2] h-10 bg-gray-200 rounded-full" />
          <div className="w-px h-6 bg-gray-300" />
          <div className="w-32 h-10 bg-gray-200 rounded-full" />
          <div className="w-px h-6 bg-gray-300" />
          <div className="w-32 h-10 bg-gray-200 rounded-full" />
          <div className="h-10 w-24 bg-gray-300 rounded-full ml-4" />
        </div>
      </div>
    );
  };
  