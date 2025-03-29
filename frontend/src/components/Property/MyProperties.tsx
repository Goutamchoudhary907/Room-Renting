import ProperyIcon from "../../assets/PropertyIcon.png";
import ActiveListingIcon from "../../assets/ActiveListingIcon.png"
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../config";
import axios from 'axios';
import EditIcon from "../../assets/EditIcon.png"
import CalenderIcon from "../../assets/CalendarIcon2.png"
import DeleteIcon from "../../assets/DeleteIcon2.png"
import { useNavigate } from "react-router-dom";
export const MyProperties =() =>{

    const navigate=useNavigate();
    const [properties, setProperties] = useState<Property[]>([]);
    const [searchQuery, setSearchQuery]=useState("");
    const [filteredStatus, setFilteredStatus]=useState<string | null>(null);
    const [activeButton, setActiveButton]=useState<string | null>(null);

   useEffect(() =>{
    const fetchProperties= async()=>{
        try {
           const token=localStorage.getItem('token');
           if(!token){
            throw new Error ("Unauthorised");
           }

            const response=await axios.get(`${BACKEND_URL}/property/my/properties`, {
                headers:{
                    Authorization: `Bearer ${token}` ,
                }
            });
            console.log(response);
            
         setProperties(response.data);
        } catch (error:any) {
            // setError(error)
        }
    }
    fetchProperties();
   },[]);

   // Calculate active listings
   const activeListingsCount=properties.filter(
    (property) => property.bookingStatus === "AVAILABLE"
   ).length;

     // Filter properties based on search query
     const normalizedSerachQuery=searchQuery.toLowerCase().replace(/\s/g, '');

     const filteredProperties=properties.filter((property) =>
    property.title.toLowerCase().replace(/\s/g,'') .includes(normalizedSerachQuery)
    );

     const statusFilteredProperties=filteredStatus ? properties.filter((property) =>
     property.bookingStatus===filteredStatus
    ):properties;

    const displayProperties=searchQuery ? statusFilteredProperties.filter((property) =>
    filteredProperties.some((filteredProperty) => filteredProperty.id === property.id)
    ):statusFilteredProperties;
    

    const handleDelete=async (propertyId:number) =>{
        try {
            const token=localStorage.getItem('token');
            await axios.delete(`${BACKEND_URL}/property/delete/${propertyId}`, {
                    headers:{
                    Authorization:`Bearer ${token}`,
                }
            })
            setProperties(properties.filter(property => property.id !== propertyId)); 
        } catch (error) {
            alert("Error deleting property");
        }
    }
     const handleEdit= (propertyId:number) =>{
        navigate(`/property/edit/${propertyId}`);
     }
    return(
        <div className="h-screen w-screen bg-[#F9FAFB]">

           <div className="flex justify-between items-center pt-8 pl-8 pr-8 ">
            <h1 className="text-[#111827] font-bold text-3xl">My Properties</h1>
            <button className="bg-[#2563EB] text-white text-xl p-2 w-52 cursor-pointer transition-all duration-500" 
            onClick={() =>{
                navigate("/property/create");
            }} 
            >+ Add New Property</button>
            </div>

            <div className="flex justify-between items-center w-screen pt-4">

             <div className="w-1/2 h-24 m-4 p-3  bg-white rounded shadow  ml-18  flex items-center">
                 <div className=" rounded-full overflow-hidden w-10 h-10 bg-[#DBEAFE] flex items-center justify-center">
                <img className="object-contain" src={ProperyIcon} alt="home" />
                </div>
                <div className="flex flex-col justify-center ml-4">
                <p className=" font-bold text-2xl">{properties.length}</p>
                <p className="text-[#4B5563] font-medium text-xl ">Total Properties</p>
                </div>
             </div>

             <div className="w-1/2 h-24 m-4 p-3 bg-white rounded shadow  ml-18  flex items-center">
                 <div className=" rounded-full overflow-hidden w-10 h-10 bg-[#22c55e0a] flex items-center justify-center">
                <img className="object-contain" src={ActiveListingIcon} alt="home" />
                </div>
                <div className="flex flex-col justify-center ml-4">
                <p className=" font-bold text-2xl">{activeListingsCount}</p>
                <p className="text-[#4B5563] font-medium text-xl ">Active Listings</p>
                </div>
             </div>  
               
            </div> 

            <div className=" flex justify-between items-center p-8">

                <div >
                    <input type="text"
                    placeholder="Search properties..."
                    className="w-80 h-10 bg-white border-2 border-gray-200 text-[#4B5563] font-semibold pl-5 focus:outline-1"
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value)
                        console.log("Search Query:", e.target.value);}}
                    />
                </div>

                <div className="text-[#4B5563]  font-medium ">
                <Button className={`w-50 ${
                activeButton === 'all' ?' bg-[#2563EB] text-white': "bg-white text-[#4B5563]" 
                }`}
                onClick={()=>{
                  setFilteredStatus(null)
                  setActiveButton('all');
                }}
                >All Properties</Button>

                <Button  className={`w-50 ${
                 activeButton === 'AVAILABLE' ? 'bg-[#2563EB] text-white'  : 'bg-white text-[#4B5563]'
                 }`}
                onClick={()=>{
                  setFilteredStatus("AVAILABLE");  
                  setActiveButton('AVAILABLE')
                }}
                >Available</Button>

                <Button className={`w-50 ${
                activeButton === 'BOOKED' ? 'bg-[#2563EB] text-white' : 'bg-white text-[#4B5563]'
                }`}
                onClick={() =>{
                    setFilteredStatus("BOOKED")
                    setActiveButton('BOOKED')
                }}
                >Booked</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-20 px-8">
                {displayProperties.map((property) =>(
                    <PropertyCard key={property.id} property={property}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                    />
                ))}
            </div>
        </div>
    )
} 

