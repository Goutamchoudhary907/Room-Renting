import WorkStep1 from "../../../assets/Work1.jpg"
import WorkStep2 from "../../../assets/Work2.jpg"
import WorkStep3 from "../../../assets/Work3.jpg"


// export const HowItWorks=() =>{
//     return(
//         <div className="bg-white pb-100">
//             <div className=" flex justify-center items-center font-medium text-xl mt-6 sm:mt-10 md:font-bold md:text-3xl md:mt-10
//             lg:font-bold lg:text-3xl lg:mt-20 pt-15">
//                 <h2>Book Your Stay in 3 Simple Steps</h2>
//             </div>

//             <div className="mt-15 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-40 sm:gap-25 md:gap-0 
//              mx-auto max-w-[1200px] mr-42 md:mr-42 lg:mr-42 ml-12 sm:ml-4 md:ml-0 lg:ml-37 xl:ml-37 ">
//                 <PropertyCard image={WorkStep1}
//                 number="01"
//                 label="Search & Find"
//                 caption="Browse through our curated selection of properties" 
//                 />

//               <PropertyCard image={WorkStep2}
//                 number="02"
//                 label="Book Instantly"
//                 caption="Secure your stay with our instant booking system" 
//                 />

//                <PropertyCard image={WorkStep3}
//                 number="03"
//                 label="Enjoy Your Stay"
//                 caption="Experience a comfortable and memorable stay" 
//                 />
//             </div>
//         </div>
//     )
// }

interface PropertyCardProps{
    image:string;
    number:string;
    label:string;
    caption:string;
}

// const PropertyCard=({image,number,label,caption}:PropertyCardProps) =>{
//     return(
//         <div className="w-70 h-42 ml-0 md:ml-0 px-5 pt-2 sm:w-50  md:w-150 lg:w-110 sm:h-42 
//          sm:px-5 sm:pt-2">
          
//           <div className="relative w-45 h-45 sm:w-35 sm:h-35 md:w-45 md:h-45 lg:w-60 lg:h-60 sm:ml-5 md:ml-20 rounded-full overflow-hidden mx-auto">
//             <img src={image} alt={image} 
//             className="w-full h-full object-cover"
//             />
//           </div>

//       <div className="pl-0 sm:pl-8 md:pl-0  text-center md:w-80 mx-auto ">
//       <div className="font-semibold text-blue-500">
//             {number}
//           </div>

//           <div className="font-bold">
//             {label}
//           </div>

//           <div className="md:font-medium text-[14px] sm:text-[12px] md:text-base lg:text-base text-[#666b72] break-words">
//            {caption}
//           </div>
//       </div>
//         </div>
//     )
// }

export const HowItWorks = () => {
    return (
      <div className="bg-white py-20">
        <div className="flex justify-center items-center">
          <h2 className="text-xl md:text-3xl font-medium md:font-bold text-center">
            Book Your Stay in 3 Simple Steps
          </h2>
        </div>
  
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 mx-auto px-4 max-w-[1200px]">
          <PropertyCard 
            image={WorkStep1}
            number="01"
            label="Search & Find"
            caption="Browse through our curated selection of properties" 
          />
          <PropertyCard 
            image={WorkStep2}
            number="02"
            label="Book Instantly"
            caption="Secure your stay with our instant booking system" 
          />
          <PropertyCard 
            image={WorkStep3}
            number="03"
            label="Enjoy Your Stay"
            caption="Experience a comfortable and memorable stay" 
          />
        </div>
      </div>
    )
  }
  
  const PropertyCard = ({image, number, label, caption}: PropertyCardProps) => {
    return (
      <div className="px-4 py-6">
      <div className="relative w-45 h-45 sm:w-45 sm:h-45 md:w-45 md:h-45 lg:w-60 lg:h-60 mx-auto rounded-full overflow-hidden">
          <img src={image} alt="" className="w-full h-full object-cover"/>
        </div>
        
        <div className="mt-6 text-center">
          <div className="font-semibold text-blue-500">{number}</div>
          <div className="font-bold text-lg mt-2">{label}</div>
          <div className="text-gray-600 mt-2 text-sm md:text-base">
            {caption}
          </div>
        </div>
      </div>
    )
  }