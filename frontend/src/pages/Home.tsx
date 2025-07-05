import { HowItWorks } from "../components/Home/HowItWorks"
import { ListingAndSearchCard } from "../components/Home/ListingAndSearchCard"
import { PopularDestinations } from "../components/Home/PopularDestinations"
import { Recommendation } from "../components/Home/Recommendation"
import { SearchBar } from "../components/Home/SearchBar"
import { WhyUs } from "../components/Home/WhyUs"
import { HomeSkeleton } from "./skeletons/HomeSkeleton";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { useAuth } from "../context/AuthContext"
// import { useAuth } from "../../context/AuthContext"
import { UpcomingStays } from "../components/Home/UpcomingStays"
import { useQuery } from '@tanstack/react-query';
interface Property{
   hostId: string
   id:string;
   propertyType:string;
   rentalType:string;
   title:string;
   pricePerNight?:number;
   pricePerMonth?:number;
   property:string;
   images?: { url: string }[];
}
interface Booking {
  bookingId: string; // use bookingId instead of id
  property: Property;
  checkinDate?: string;
  checkoutDate?: string;
  moveInDate?: string;
  leaseDuration?: number;
  paymentStatus: 'PENDING' | 'SUCCESSFUL' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
}

export const Home= () =>{
      const { isLoading: isAuthLoading, user,token } = useAuth();
   
      const { data: recommendedProperties, isLoading: isPropertiesLoading, error: propertiesError } = useQuery({
    queryKey: ['recommendedProperties', user?.id],
    queryFn: async () => {
      const response = await axios.get(`${BACKEND_URL}/property/all`);
      let allProperties = response.data;
      if (user?.id) {
        allProperties = allProperties.filter(
          (property: Property) => property.hostId !== user.id
        );
      }
      return [...allProperties].sort(() => 0.5 - Math.random()).slice(0, 4);
    },
    enabled: !isAuthLoading, 
  });

 const { 
    data: upcomingBookings, 
    isLoading: isBookingsLoading, 
    error: bookingsError 
  } = useQuery({
    queryKey: ['upcomingBookings', user?.id, token],
    queryFn: async () => {
      const bookingsResponse = await axios.get(`${BACKEND_URL}/booking/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      return bookingsResponse.data.bookings
        .filter((booking: Booking) => {
          const bookingDate = booking.checkinDate || booking.moveInDate;
          if (!bookingDate) return false;
          const date = new Date(bookingDate);
          date.setHours(0, 0, 0, 0);
          return booking.paymentStatus === 'SUCCESSFUL' && date >= now;
        })
        .map((booking: Booking) => ({
          id: booking.bookingId,
          status: 'BOOKED',
          property: {
            id: booking.property.id,
            title: booking.property.title,
            images: booking.property.images || [],
          },
          checkinDate: booking.checkinDate,
          checkoutDate: booking.checkoutDate,
          moveInDate: booking.moveInDate,
          leaseDuration: booking.leaseDuration,
        }));
    },
    enabled: !!user?.id && !!token, // Only fetch if user is logged in
  });

  const isLoading = isAuthLoading || isPropertiesLoading || isBookingsLoading;
  const error = propertiesError || bookingsError;


   return(
    <div className="bg-[#F9FAFB]">
   {isLoading ? (
        <HomeSkeleton />
      ) : (
        <>
          <SearchBar />
          {user?.id && upcomingBookings.length > 0 && <UpcomingStays bookings={upcomingBookings} />}
        <Recommendation recommendedProperties={recommendedProperties || []} />
          <WhyUs />
          <PopularDestinations />
          <HowItWorks />
          <ListingAndSearchCard />
        </>
      )}
      {error && (
        <div className="text-red-500 text-center mt-4">
          Error: {error.message}
        </div>
      )}
    </div>
   )
}