interface ButtonProps {
    children: string;
    className?:string;
    onClick?:() => void;
  }

const Button = ({children, className='', onClick}:ButtonProps) =>{
    return(
        <button className={` ${className} border-1 border-gray-200  transition-all duration-300 mr-4 h-10 rounded-xl cursor-pointer`}
        onClick={onClick}
        >
        {children}
        </button>
                  
    )
}

interface Property{
  id: number;
  title: string;
  rentalType: string;
  pricePerNight: number | null;
  pricePerMonth: number | null;
  address: string;
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
    onDelete: (propertyId: number) => void;
    onEdit:(propertyId:number) => void;
  }
const PropertyCard= ({property,onDelete,onEdit}:PropertyCardProps) =>{

 return(
    <div className="">

    <div className="rounded p-4 shadow-md">
   <div className="pt-4 pb-5">
   <img src={property.images[0].url} alt={property.title} className="w-full h-50 object-cover rounded-md mb-2"/>
   </div>
   <div className="flex justify-between items-center pb-4">
   <h3 className="font-semibold text-xl mb-1">{property.title}</h3>
   <div className=" rounded-full overflow-hidden w-22 h-7 bg-[#D1FAE5] flex items-center justify-center text-[#059669]">
    {property.bookingStatus?.charAt(0).toUpperCase() + property.bookingStatus.slice(1).toLowerCase()}
   </div>
   </div>
   
  
    <div className="pb-4">
    {property.rentalType ==='short-term' && property.pricePerNight !== null && (
        <div className="flex items-center">
            <p className="font-bold text-2xl text-black">₹{property.pricePerNight}</p>
            <p className="text-[#4B5563] font-semibold">/night</p>
        </div>
    )}

    {property.rentalType === 'long-term' && property.pricePerMonth !== null && (
        <div className="flex items-end">
            <p className="font-bold text-2xl text-black">₹{property.pricePerMonth}</p>
            <p className="text-[#4B5563] font-semibold">/month</p>
        </div>
      )}

      {property.rentalType=== 'both'  && property.pricePerMonth !== null &&  property.pricePerNight !== null &&(
       <div className="flex justify-between items-center">

         <div className="flex items-end">
         <p className="font-bold text-2xl text-black"> ${property.pricePerNight}</p>
           <p  className="text-[#4B5563] font-semibold">/night</p>
         </div>

         <div className="flex items-end">
         <p className="font-bold text-2xl text-black"> ₹{property.pricePerMonth}</p>
         <p  className="text-[#4B5563] font-semibold">/month</p>
         </div>

        </div>
      )}
    </div>

    <div className="flex justify-between items-center pt-4">
       <div>
       <p className="text-[#4B5563]">Rental Type</p>
       <p className="font-semibold text-xl">{property.rentalType}</p>
       </div>

       <div>
       <p className="text-[#4B5563]">Next Booking</p>
       <p className="font-semibold text-xl">Apr 1 , 2025</p>
       </div>
    </div>

 
    <div className="grid grid-cols-3 gap-4 pt-8 text-[#4B5563]  font-medium pb-4">
       <button className={`w-40 justify-center items-center border-1 border-gray-200 bg-white  transition-all duration-300 mr-4 h-10 rounded-xl cursor-pointer focus:bg-[#2564ebcc] focus:text-white`}
       onClick={() => onEdit(property.id)}
       >
        <div className="flex justify-center items-center"
        >
        <img src={EditIcon} alt="" className="w-5 h-5 pr-2"/>
        Edit
        </div>
        </button>
       
        <button className={`text-white w-40 justify-center items-center border-1 border-gray-200 bg-[#2564ebe0] transition-all duration-300 mr-4 h-10   rounded-xl cursor-pointer`}>
        <div className="flex justify-center items-center">
        <img src={CalenderIcon} alt="" className="w-8 h-6  pr-2"/>
        Availablity
        </div>
        </button>

        <button className={`w-40 justify-center items-center border-1 border-gray-200 transition-all duration-300 mr-4 h-10 rounded-xl cursor-pointer focus:bg-red-200 focus:text-red-500`}
        onClick={()=> onDelete(property.id)}
        >
        <div className="flex justify-center items-center">
        <img src={DeleteIcon} alt="" className="w-10 h-7 pr-2"/>
        Delete
        </div>
        </button>
        
    </div>

    </div>

    </div>
 )
}