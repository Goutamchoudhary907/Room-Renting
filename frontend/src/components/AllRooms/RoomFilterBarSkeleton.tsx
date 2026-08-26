import React from "react";

const RoomFilterBarSkeleton: React.FC = () => {
  return (
    <>
      {/* Desktop sidebar skeleton */}
      <div className="hidden animate-pulse lg:block lg:w-[260px] lg:shrink-0">
        <div className="rounded-[20px] border border-cream-border bg-white p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-6 w-20 rounded bg-cream-border-soft" />
            <div className="h-4 w-14 rounded bg-cream-border-soft" />
          </div>
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="mb-6">
              <div className="mb-3 h-3 w-24 rounded bg-cream-border-soft" />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="h-8 w-14 rounded-full bg-cream-border-soft" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile trigger skeleton */}
      <div className="animate-pulse px-6 pb-4 lg:hidden">
        <div className="h-12 w-full rounded-2xl bg-cream-border-soft" />
      </div>
    </>
  );
};

export default RoomFilterBarSkeleton;
