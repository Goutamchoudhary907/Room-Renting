import { SearchFieldsSkeleton } from "../../../components/HomeSkeleton/SearchFieldSkeleton";
import RoomFilterBarSkeleton from "../../../components/AllRooms/RoomFilterBarSkeleton";
import PropertyDisplaySkeleton from "../../../components/AllRooms/PropertyDisplaySkeleton";

export const AllRoomsSkeleton = () => {
  return (
    <div>
      {/* SearchFields skeleton */}
      <SearchFieldsSkeleton/>

      {/* RoomFilterBar skeleton */}
      <RoomFilterBarSkeleton/>

      {/* Heading skeleton for Available Properties */}
      <div
        className="ml-10 pb-5 font-medium text-xl mt-6 sm:mt-10 
                   md:font-bold md:text-3xl md:mt-10
                   lg:font-bold lg:text-3xl lg:mt-10"
      >
        <div className="h-10 w-48 bg-gray-300 rounded animate-pulse"></div>
      </div>

      {/* PropertyDisplay skeleton */}
      <PropertyDisplaySkeleton/>
    </div>
  );
};
