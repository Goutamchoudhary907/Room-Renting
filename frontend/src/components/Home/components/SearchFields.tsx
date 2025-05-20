import DatePicker from 'react-datepicker';
import { useEffect, useState } from "react";
import DatePickerImg from "../../../assets/DatePickerImg.png"
import LocationIcon from "../../../assets/Location.png"
import SearchIcon from "../../../assets/SearchIcon.png"

interface SearchFieldsProps{
onSearch: (location: string, checkin: Date | null, checkout: Date | null) => void;
  initialLocation?: string;
  initialCheckin?: Date | null;
  initialCheckout?: Date | null; 
}
export const SearchFields=({onSearch,initialLocation,initialCheckin,initialCheckout}:SearchFieldsProps) =>{
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
  return(
    <div className="w-full md:w-[720px] lg:w-[740px] xl:w-205  bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[3fr_1fr_1fr_1fr]  lg:grid-cols-[3fr_1fr_1fr_1fr] gap-3 sm:gap-4
    md:gap-4 lg:gap-5 p-4 sm:p-6 md:p-3 md:pr-2 lg:p-3 lg:pr-2 md:ml-5 md:pl-0 lg:ml-42 xl:ml-89 lg:mt-3 xl:mt-4">

   <div className="relative sm:col-span-2 md:col-auto md:ml-4 lg:ml-0 xl:ml-4">
     <input type="text" 
      placeholder="Where do you want to stay ?"
      className="w-full md:w-55 h-12 sm:h-10 md:h-10 lg:w-50 xl:w-70 bg-white border-2 border-gray-200  font-semibold pl-7
       sm:pl-10 md:pl-7 focus:outline-1 placeholder:text-gray-500 md:placeholder:font-medium xl:placeholder:font-semibold lg:placeholder:font-semibold
        md:placeholder:text-sm lg:placeholder:text-[12px] xl:placeholder:text-[16px] lg:pl-7 xl:pl-7"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
       <img
       src={LocationIcon}
       alt="Location"
       className="absolute top-1/2 left-3 sm:left-2 transform -translate-y-1/2 h-5 w-5 pointer-events-none"
     />
     </div>
     <div className="grid grid-cols-2 gap-3 sm:gap-4 md:flex md:gap-2 lg:gap-0">
    {/* <div className="flex flex-col md:flex-row items-center gap-4 md:gap-0"> */}
      <DateInputField id="checkin" label="Check-in" onChange={setCheckinDate} selected={checkinDate} minDate={new Date()} />
      <DateInputField id="checkout" label="Check-out" onChange={setCheckoutDate} selected={checkoutDate} minDate={checkinDate || new Date()} />
    </div>

    <button className="h-12 sm:h-10 md:h-8 lg:h-9 w-full md:mt-0.5 lg:mt-0 md:w-16 bg-blue-500 sm:rounded-md lg-w-16 flex items-center 
    justify-center sm:col-span-2 md:col-auto cursor-pointer  relative z-10"
    onClick={handleSearchClick}
    >
    <img src={SearchIcon} alt="Search" className="h-5 w-5 text-white" />
    <span className="ml-2 text-white sm:hidden">Search</span>
  </button>
   </div>
  )
}




interface DateInputField{
    id:string;
    label:string;
    selected:Date | null ;
    onChange:(date:Date | null) => void;
    minDate?:Date |null;
}


export const DateInputField=({id,label, selected, onChange,minDate}:DateInputField) =>{
    return(
        <div className="relative w-full md:w-[180px] lg:w-50 h-12 sm:h-10">
           {!selected && (
        <div
        className="absolute inset-0 flex items-center justify-center text-gray-500 font-semibold lg:text-sm xl:text-base pointer-events-none transition-opacity duration-200 z-10"  >    
          {label}
        </div>
      )}
  <div className="">
            <DatePicker 
            id={id}
            selected={selected}
            onChange={onChange}
            placeholderText=""
            className="w-full h-10 bg-white border-2 border-gray-200 font-semibold text-center focus:outline-1  lg:placeholder:text-sm placeholder:font-semibold" 
              dateFormat="dd-MM-yyyy"
              minDate={minDate || new Date()} 
              selectsStart={id === 'checkin'}  // This is a start date picker
              selectsEnd={id === 'checkout'}  // This is an end date picker
              startDate={id === 'checkout' ? minDate : undefined}  // For checkout, set startDate to checkin date
              endDate={id === 'checkin' ? undefined : selected}    // For checkin, no end date
            />
 <img
          src={DatePickerImg}
          alt="Calendar"
          className="absolute top-1/2 left-2 transform -translate-y-1/2 h-5 w-5 pointer-events-none"
        />
        </div>
        </div>
    )
}
