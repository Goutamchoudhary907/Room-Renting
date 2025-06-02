import DatePicker from 'react-datepicker';
import { useEffect, useState } from "react";
import DatePickerImg from "../../assets/DatePickerImg.png"
import LocationIcon from "../../assets/Location.png"
import SearchIcon from "../../assets/SearchIcon.png"
import 'react-datepicker/dist/react-datepicker.css';
interface SearchFieldsProps{
onSearch: (location: string, checkin: Date | null, checkout: Date | null) => void;
  initialLocation?: string;
  initialCheckin?: Date | null;
  initialCheckout?: Date | null; 
}
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
    <div className="mx-4 sm:mx-8 my-4">
      {/* === Mobile Layout (2x2 grid) === */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden lg:hidden">
        
        {/* Location Field - Top Section */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center">
            <img src={LocationIcon} alt="Location" className="h-5 w-5 mr-3 text-gray-400" />
            <input
              type="text"
              placeholder="Where are you going?"
              className="flex-1 text-base font-medium placeholder-gray-500 border-none focus:outline-none focus:ring-0"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>
        
        {/* Date Fields - Middle Section */}
        <div className="grid grid-cols-2 divide-x divide-gray-100">
          {/* Check-in */}
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-500 mb-1">Check-in</label>
            <DatePicker
              selected={checkinDate}
              onChange={setCheckinDate}
              placeholderText="Add dates"
              className="w-full text-base font-medium text-gray-900 border-none p-0 focus:outline-none focus:ring-0"
              minDate={new Date()}
              dateFormat="MMM d"
            />
          </div>
          
          {/* Check-out */}
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-500 mb-1">Check-out</label>
            <DatePicker
              selected={checkoutDate}
              onChange={setCheckoutDate}
              placeholderText="Add dates"
              className="w-full text-base font-medium text-gray-900 border-none p-0 focus:outline-none focus:ring-0"
              minDate={checkinDate || new Date()}
              dateFormat="MMM d"
            />
          </div>
        </div>
        
        {/* Search Button - Bottom Section */}
        <div className="p-4 bg-gray-50">
          <button
            onClick={() => onSearch(location, checkinDate, checkoutDate)}
            className="w-full py-3 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium flex items-center justify-center"
          >
            <img src={SearchIcon} alt="" className="h-5 w-5 mr-2" />
            Search
          </button>
        </div>
      </div>


      {/* === Desktop Layout (unchanged) === */}
      <div className="hidden lg:flex w-full lg:w-165 max-w-5xl mx-auto bg-white rounded-full shadow-sm border border-blue-100 px-3 py-1 items-center gap-3 hover:shadow-md transition-shadow duration-200">
        {/* Location */}
        <div className="flex-[2] relative group">
          <input
            type="text"
            placeholder="Search destinations"
            className="w-full h-10 pl-10 pr-4 text-base font-medium placeholder-gray-500 border-none bg-transparent focus:outline-none focus:ring-0"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <img
            src={LocationIcon}
            alt="Location"
            className="absolute top-1/2 left-4 transform -translate-y-1/2 h-5 w-5 pointer-events-none"
          />
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Check-in */}
        <div className="w-32 relative">
          <DateInputField
            id="checkin"
            label="Check in"
            selected={checkinDate}
            onChange={setCheckinDate}
            minDate={new Date()}
          />
        </div>

        <div className="w-px h-6 bg-gray-300" />

        {/* Check-out */}
        <div className="w-32 relative">
          <DateInputField
            id="checkout"
            label="Check out"
            selected={checkoutDate}
            onChange={setCheckoutDate}
            minDate={checkinDate || new Date()}
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearchClick}
          className="h-12 px-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-400 lg:z-20"
        >
          <img src={SearchIcon} alt="Search" className="h-5 w-5" />
          <span className="text-white text-sm font-medium ml-2">Search</span>
        </button>
      </div>
    </div>
  );

};



interface DateInputField{
    id:string;
    label:string;
    selected:Date | null ;
    onChange:(date:Date | null) => void;
    minDate?:Date |null;
}




const DateInputField = ({ id, label, selected, onChange, minDate }: DateInputField) => {
  return (
    <div className="h-full relative group">
      <DatePicker
        id={id}
        selected={selected}
        onChange={onChange}
        placeholderText={label}
        className="w-full h-10 pl-4 pr-4 text-sm font-medium placeholder-gray-500 bg-transparent border-none rounded-full focus:outline-none focus:ring-0 cursor-pointer"
        dateFormat="MMM d"
        minDate={minDate || new Date()}
        selectsStart={id === 'checkin'}
        selectsEnd={id === 'checkout'}
        startDate={id === 'checkin' ? selected : null}
        endDate={id === 'checkout' ? selected : null}
        popperClassName="z-50"
        aria-label={`Select ${label.toLowerCase()} date`}
      />
      <div className="absolute inset-0 -z-10 rounded-full group-hover:bg-gray-50 transition-colors" />
      </div>
  );
};