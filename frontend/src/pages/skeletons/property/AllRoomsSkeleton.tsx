import { SearchFieldsSkeleton } from "../../../components/HomeSkeleton/SearchFieldSkeleton";
import RoomFilterBarSkeleton from "../../../components/AllRooms/RoomFilterBarSkeleton";
import PropertyDisplaySkeleton from "../../../components/AllRooms/PropertyDisplaySkeleton";

export const AllRoomsSkeleton = () => {
  return (
    <div className="min-h-screen bg-cream">
      {/* Page header + search skeleton */}
      <div className="border-b border-cream-border bg-white px-6 py-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 animate-pulse">
            <div className="mb-3 h-3 w-16 rounded bg-cream-border-soft" />
            <div className="h-9 w-48 rounded bg-cream-border-soft" />
          </div>
          <SearchFieldsSkeleton />
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex flex-col items-start gap-8 lg:flex-row">
          <RoomFilterBarSkeleton />
          <div className="min-w-0 flex-1">
            <div className="mb-5 flex animate-pulse items-center justify-between">
              <div className="h-4 w-24 rounded bg-cream-border-soft" />
              <div className="h-9 w-32 rounded bg-cream-border-soft" />
            </div>
            <PropertyDisplaySkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};
