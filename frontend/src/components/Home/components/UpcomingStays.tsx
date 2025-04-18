const demoProperty:Property[]=[
   { id: 1,
    title: "Cozy Apartment in the City Center",
    availability: null,
    hostId: 123,
    images: [{ id: 101, url: "https://res.cloudinary.com/dgxwedthd/image/upload/v1742924287/property-images/uh0lv9qrgfivnmjcukwb.jpg", propertyId: 1 }],
    bookingStatus: "BOOKED",} ,
    {
        id: 2,
      title: "Luxury Villa with Private Pool",
      availability: null,
      hostId: 456,
      images: [{ id: 201, url: "https://res.cloudinary.com/dgxwedthd/image/upload/v1742924287/property-images/uh0lv9qrgfivnmjcukwb.jpg", propertyId: 2 }],
      bookingStatus: "AVAILABLE",
    }
]
export const UpcomingStays=() =>{
    return(
        <div className="bg-[#ffffff00]">
        <div className=" flex justify-center items-center font-medium text-xl mt-10 md:font-bold md:text-3xl md:mt-10
        lg:font-bold lg:text-3xl lg:mt-20">
            <h2>Your Upcoming Stays</h2>
        </div>

        <div className="mt-15 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3  gap-6 mr-7
              ">
             {demoProperty.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
        </div>
        </div>
    )
}



interface Property{
    id: number;
    title: string;
    availability: null;
    hostId: number;
    images: Image[];
    bookingStatus:'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE';
  }
  
  interface Image {
      id: number;
      url: string;
      propertyId: number;
    }
  interface PropertyCardProps {
      property: Property;
    //   onDelete: (propertyId: number) => void;
    //   onEdit:(propertyId:number) => void;
    }
  const PropertyCard= ({property}:PropertyCardProps) =>{
  
   return(
      <div className="">
  
      <div className="rounded p-4 shadow-md">
     <div className="pt-1 pb-3">
     <img src={property.images[0].url} alt={property.title} className="w-full h-45 object-cover rounded-md mb-2"/>
     </div>
     <div className="flex justify-between items-center pb-3">
     <h3 className="font-semibold text-xl ">{property.title}</h3>
     <div className=" rounded-full overflow-hidden w-22 h-7 bg-[#D1FAE5] flex items-center justify-center text-[#059669]">
      {property.bookingStatus?.charAt(0).toUpperCase() + property.bookingStatus.slice(1).toLowerCase()}
     </div>
     </div>
  
      <div className="flex justify-between items-center">
  
         <div>
         <p className="text-[#4B5563]">Next Booking</p>
         <p className="font-semibold text-xl">Apr 1 , 2025</p>
         </div>
      </div>
  
   
      <div className="grid grid-cols-3 gap-4 pt-7 text-[#4B5563]  font-medium pb-4">
         <button className={`w-32 justify-center items-center border-1 border-gray-200 bg-white  transition-all duration-300 mr-4 h-10 rounded-xl cursor-pointer focus:bg-[#2564ebcc] focus:text-white`}
        //  onClick={() => onEdit(property.id)}
         >
          <div className="flex justify-center items-center"
          >
          Manage
          </div>
          </button>
         
          <button className={`text-white w-32 justify-center items-center border-1 border-gray-200 bg-[#2564ebe0] transition-all duration-300 mr-4 h-10   rounded-xl cursor-pointer`}>
          <div className="flex justify-center items-center">
          Cancel
          </div>
          </button>
      </div>
  
      </div>
  
      </div>
   )
  }