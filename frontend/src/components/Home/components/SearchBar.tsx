import SearchBarImage from "../../../assets/SearchBarBackground.png"
import SearchBarImageLogged from "../../../assets/SearchBgLoggedIn.png"
import 'react-datepicker/dist/react-datepicker.css';

import { useAuth } from "../../../context/AuthContext";
import { SearchFields } from "./SearchFields";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export const SearchBar=() =>{
const { user} = useAuth();
const isLoggedIn = !!user;
const [rentalType,setRentalType]=useState<string | null>(null);

const backgroundImage = isLoggedIn ? `url(${SearchBarImageLogged})` : `url(${SearchBarImage})`;

const greeting= isLoggedIn && user ? `Welcome back, ${user.firstName}!` :"Find Your Perfect Stay- From a Night"
const subHeading=isLoggedIn && user? "Ready to explore?": "to Months";
const tagline=isLoggedIn && user ? "Start your next adventure": "Flexible rentals tailored to your lifestyle";

const navigate = useNavigate();
const handleSearch=(location:string, checkin:Date | null , checkout:Date | null) =>{
  const queryParams=new URLSearchParams();

  if(location) queryParams.set('location', location);
  if(checkin) queryParams.set('checkin', checkin ?checkin.toISOString().split('T')[0] :'');
  if (checkout) queryParams.set('checkout', checkout ? checkout.toISOString().split('T')[0] : '');
  if(rentalType) queryParams.set('rentalType',rentalType);
  
  navigate(`/property/all-rooms?${queryParams.toString()}`);
}
const handleRentalTypeClick = (type: string) => {
  // Toggle selection - if same type is clicked again, deselect it
  setRentalType(prev => prev === type ? null : type);
};
    return(
        <div className="w-full flex flex-col">

            <div style={{   backgroundImage: backgroundImage , backgroundSize:"100% 400px" , backgroundRepeat: "no-repeat"}}
                className=" w-full h-[300px] sm:h-[300px] md:h-100 lg:h-90 xl:h-100  relative">

           {/* <div className="absolute inset-0 bg-black opacity-15"></div> */}
           <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-15"></div>
           
            <div className="text-white text-center pt-16 md:pt-0 lg:pt-0  xl:pt-0 relative z-10 px-4 md:px-0">

                <h2 className="text-2xl sm:text-3xl md:text-2xl lg:text-[30px] xl:text-5xl lg:px-40 font-bold sm:pt-16 md:pt-8 lg:pt-16 md:px-40 leading-tight">
                  {greeting} 
                  <br /></h2>
                <span className="text-xl sm:text-2xl md:text-2xl lg:text-[30px] xl:text-5xl font-bold mt-1 sm:mt-2">
                  {subHeading}
                </span>
                <h4 className="text-base sm:text-lg mt-2 sm:mt-3 md:mt-0 md:text-base lg:text-xl lg:pt-0 xl:pt-4">
                {tagline}
                  </h4>
            </div>
            
            <SearchFields onSearch={handleSearch}/>

            <div className="w-full md:w-[500px] lg:w-90 xl:w-90 grid grid-cols-1 sm:grid-cols-2
             gap-3 sm:gap-4 md:gap-0 pt-6 lg:pt-8 sm:pt-8
             px-4 sm:px-6 md:px-0  sm:ml-15 lg:ml-80 xl:ml-140  md:ml-40 lg:px-0">

            <Button label="Short-Term Stays" id="short-term"
            onClick={handleRentalTypeClick}
            active={rentalType ==='short-term'}
            />
            <Button 
            label="Long-Term Rentals" 
            id="long-term"
            onClick={handleRentalTypeClick}
            active={rentalType === 'long-term'}
          />
            </div>
          
        </div>
        </div>
    )
}

interface ButtonProps {
  id: string;
  label: string;
  onClick?:(type:string) => void;
  active?:boolean;
}
const Button=({id,label,active,onClick}:ButtonProps) =>{
    return(
        <button 
        className={`
          h-12 w-full sm:w-60 md:w-[200px] lg:w-40 
          font-semibold rounded-md
          flex items-center justify-center p-2 
          relative z-10
          transition-colors duration-200
          ${
            active 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-white text-blue-600 hover:bg-blue-50'
          }
        `}
        type="button"
          id={id}
          onClick={() => onClick && onClick(id)}
        >
         {label}
          </button>
    )
}