import { HowItWorks } from "./components/HowItWorks"
import { ListingAndSearchCard } from "./components/ListingAndSearchCard"
import { PopularDestinations } from "./components/PopularDestinations"
import { Recommendation } from "./components/Recommendation"
import { SearchBar } from "./components/SearchBar"
import { WhyUs } from "./components/WhyUs"

// import { useAuth } from "../../context/AuthContext"
// import { UpcomingStays } from "./components/UpcomingStays"
export const Home= () =>{
   // const { user } = useAuth();
   // const isLoggedIn = !!user;

   return(
    <div className="bg-[#F9FAFB]">
    <SearchBar />
    {/* {isLoggedIn && <UpcomingStays/>} */}
    <Recommendation />
    <WhyUs/>
    <PopularDestinations/>
    <HowItWorks/>
    <ListingAndSearchCard/>
    </div>
   )
}