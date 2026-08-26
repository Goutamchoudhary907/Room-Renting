import { useNavigate } from "react-router-dom";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { ArrowRightIcon, ArrowUpRightIcon } from "./icons";

interface RecommendationProps {
  recommendedProperties: Property[];
}
interface Property {
  id: string;
  propertyType: string;
  rentalType: string;
  title: string;
  pricePerNight?: number;
  pricePerMonth?: number;
  property: string;
  images?: { url: string }[];
}

export const Recommendation = ({ recommendedProperties }: RecommendationProps) => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
        <SectionHeader
          align="left"
          eyebrow="Handpicked for you"
          heading={
            <>
              Your perfect stay <em className="font-medium italic text-amber">awaits</em>
            </>
          }
        />
        <button
          onClick={() => navigate("/property/all-rooms")}
          className="flex cursor-pointer items-center gap-2 rounded-full border-none bg-ink px-7 py-3 font-sans text-[13px] font-semibold text-cream shadow-[0_4px_16px_rgba(28,25,23,0.15)] transition-all hover:bg-amber"
        >
          View all rooms
          <ArrowRightIcon />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {recommendedProperties.map((property, i) => (
          <Reveal key={property.id} delay={Math.min(i, 3) * 0.05}>
            <PropertyCard property={property} />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

const RENTAL_LABEL: Record<string, string> = {
  "short-term": "Nightly",
  "long-term": "Monthly",
  both: "Nightly & Monthly",
};

interface PropertyCardProps {
  property: Property;
}
const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/property/room-detail/${property.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer rounded-[20px] border border-cream-border bg-white p-2.5 shadow-[0_1px_3px_rgba(28,25,23,0.04)] transition-all duration-[400ms] hover:-translate-y-1.5 hover:border-amber/30 hover:shadow-[0_20px_44px_rgba(28,25,23,0.12)]"
    >
      {/* Image */}
      <div className="relative h-[180px] overflow-hidden rounded-[14px] bg-cream-border-soft">
        {property.images && property.images.length > 0 && property.images[0].url ? (
          <img src={property.images[0].url} alt={property.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-sans text-sm text-taupe-light">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/25 to-transparent to-50%" />
        <div className="absolute bottom-2.5 right-2.5 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-white opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRightIcon className="text-ink" />
        </div>
      </div>

      {/* Body */}
      <div className="px-2 pb-2 pt-3.5">
        <h3 className="mb-2 overflow-hidden text-ellipsis whitespace-nowrap font-serif text-[19px] font-semibold text-ink">
          {property.title}
        </h3>
        <div className="mb-3.5 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center rounded-full bg-cream px-2.5 py-1 font-sans text-[11px] font-semibold text-taupe">
            {property.propertyType}
          </span>
          <span className="inline-flex items-center rounded-full bg-amber/8 px-2.5 py-1 font-sans text-[11px] font-semibold text-amber">
            {RENTAL_LABEL[property.rentalType] || property.rentalType}
          </span>
        </div>
        <div className="border-t border-cream-border-soft pt-3">
          {property.rentalType === "short-term" && property.pricePerNight != null && (
            <span>
              <span className="font-serif text-[22px] font-semibold text-ink">₹{property.pricePerNight}</span>
              <span className="ml-1 font-sans text-xs text-taupe-light">/night</span>
            </span>
          )}

          {property.rentalType === "long-term" && property.pricePerMonth != null && (
            <span>
              <span className="font-serif text-[22px] font-semibold text-ink">₹{property.pricePerMonth}</span>
              <span className="ml-1 font-sans text-xs text-taupe-light">/month</span>
            </span>
          )}

          {property.rentalType === "both" && property.pricePerMonth != null && property.pricePerNight != null && (
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span>
                <span className="font-serif text-[22px] font-semibold text-ink">₹{property.pricePerNight}</span>
                <span className="ml-1 font-sans text-xs text-taupe-light">/night</span>
              </span>
              <span>
                <span className="font-serif text-[22px] font-semibold text-ink">₹{property.pricePerMonth}</span>
                <span className="ml-1 font-sans text-xs text-taupe-light">/month</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
