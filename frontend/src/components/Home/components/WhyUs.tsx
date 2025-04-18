import QuickBookingIcon from "../../../assets/QucikBookingIcon.png"
import ComprehensiveListingIcon from '../../../assets/CompListingIcon.png'
import BestPricesIcon from '../../../assets/BestPricesIcon.png'
 
export const WhyUs=()=>{
    return(
        <div className="bg-[#ffffff00]">
            <div className=" flex justify-center items-center font-medium text-xl mt-10 md:font-bold md:text-3xl md:mt-10
            lg:font-bold lg:text-3xl lg:mt-20">
                <h2>Why Choose Us</h2>
            </div>

            <div className="mt-15 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3  gap-6 mr-7
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
    <div className="bg-white w-70 h-42  ml-8 px-5 pt-2 sm:w-50  md:w-150 lg:w-110 sm:h-42  sm:ml-8 sm:px-5 sm:pt-2">

    <div className="">
        <img className="w-10 sm:w-10 md:w-15 xl:w-15 h-auto" src={image} alt="logo" />
    </div>

    <div className="font-medium sm:text-[16px] sm:font-semibold md:text-[18px]">
      {label}
    </div>
    <div className="md:font-medium sm:text-[12px] md:text-base lg:text-base text-[#666b72] sm:w-[180px] md:w-[350px] break-words">
        {content}
    </div>
    
    </div>
)
}