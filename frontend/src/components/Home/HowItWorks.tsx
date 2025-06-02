import WorkStep1 from "../../assets/Work1.jpg"
import WorkStep2 from "../../assets/Work2.jpg"
import WorkStep3 from "../../assets/Work3.jpg"

interface PropertyCardProps{
    image:string;
    number:string;
    label:string;
    caption:string;
}
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