import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon, MapPinIcon, SearchIcon } from "./icons";

interface HeroSearchFieldsProps {
  onSearch: (location: string, checkin: Date | null, checkout: Date | null) => void;
  initialLocation?: string;
  initialCheckin?: Date | null;
  initialCheckout?: Date | null;
}

/**
 * Home-hero-only search card. This intentionally does not touch the shared
 * `SearchFields` component (still used as-is on the All Rooms page) — it's a
 * fork with the same onSearch contract, restyled to match the redesign.
 */
export const HeroSearchFields = ({
  onSearch,
  initialLocation,
  initialCheckin,
  initialCheckout,
}: HeroSearchFieldsProps) => {
  const [location, setLocation] = useState(initialLocation || "");
  const [checkinDate, setCheckinDate] = useState<Date | null>(initialCheckin || null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(initialCheckout || null);

  useEffect(() => {
    setLocation(initialLocation || "");
    setCheckinDate(initialCheckin || null);
    setCheckoutDate(initialCheckout || null);
  }, [initialLocation, initialCheckin, initialCheckout]);

  const handleSearchClick = () => onSearch(location, checkinDate, checkoutDate);

  return (
    <div className="rounded-[20px] border border-cream-border bg-white p-1.5 shadow-[0_8px_32px_rgba(28,25,23,0.08),0_1px_3px_rgba(28,25,23,0.06)]">
      <div className="flex flex-col items-stretch gap-0.5 md:flex-row md:flex-wrap md:items-stretch">
        {/* Where */}
        <div className="flex min-w-0 flex-[2] items-center gap-2.5 rounded-2xl px-4 py-3.5 transition-colors hover:bg-cream md:min-w-[160px]">
          <MapPinIcon size={18} className="shrink-0 text-amber" />
          <div className="min-w-0 flex-1">
            <div className="mb-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-taupe-light">
              Where
            </div>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Search destinations"
              className="w-full border-none bg-transparent p-0 font-sans text-sm text-ink placeholder-taupe-light focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        <div className="hidden h-8 w-px self-center bg-cream-border md:block" />

        {/* Check-in */}
        <div className="flex min-w-0 items-center gap-2 rounded-2xl px-3.5 py-3.5 transition-colors hover:bg-cream md:min-w-[124px]">
          <CalendarIcon size={16} className="shrink-0 text-amber" />
          <div className="min-w-0">
            <div className="mb-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-taupe-light">
              Check-in
            </div>
            <DatePicker
              selected={checkinDate}
              onChange={setCheckinDate}
              placeholderText="Add date"
              minDate={new Date()}
              dateFormat="MMM d"
              className="w-full cursor-pointer border-none bg-transparent p-0 font-sans text-sm text-ink placeholder-taupe-light focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        <div className="hidden h-8 w-px self-center bg-cream-border md:block" />

        {/* Check-out */}
        <div className="flex min-w-0 items-center gap-2 rounded-2xl px-3.5 py-3.5 transition-colors hover:bg-cream md:min-w-[124px]">
          <CalendarIcon size={16} className="shrink-0 text-amber" />
          <div className="min-w-0">
            <div className="mb-0.5 font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-taupe-light">
              Check-out
            </div>
            <DatePicker
              selected={checkoutDate}
              onChange={setCheckoutDate}
              placeholderText="Add date"
              minDate={checkinDate || new Date()}
              dateFormat="MMM d"
              className="w-full cursor-pointer border-none bg-transparent p-0 font-sans text-sm text-ink placeholder-taupe-light focus:outline-none focus:ring-0"
            />
          </div>
        </div>

        {/* Search button */}
        <button
          onClick={handleSearchClick}
          className="mt-0.5 flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-2xl border-none bg-ink px-7 py-3.5 font-sans text-sm font-semibold text-cream transition-all hover:bg-amber md:mt-0 md:w-auto"
        >
          <SearchIcon size={18} strokeWidth={2.5} />
          Search
        </button>
      </div>
    </div>
  );
};
