import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckIcon, HeartFillIcon, HeartIcon, MapPinIcon } from "../Home/icons";

interface Property {
  id: string;
  rentalType: string;
  propertyType?: string;
  bedrooms?: number;
  title: string;
  pricePerNight?: number;
  pricePerMonth?: number;
  address: string | null;
  street?: string | null;
  city?: string | null;
  state?: string | null;
  locality?: string | null;
  property: string;
  images?: { url: string }[];
  landmark?: string;
  formattedAddress?: string;
  hasBooked?: boolean;
}
interface PropertyDisplayProps {
  properties: Property[];
  onSave: (propertyId: string) => Promise<void>;
  savedPropertyIds: string[];
  savingError: Record<string, string | null>;
  loadingSavedProperties: boolean;
}

export const PropertyDisplay: React.FC<PropertyDisplayProps> = ({
  properties,
  onSave,
  savedPropertyIds,
  savingError,
  loadingSavedProperties,
}) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property}
          onSave={onSave}
          isSaved={savedPropertyIds.includes(property.id)}
          saveError={savingError[property.id]}
          loadingSavedProperties={loadingSavedProperties}
        />
      ))}
    </div>
  );
};

interface PropertyCardProps {
  property: Property;
  onSave: (propertyId: string) => Promise<void>;
  isSaved: boolean;
  saveError: string | null;
  loadingSavedProperties: boolean;
}

const RENTAL_LABEL: Record<string, string> = {
  "short-term": "Nightly",
  "long-term": "Monthly",
  both: "Nightly & Monthly",
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const PropertyCard = ({
  property,
  onSave,
  isSaved,
  saveError,
  loadingSavedProperties,
}: PropertyCardProps) => {
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/property/room-detail/${property.id}`);
  };

  const formatLocation = (): string => {
    if (!property.city) return "Location available";
    if (property.landmark && property.city) {
      return `Near ${property.landmark}, ${property.city}`;
    }
    return property.city;
  };

  // The design shows a single price line per card. For "both" properties the
  // nightly rate is the entry price; the chip still advertises both options.
  const showNightly = property.pricePerNight != null && property.rentalType !== "long-term";
  const primaryPrice = showNightly ? property.pricePerNight : property.pricePerMonth;
  const primaryUnit = showNightly ? "/night" : "/month";

  return (
    <div
      className="group flex h-full cursor-pointer flex-col rounded-[20px] border border-cream-border bg-white p-2.5 shadow-[0_1px_3px_rgba(28,25,23,0.04)] transition-all duration-[350ms] hover:-translate-y-1 hover:border-amber/25 hover:shadow-[0_16px_40px_rgba(28,25,23,0.1)] focus:outline-none"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      {/* Image */}
      <div className="relative h-[170px] shrink-0 overflow-hidden rounded-[14px] bg-cream-border-soft">
        {property.images && property.images.length > 0 && property.images[0].url ? (
          <img src={property.images[0].url} alt={property.title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-sans text-sm text-taupe-light">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/20 to-transparent to-50%" />

        {/* Heart / save */}
        <button
          className="absolute right-2.5 top-2.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-none bg-white/90 backdrop-blur transition-all hover:scale-110 hover:bg-white disabled:cursor-not-allowed"
          onClick={async (e) => {
            e.stopPropagation();
            try {
              await onSave(property.id);
            } catch (error) {
              console.error("Save failed:", error);
            }
          }}
          disabled={loadingSavedProperties || !!saveError}
        >
          {isSaved ? <HeartFillIcon size={16} className="text-red-500" /> : <HeartIcon size={16} className="text-ink" />}
        </button>

        {/* Type badge */}
        {property.propertyType && (
          <div className="absolute left-2.5 top-2.5 rounded-full bg-ink/70 px-3 py-1 font-sans text-[11px] font-semibold text-white backdrop-blur">
            {capitalize(property.propertyType)}
          </div>
        )}
      </div>

      {saveError && <p className="mt-1 font-sans text-xs text-red-500">{saveError}</p>}

      {/* Body */}
      <div className="flex flex-1 flex-col px-2 pb-1 pt-3.5">
        <div className="mb-1.5 flex items-center gap-1.5">
          <MapPinIcon size={12} className="shrink-0 text-taupe-light" />
          <span className="overflow-hidden text-ellipsis whitespace-nowrap font-sans text-xs text-taupe-light">
            {formatLocation()}
          </span>
        </div>
        <h3 className="mb-2 overflow-hidden text-ellipsis whitespace-nowrap font-serif text-lg font-semibold text-ink">
          {property.title}
        </h3>
        <div className="mb-3 flex flex-wrap gap-1.5">
          {property.bedrooms != null && (
            <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-cream px-2.5 py-[3px] font-sans text-[11px] font-semibold text-taupe">
              {property.bedrooms} {property.bedrooms === 1 ? "Bed" : "Beds"}
            </span>
          )}
          <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full bg-amber/8 px-2.5 py-[3px] font-sans text-[11px] font-semibold text-amber">
            {RENTAL_LABEL[property.rentalType] || property.rentalType}
          </span>
        </div>
        {/* mt-auto pins this row to the card bottom so price + Verified line up
            across every card in the row regardless of title/chip wrapping. */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-cream-border-soft pt-3">
          {primaryPrice != null && (
            <span className="whitespace-nowrap">
              <span className="font-serif text-[22px] font-semibold text-ink">₹{primaryPrice}</span>
              <span className="ml-1 font-sans text-xs text-taupe-light">{primaryUnit}</span>
            </span>
          )}
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-verified/8 px-2.5 py-1 font-sans text-[11px] font-semibold text-verified">
            <CheckIcon size={10} strokeWidth={2.5} />
            Verified
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
