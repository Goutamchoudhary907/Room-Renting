import React from "react";

const FooterSkeleton: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-16 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
       
        <div>
          <div className="h-6 w-24 bg-gray-300 rounded mb-4" />
          <div className="h-4 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded" />
          <div className="flex space-x-4 mt-4">
            <div className="h-6 w-6 bg-gray-300 rounded-full" />
            <div className="h-6 w-6 bg-gray-300 rounded-full" />
            <div className="h-6 w-6 bg-gray-300 rounded-full" />
          </div>
        </div>

      
        <div></div>

       
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="h-4 w-20 bg-gray-300 rounded mb-2" />
            <div className="space-y-2">
              <div className="h-3 w-24 bg-gray-200 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-28 bg-gray-200 rounded" />
            </div>
          </div>
          <div>
            <div className="h-4 w-20 bg-gray-300 rounded mb-2" />
            <div className="space-y-2">
              <div className="h-3 w-28 bg-gray-200 rounded" />
              <div className="h-3 w-32 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t py-4 text-center">
        <div className="h-4 w-40 bg-gray-200 rounded mx-auto" />
      </div>
    </footer>
  );
};

export default FooterSkeleton;
