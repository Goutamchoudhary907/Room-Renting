import IndoreImage from "../../../assets/IndoreImage.png"
import PuneImage from "../../../assets/PuneImage.png"
import BangloreImage from "../../../assets/BangloreImage.jpg"
import DelhiImage from "../../../assets/DelhiImage.png"


export const PopularDestinations =() =>{
    return(
        <div> 
            <div className=" flex justify-center items-center font-medium text-xl mt-6 sm:mt-10 md:font-bold md:text-3xl md:mt-10
            lg:font-bold lg:text-3xl lg:mt-20">
                <h2>Popular Destinations</h2>
            </div>

            <div className="grid grid-cols-2 gap-0 
          sm:gap-4  px-0 sm:px-8
          md:grid md:gap-4 md:px-8 md:grid-cols-2 md:mt-7 
          lg:mt-0  lg:grid-cols-4  xl:grid-cols-4
           ">
            <PropertyCard image={IndoreImage}
            name="Indore"
            />

          <PropertyCard image={PuneImage}
            name="Pune"
            /><PropertyCard image={BangloreImage}
            name="Banglore"
            /><PropertyCard image={DelhiImage}
            name="Delhi"
            />
            </div>
        </div>
    )
}

interface PropertyCardProps{
    name:string;
    image:string;
}
const PropertyCard = ({name,image }: PropertyCardProps) => {
     return(
       <div className="mt-5  sm:mt-8 md:mt-0 lg:mt-15">
         <button className="relative rounded-lg p-4 shadow-md text-left w-full transition-all duration-300 ease-out overflow-hidden
        hover:shadow-lg hover:scale-[1.008] active:scale-100 focus:outline-none">

          <div className="relative pt-1 pb-3  overflow-hidden rounded-md cursor-pointer">
            <img
              src={image}
              alt={name}
              className="w-50 h-50 sm:w-full sm:h-60 md:h-70 lg:h-100 object-cover rounded-xl mb-2 brightness-75"
            />
          
        <div className="absolute bottom-10 left-2 text-white font-serif font-semibold text-xl sm:font-bold sm:text-4xl">
            {name}
        </div>
        </div>

        </button>
       </div>
     )
  };
  