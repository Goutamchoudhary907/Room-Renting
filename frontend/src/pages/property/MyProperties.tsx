import ProperyIcon from "../../assets/PropertyIcon.png";
import ActiveListingIcon from "../../assets/ActiveListingIcon.png"
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../config";
import axios from 'axios';
import EditIcon from "../../assets/EditIcon.png"
import CalenderIcon from "../../assets/CalendarIcon2.png"
import DeleteIcon from "../../assets/DeleteIcon2.png"
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../context/LoadingContext";
import MyPropertiesSkeleton from "../skeletons/property/MyPropertiesSkeleton";
import { useAuth } from "../../context/AuthContext";
export const MyProperties =() =>{

    const navigate=useNavigate();
    const [properties, setProperties] = useState<Property[]>([]);
    const [searchQuery, setSearchQuery]=useState("");
    const [filteredStatus, setFilteredStatus]=useState<string | null>(null);
    const [activeButton, setActiveButton]=useState<string | null>(null);
     const { isLoading,setLoading } = useLoading();
     const { isLoading: isAuthLoading } = useAuth();
   useEffect(() =>{
    const fetchProperties= async()=>{
      setLoading(true);
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
        }finally{
          setLoading(false);
        }
    }
    fetchProperties();
   },[]);

   // Calculate active listings
   const activeListingsCount=properties.filter(
    (property) => property.bookingStatus === "AVAILABLE"
   ).length;

     // Filter properties based on search query
     const normalizedSearchQuery=searchQuery.toLowerCase().replace(/\s/g, '');

     const filteredProperties=properties.filter((property) =>
    property.title.toLowerCase().replace(/\s/g,'') .includes(normalizedSearchQuery)
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

     if(isLoading || isAuthLoading ){
      return <MyPropertiesSkeleton/>
     }
    return(
        <div className="min-h-screen w-screen bg-[#F9FAFB]">

        {/* Header */}
        <div className="flex justify-between items-center pt-8 pl-8 pr-8
                        max-[639px]:flex-col max-[639px]:items-start max-[639px]:gap-4">
          <h1 className="text-[#111827] font-bold text-2xl">My Properties</h1>
          <button
            className="bg-[#2563EB] text-white text-[16px] p-2 w-52 cursor-pointer transition-all duration-500
                       max-[639px]:w-full"
            onClick={() => {
              navigate("/property/create");
            }}
          >
            + Add New Property
          </button>
        </div>
      
        {/* Stats */}
        <div className="flex justify-between items-center w-screen pt-2
                        max-[639px]:flex-col max-[639px]:items-stretch max-[639px]:gap-4">
      
          <div className="w-1/2 h-24 m-4 p-3 bg-white rounded shadow ml-15 flex items-center
                          max-[639px]:w-full max-[639px]:ml-0">
            <div className="rounded-full overflow-hidden w-10 h-10 bg-[#DBEAFE] flex items-center justify-center">
              <img className="object-contain" src={ProperyIcon} alt="home" />
            </div>
            <div className="flex flex-col justify-center ml-4">
              <p className="font-bold text-xl">{properties.length}</p>
              <p className="text-[#4B5563] font-medium text-[18px] ">Total Properties</p>
            </div>
          </div>
      
          <div className="w-1/2 h-24 m-4 p-3 bg-white rounded shadow ml-18 flex items-center
                          max-[639px]:w-full max-[639px]:ml-0">
            <div className="rounded-full overflow-hidden w-10 h-10 bg-[#22c55e0a] flex items-center justify-center">
              <img className="object-contain" src={ActiveListingIcon} alt="home" />
            </div>
            <div className="flex flex-col justify-center ml-4">
              <p className="font-bold text-xl">{activeListingsCount}</p>
              <p className="text-[#4B5563] font-medium text-[18px] ">Active Listings</p>
            </div>
          </div>
        </div>
      
        {/* Search & Buttons */}
        <div className="flex justify-between items-center pl-8 pt-4 pb-5
                        max-[639px]:flex-col max-[639px]:items-stretch max-[639px]:gap-4">
      
          <div>
            <input
              type="text"
              placeholder="Search properties..."
              className="w-80 h-10 bg-white border-2 border-gray-200 text-[#4B5563] font-semibold pl-5 focus:outline-1
                         max-[639px]:w-full"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                console.log("Search Query:", e.target.value);
              }}
            />
          </div>
      
          <div className="text-[#4B5563] font-medium flex gap-2
                          max-[639px]:flex-col max-[639px]:w-full">
      
            <Button
              className={`w-50 ${
                activeButton === "all" ? "bg-[#2563EB] text-white" : "bg-white text-[#4B5563]"
              } max-[639px]:w-full`}
              onClick={() => {
                setFilteredStatus(null);
                setActiveButton("all");
              }}
            >
              All Properties
            </Button>
      
            <Button
              className={`w-50 ${
                activeButton === "AVAILABLE" ? "bg-[#2563EB] text-white" : "bg-white text-[#4B5563]"
              } max-[639px]:w-full`}
              onClick={() => {
                setFilteredStatus("AVAILABLE");
                setActiveButton("AVAILABLE");
              }}
            >
              Available
            </Button>
      
            <Button
              className={`w-50 ${
                activeButton === "BOOKED" ? "bg-[#2563EB] text-white" : "bg-white text-[#4B5563]"
              } max-[639px]:w-full`}
              onClick={() => {
                setFilteredStatus("BOOKED");
                setActiveButton("BOOKED");
              }}
            >
              Booked
            </Button>
          </div>
        </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-17 px-8">
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
    const navigate = useNavigate();
 return(
    <div
    className="cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
    onClick={() => navigate(`/property/room-detail/${property.id}`)}
  >
    <div className="rounded-2xl p-4 sm:p-5 shadow-lg bg-white border border-gray-100">
      
      {/* Image */}
      <div className="pb-4">
        <img
          src={property.images[0].url}
          alt={property.title}
          className="w-full h-48 sm:h-52 object-cover rounded-xl"
        />
      </div>
  
      {/* Title & Status */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-4">
        <h3 className="font-semibold text-lg sm:text-xl text-gray-800">{property.title}</h3>
        <div className="rounded-full px-3 py-1 text-xs sm:text-sm font-medium bg-green-100 text-green-700 capitalize w-fit">
          {property.bookingStatus?.charAt(0).toUpperCase() + property.bookingStatus.slice(1).toLowerCase()}
        </div>
      </div>
  
      {/* Price Section */}
      <div className="pb-4">
  {property.rentalType === 'short-term' && property.pricePerNight !== null && (
    <div className="flex items-center">
      <p className="font-bold text-2xl text-black">₹{property.pricePerNight}</p>
      <p className="text-[#4B5563] font-semibold">&nbsp;/night</p>
    </div>
  )}

  {property.rentalType === 'long-term' && property.pricePerMonth !== null && (
    <div className="flex items-center">
      <p className="font-bold text-2xl text-black">₹{property.pricePerMonth}</p>
      <p className="text-[#4B5563] font-semibold">&nbsp;/month</p>
    </div>
  )}

  {property.rentalType === 'both' && property.pricePerMonth !== null && property.pricePerNight !== null && (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <p className="font-bold text-2xl text-black">₹{property.pricePerNight}</p>
        <p className="text-[#4B5563] font-semibold">&nbsp;/night</p>
      </div>
      <div className="flex items-center">
        <p className="font-bold text-2xl text-black">₹{property.pricePerMonth}</p>
        <p className="text-[#4B5563] font-semibold">&nbsp;/month</p>
      </div>
    </div>
  )}
</div>

  
      {/* Rental Info */}
      <div className="flex flex- sm:flex-row justify-between text-sm text-gray-600 gap-4 pb-6">
        <div>
          <p>Rental Type</p>
          <p className="font-semibold text-base sm:text-lg text-gray-800">{property.rentalType}</p>
        </div>
        <div>
          <p>Next Booking</p>
          <p className="font-semibold text-base sm:text-lg text-gray-800">Apr 1, 2025</p>
        </div>
      </div>
  
      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-sm font-medium">
        <button
          className="flex items-center justify-center gap-2 h-10 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 transition"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(property.id);
          }}
        >
          <img src={EditIcon} alt="Edit" className="w-4 h-4" />
          Edit
        </button>
  
        <button className="flex items-center justify-center gap-2 h-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
          <img src={CalenderIcon} alt="Calendar" className="w-5 h-5" />
          Availability
        </button>
  
        <button
          className="flex items-center justify-center gap-2 h-10 rounded-xl border border-gray-300 hover:bg-red-100 text-red-600 transition"
          onClick={() => onDelete(property.id)}
        >
          <img src={DeleteIcon} alt="Delete" className="w-6 h-6" />
          Delete
        </button>
      </div>
  
    </div>
  </div>
  

 )
}