import QuickBookingIcon from "../../assets/QucikBookingIcon.png"
import ComprehensiveListingIcon from '../../assets/CompListingIcon.png'
import BestPricesIcon from '../../assets/BestPricesIcon.png'
 
export const WhyUs=()=>{
    return(
        <div className="bg-[#ffffff00]">
            <div className=" flex justify-center items-center font-medium text-xl mt-10 md:font-bold md:text-3xl md:mt-10
            lg:font-bold lg:text-3xl lg:mt-20">
                <h2>Why Choose Us</h2>
            </div>

            <div className="mt-15 grid grid-cols-1 gap-6 mr-7
             sm:grid-cols-3
              md:grid-cols-1 md:justify-items-center
               lg:grid-cols-3  
              ">
                <DisplayCard image={QuickBookingIcon} 
                label="Quick booking"
                content="Book your stay in minutes with out streamlined process"
                />

               <DisplayCard image={BestPricesIcon} 
                label="Best Prices"
                content="Competitive rates for both short and long-term stays"
                />

               <DisplayCard image={ComprehensiveListingIcon} 
                label="Comprehensive Listings"
                content="Wide range of properties to suit every need and budget"
                />
            </div>
        </div>
    )
}

interface Card{
    image:string;
    label:string;
    content:string;
}
export const DisplayCard=({image,label,content}:Card)=>{
return(
    <div className="bg-white w-90 h-42 ml-0 px-5 pt-2
     sm:ml-8 sm:px-5 sm:pt-2 sm:w-50 sm:h-42
     md:w-150
     lg:w-80  lg:ml-0 lg:px-2 lg:pt-2
     xl:w-110 xl:ml-8 xl:px-5 xl:pt-2
     ">

    <div className="">
        <img className="w-10 sm:w-10 md:w-15 xl:w-15 h-auto" src={image} alt="logo" />
    </div>

    <div className="font-medium sm:text-[16px] sm:font-semibold md:text-[18px]">
      {label}
    </div>
    <div className="text-[#666b72] break-words font-medium text-base w-[330px]
    sm:text-[12px]  sm:w-[180px]
    md:font-medium md:text-base md:w-[350px]
    lg:text-base lg:font-medium lg:w-[280px]
    xl:text-base xl:font-medium xl:w-[350px]
    ">
        {content}
    </div>
    
    </div>
)
}