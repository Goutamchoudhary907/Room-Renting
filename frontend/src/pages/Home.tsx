import { useEffect, useState } from "react"
import { HowItWorks } from "../components/Home/HowItWorks"
import { ListingAndSearchCard } from "../components/Home/ListingAndSearchCard"
import { PopularDestinations } from "../components/Home/PopularDestinations"
import { Recommendation } from "../components/Home/Recommendation"
import { SearchBar } from "../components/Home/SearchBar"
import { WhyUs } from "../components/Home/WhyUs"
import { HomeSkeleton } from "./skeletons/HomeSkeleton";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useLoading } from "../context/LoadingContext"; 
import { useAuth } from "../context/AuthContext"
// import { useAuth } from "../../context/AuthContext"
// import { UpcomingStays } from "./components/UpcomingStays"

interface Property{
   id:string;
   propertyType:string;
   rentalType:string;
   title:string;
   pricePerNight?:number;
   pricePerMonth?:number;
   property:string;
   images?: { url: string }[];
}
export const Home= () =>{
   // const { user } = useAuth();
   // const isLoggedIn = !!user;
    const [error,setError]=useState(null);
    const [recommendedProperties, setRecommendedProperties] = useState<Property[]>([]);
    const { isLoading, setLoading  } = useLoading();
     const { isLoading: isAuthLoading } = useAuth();
   
    useEffect(() =>{
      const fetchProperties=async () =>{
       try {
          setLoading(true);
           console.log("Starting API call...");
           const response=await axios.get(`${BACKEND_URL}/property/all`);
           console.log("API call successful", response.data);
           const allProperties = response.data;
           const randomProperties = [];
           const available = [...allProperties];
           
           // Select 4 unique random properties
           for (let i = 0; i < 4 && available.length > 0; i++) {
             const randomIndex = Math.floor(Math.random() * available.length);
             randomProperties.push(available[randomIndex]);
             available.splice(randomIndex, 1);
           }
          
           setRecommendedProperties(randomProperties);
       } catch (error:any) {
           setError(error.message);
       }finally {
         console.log("Setting loading to false");
         setLoading(false);
       }
      }
      fetchProperties();
   },[])
   
   return(
    <div className="bg-[#F9FAFB]">
    {/* {isLoggedIn && <UpcomingStays/>} */}
    {isLoading || isAuthLoading ? (
        <HomeSkeleton />
      ) : (
        <>
          <SearchBar />
          <Recommendation recommendedProperties={recommendedProperties} />
          <WhyUs />
          <PopularDestinations />
          <HowItWorks />
          <ListingAndSearchCard />
        </>
      )}
    </div>
   )
}