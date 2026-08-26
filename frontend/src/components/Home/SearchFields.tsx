import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon, MapPinIcon, SearchIcon } from "./icons";

interface SearchFieldsProps {
  onSearch: (location: string, checkin: Date | null, checkout: Date | null) => void;
  initialLocation?: string;
  initialCheckin?: Date | null;
  initialCheckout?: Date | null;
}

/** All Rooms page header search bar — compact variant of the Home hero's HeroSearchFields. */
export const SearchFields = ({ onSearch, initialLocation, initialCheckin, initialCheckout }: SearchFieldsProps) => {
  const [location, setLocation] = useState<string>(initialLocation || "");
  const [checkinDate, setCheckinDate] = useState<Date | null>(initialCheckin || null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(initialCheckout || null);

  useEffect(() => {
    setLocation(initialLocation || "");
    setCheckinDate(initialCheckin || null);
    setCheckoutDate(initialCheckout || null);
  }, [initialLocation, initialCheckin, initialCheckout]);

  const handleSearchClick = () => {
    onSearch(location, checkinDate, checkoutDate);
  };

  return (
    <div className="rounded-2xl border border-cream-border bg-cream p-1.5">
      <div className="flex flex-col items-stretch gap-0.5 md:flex-row">
        {/* Where */}
        <div className="flex min-w-0 flex-[2] items-center gap-2.5 rounded-xl bg-white px-3.5 py-3">
          <MapPinIcon size={16} className="shrink-0 text-amber" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City or area"
            className="w-full min-w-0 border-none bg-transparent p-0 font-sans text-sm text-ink placeholder-taupe-light focus:outline-none focus:ring-0"
          />
        </div>

        <div className="hidden w-px self-center bg-cream-border md:block md:h-7" />

        {/* Check-in */}
        <div className="flex min-w-0 items-center gap-2 rounded-xl bg-white px-3.5 py-3 md:min-w-[110px]">
          <CalendarIcon size={14} className="shrink-0 text-amber" />
          <DatePicker
            selected={checkinDate}
            onChange={setCheckinDate}
            placeholderText="Check-in"
            minDate={new Date()}
            dateFormat="MMM d"
            className="w-full min-w-0 cursor-pointer border-none bg-transparent p-0 font-sans text-sm text-ink placeholder-taupe-light focus:outline-none focus:ring-0"
          />
        </div>

        <div className="hidden w-px self-center bg-cream-border md:block md:h-7" />

        {/* Check-out */}
        <div className="flex min-w-0 items-center gap-2 rounded-xl bg-white px-3.5 py-3 md:min-w-[110px]">
          <CalendarIcon size={14} className="shrink-0 text-amber" />
          <DatePicker
            selected={checkoutDate}
            onChange={setCheckoutDate}
            placeholderText="Check-out"
            minDate={checkinDate || new Date()}
            dateFormat="MMM d"
            className="w-full min-w-0 cursor-pointer border-none bg-transparent p-0 font-sans text-sm text-ink placeholder-taupe-light focus:outline-none focus:ring-0"
          />
        </div>

        <button
          onClick={handleSearchClick}
          className="mt-0.5 flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border-none bg-ink px-6 py-3 font-sans text-sm font-semibold text-cream transition-all hover:bg-amber md:mt-0"
        >
          <SearchIcon size={16} strokeWidth={2.5} />
          Search
        </button>
      </div>
    </div>
  );
};
