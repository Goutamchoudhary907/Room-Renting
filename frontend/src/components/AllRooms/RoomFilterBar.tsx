import { useEffect, useState } from "react";
import { amenityOptions, bedroomOptions, propertyOptions } from "../Property/ListRoom/constants";
import { Filters } from "../Property/ListRoom/types";
import { CalendarIcon, ClockIcon, FilterIcon, XIcon } from "../Home/icons";

interface RoomFilterBarProps {
  onFilterChange: (filterData: Filters) => void;
  currentFilters?: Filters;
}

const RENTAL_TYPES = [
  { value: "short-term", label: "Short-term", icon: <ClockIcon size={13} /> },
  { value: "long-term", label: "Long-term", icon: <CalendarIcon size={13} /> },
];

export const RoomFilterBar: React.FC<RoomFilterBarProps> = ({
  onFilterChange,
  currentFilters = {},
}) => {
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice || "");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(currentFilters.amenities || []);
  const [propertyType, setPropertyType] = useState(currentFilters.propertyType || "");
  const [rentalType, setRentalType] = useState(currentFilters.rentalType || "");
  const [bedrooms, setBedrooms] = useState(currentFilters.bedrooms || "");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setMinPrice(currentFilters.minPrice || "");
    setMaxPrice(currentFilters.maxPrice || "");
    setSelectedAmenities(currentFilters.amenities || []);
    setPropertyType(currentFilters.propertyType || "");
    setRentalType(currentFilters.rentalType || "");
    setBedrooms(currentFilters.bedrooms || "");
  }, [currentFilters]);

  // Filters apply live as you interact (the design has no separate "Apply" button) —
  // every handler below builds the next full filter snapshot and emits it immediately.
  type Snapshot = {
    minPrice: string;
    maxPrice: string;
    amenities: string[];
    propertyType: string;
    rentalType: string;
    bedrooms: string;
  };
  const emit = (patch: Partial<Snapshot>) => {
    const next: Snapshot = {
      minPrice,
      maxPrice,
      amenities: selectedAmenities,
      propertyType,
      rentalType,
      bedrooms,
      ...patch,
    };
    onFilterChange({
      minPrice: next.minPrice || undefined,
      maxPrice: next.maxPrice || undefined,
      amenities: next.amenities.length > 0 ? next.amenities : undefined,
      propertyType: next.propertyType || undefined,
      rentalType: next.rentalType || undefined,
      bedrooms: next.bedrooms || undefined,
    });
  };

  const togglePropertyType = (value: string) => {
    const next = propertyType === value ? "" : value;
    setPropertyType(next);
    emit({ propertyType: next });
  };

  const toggleBedrooms = (value: string) => {
    const next = bedrooms === value ? "" : value;
    setBedrooms(next);
    emit({ bedrooms: next });
  };

  const toggleRentalType = (value: string) => {
    const next = rentalType === value ? "" : value;
    setRentalType(next);
    emit({ rentalType: next });
  };

  const toggleAmenity = (value: string) => {
    const next = selectedAmenities.includes(value)
      ? selectedAmenities.filter((a) => a !== value)
      : [...selectedAmenities, value];
    setSelectedAmenities(next);
    emit({ amenities: next });
  };

  const commitMinPrice = () => emit({ minPrice });
  const commitMaxPrice = () => emit({ maxPrice });

  const handleClearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedAmenities([]);
    setPropertyType("");
    setRentalType("");
    setBedrooms("");
    onFilterChange({
      minPrice: undefined,
      maxPrice: undefined,
      amenities: undefined,
      propertyType: undefined,
      rentalType: undefined,
      bedrooms: undefined,
    });
    setIsMobileFiltersOpen(false);
  };

  const activeCount =
    (propertyType ? 1 : 0) + (rentalType ? 1 : 0) + (bedrooms ? 1 : 0) + selectedAmenities.length + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0);

  const content = (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="m-0 font-serif text-xl font-semibold text-ink">Filters</h3>
        <button
          onClick={handleClearFilters}
          className="cursor-pointer border-none bg-transparent font-sans text-xs font-semibold text-amber"
        >
          Clear all
        </button>
      </div>

      {/* Property type */}
      <div className="mb-6">
        <label className="mb-3 block font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
          Property type
        </label>
        <div className="flex flex-wrap gap-2">
          {propertyOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => togglePropertyType(opt.value)}
              className={`rounded-full border-[1.5px] px-3.5 py-2 font-sans text-xs font-semibold transition-all ${
                propertyType === opt.value
                  ? "border-ink bg-ink text-gold"
                  : "border-cream-border bg-white text-taupe hover:border-amber hover:text-amber"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="mb-6">
        <label className="mb-3 block font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
          Price range
        </label>
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 flex-1 items-center rounded-[10px] border-[1.5px] border-cream-border bg-white px-3">
            <span className="mr-1 font-sans text-[13px] text-taupe-light">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              onBlur={commitMinPrice}
              onKeyDown={(e) => e.key === "Enter" && commitMinPrice()}
              placeholder="Min"
              className="w-full min-w-0 border-none bg-transparent p-0 font-sans text-[13px] text-ink focus:outline-none focus:ring-0"
            />
          </div>
          <span className="text-taupe-light">—</span>
          <div className="flex h-10 flex-1 items-center rounded-[10px] border-[1.5px] border-cream-border bg-white px-3">
            <span className="mr-1 font-sans text-[13px] text-taupe-light">₹</span>
            <input
              type="text"
              inputMode="numeric"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              onBlur={commitMaxPrice}
              onKeyDown={(e) => e.key === "Enter" && commitMaxPrice()}
              placeholder="Max"
              className="w-full min-w-0 border-none bg-transparent p-0 font-sans text-[13px] text-ink focus:outline-none focus:ring-0"
            />
          </div>
        </div>
      </div>

      {/* Bedrooms */}
      <div className="mb-6">
        <label className="mb-3 block font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
          Bedrooms
        </label>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => toggleBedrooms("")}
            className={`flex h-10 min-w-10 items-center justify-center rounded-[10px] border-[1.5px] px-2 font-sans text-[13px] font-semibold transition-all ${
              bedrooms === ""
                ? "border-ink bg-ink text-gold"
                : "border-cream-border bg-white text-taupe hover:border-amber hover:text-amber"
            }`}
          >
            Any
          </button>
          {bedroomOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleBedrooms(String(opt.value))}
              className={`flex h-10 w-10 items-center justify-center rounded-[10px] border-[1.5px] font-sans text-[13px] font-semibold transition-all ${
                bedrooms === String(opt.value)
                  ? "border-ink bg-ink text-gold"
                  : "border-cream-border bg-white text-taupe hover:border-amber hover:text-amber"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rental type */}
      <div className="mb-6">
        <label className="mb-3 block font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
          Rental type
        </label>
        <div className="flex gap-2">
          {RENTAL_TYPES.map((rt) => (
            <button
              key={rt.value}
              type="button"
              onClick={() => toggleRentalType(rt.value)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border-[1.5px] py-2.5 font-sans text-xs font-semibold transition-all ${
                rentalType === rt.value
                  ? "border-ink bg-ink text-gold"
                  : "border-cream-border bg-white text-taupe hover:border-amber hover:text-amber"
              }`}
            >
              {rt.icon}
              {rt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <label className="mb-3 block font-sans text-[11px] font-bold uppercase tracking-[0.12em] text-ink-soft">
          Amenities
        </label>
        <div className="flex flex-wrap gap-2">
          {amenityOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleAmenity(opt.value)}
              className={`rounded-full border-[1.5px] px-3 py-[7px] font-sans text-[11px] font-semibold transition-all ${
                selectedAmenities.includes(opt.value)
                  ? "border-ink bg-ink text-gold"
                  : "border-cream-border bg-white text-taupe hover:border-amber hover:text-amber"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:sticky lg:top-[88px] lg:block lg:w-[260px] lg:shrink-0">
        <div className="rounded-[20px] border border-cream-border bg-white p-6 shadow-[0_1px_3px_rgba(28,25,23,0.04)]">
          {content}
        </div>
      </div>

      {/* Mobile trigger */}
      <div className="px-6 pb-4 lg:hidden">
        <button
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex w-full cursor-pointer items-center justify-between rounded-2xl border border-cream-border bg-white px-4 py-3 font-sans text-sm text-ink"
        >
          <span className="flex items-center gap-2">
            <FilterIcon size={16} className="text-amber" />
            Filters
          </span>
          {activeCount > 0 && (
            <span className="rounded-full bg-amber/10 px-2.5 py-1 text-xs font-bold text-amber">{activeCount}</span>
          )}
        </button>
      </div>

      {/* Mobile drawer */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[200] flex flex-col bg-cream lg:hidden">
          <div className="flex items-center justify-between border-b border-cream-border px-6 py-4">
            <h2 className="m-0 font-serif text-xl font-semibold text-ink">Filters</h2>
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border-none bg-cream-border-soft"
            >
              <XIcon size={18} className="text-ink" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">{content}</div>
          <div className="flex gap-3 border-t border-cream-border bg-white p-4">
            <button
              onClick={handleClearFilters}
              className="flex-1 cursor-pointer rounded-xl border-[1.5px] border-cream-border bg-white py-3 font-sans text-sm font-semibold text-ink"
            >
              Clear all
            </button>
            <button
              onClick={() => setIsMobileFiltersOpen(false)}
              className="flex-1 cursor-pointer rounded-xl border-none bg-ink py-3 font-sans text-sm font-semibold text-cream"
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </>
  );
};
