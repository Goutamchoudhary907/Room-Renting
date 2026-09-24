import { SearchBarSkeleton } from "../../components/HomeSkeleton/SearchBarSkeleton";
import { RecommendationSkeleton } from "../../components/HomeSkeleton/Recommendations";
import { WhyUsSkeleton } from "../../components/HomeSkeleton/WhyUsSkeleton";
import { PopularDestinationsSkeleton } from "../../components/HomeSkeleton/PopularDestinationsSkeleton";
import { HowItWorksSkeleton } from "../../components/HomeSkeleton/HowItWorksSkeleton";
import { ListingAndSearchCardSkeleton } from "../../components/HomeSkeleton/ListingAndSearchCardSkeleton";

export const HomeSkeleton = () => (
  <div className="bg-cream">
    <SearchBarSkeleton />
    <RecommendationSkeleton />
    <WhyUsSkeleton />
    <PopularDestinationsSkeleton />
    <HowItWorksSkeleton />
    <ListingAndSearchCardSkeleton />
  </div>
);
