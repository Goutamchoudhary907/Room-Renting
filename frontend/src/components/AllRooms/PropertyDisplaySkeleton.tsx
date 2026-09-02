import React from "react";

const PropertyCardSkeleton = () => {
  return (
    <div className="animate-pulse rounded-[20px] border border-cream-border bg-white p-2.5">
      <div className="h-[170px] w-full rounded-[14px] bg-cream-border-soft" />
      <div className="px-2 pb-1 pt-3.5">
        <div className="mb-2 h-3 w-1/2 rounded bg-cream-border-soft" />
        <div className="mb-3 h-5 w-3/4 rounded bg-cream-border-soft" />
        <div className="mb-3 flex gap-1.5">
          <div className="h-5 w-14 rounded-full bg-cream-border-soft" />
          <div className="h-5 w-16 rounded-full bg-cream-border-soft" />
        </div>
        <div className="border-t border-cream-border-soft pt-3">
          <div className="h-6 w-1/2 rounded bg-cream-border-soft" />
        </div>
      </div>
    </div>
  );
};

export const PropertyDisplaySkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <PropertyCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default PropertyDisplaySkeleton;
