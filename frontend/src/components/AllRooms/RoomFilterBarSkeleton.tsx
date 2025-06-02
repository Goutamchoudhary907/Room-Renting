import React from "react";

const RoomFilterBarSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-white shadow-sm animate-pulse">
    
      <div className="hidden lg:block">
        <div className="w-full border-t border-gray-200" />
        <div className="flex flex-wrap items-center gap-4 px-6 py-4">
          
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="grid gap-1">
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
              <div className="h-9 w-32 bg-gray-300 rounded"></div>
            </div>
          ))}

          <div className="self-end flex gap-2">
            <div className="h-9 w-24 bg-gray-300 rounded"></div>
            <div className="h-9 w-24 bg-gray-400 rounded"></div>
          </div>
        </div>
        <div className="w-full border-t border-gray-200" />
      </div>

      <div className="lg:hidden p-4">
        <div className="h-12 bg-gray-200 rounded-lg w-full" />
      </div>
    </div>
  );
};

export default RoomFilterBarSkeleton;
