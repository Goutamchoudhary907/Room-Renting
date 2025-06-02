import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { RoomDetailsData } from "../../pages/property/RoomDetails";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import { BookingForm } from "./BookingForm";
import { calculateShortTermTotal,calculateLongTermTotal } from "../../utils/pricing";

export const Booking =() =>{
    const {id}=useParams<{id:string}>();
    const [searchParams]=useSearchParams();
    const navigate=useNavigate();
    const [property,setProperty]=useState<RoomDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const rentalType=searchParams.get('rentalType') as 'short-term' |'long-term' ;
    const checkinDateParam = searchParams.get('checkinDate');
    const checkoutDateParam = searchParams.get('checkoutDate');
    const moveInDateParam = searchParams.get('moveInDate');
    const leaseDurationParam = searchParams.get('leaseDuration');
    
    const [checkinDate, setCheckinDate] = useState<Date | null>(null);
    const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
    const [moveInDate, setMoveInDate] = useState<Date | null>(null);
    const [leaseDuration, setLeaseDuration] = useState<number>(1);

    
    useEffect(() =>{
        const fetchPropertyDetails=async () =>{
            setLoading(true);
            setError(null);
            try {
                const response=await axios.get(`${BACKEND_URL}/property/${id}`);
                setProperty(response.data);
                setLoading(false);
            } catch (error:any) {
                setError(error.message || "Failed to fetch poperty details");
                setLoading(false);
            }
        };

        if(id){
            fetchPropertyDetails();
        }

        if (checkinDateParam) {
          setCheckinDate(new Date(checkinDateParam));
        }
        if (checkoutDateParam) {
          setCheckoutDate(new Date(checkoutDateParam));
        }
        if (moveInDateParam) {
          setMoveInDate(new Date(moveInDateParam));
        }
        if (leaseDurationParam) {
          setLeaseDuration(parseInt(leaseDurationParam, 10));
        }
    },[id, checkinDateParam, checkoutDateParam, moveInDateParam, leaseDurationParam]);

    const handleCheckinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const date = event.target.value ? new Date(event.target.value) : null;
      setCheckinDate(date);
        if (date) {
          const nextDay = new Date(date);
          nextDay.setDate(nextDay.getDate() + 1);
          if (!checkoutDate || checkoutDate <= date) {
            setCheckoutDate(nextDay);
          }
        } else {
          setCheckoutDate(null);
        }
      }

  const handleCheckoutChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value ? new Date(event.target.value) : null;
    setCheckoutDate(date);
  };

  const handleMoveInDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value ? new Date(event.target.value) : null;
    setMoveInDate(date);
};
  if(loading){
    return <div>Loading...</div>
  }
  if (error) return <div>Error: {error}</div>;
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Confirm Your Booking</h2>
            {rentalType === 'short-term' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                <input type="date" className="w-full p-2 border border-gray-300 rounded" value={checkinDate?.toISOString().split('T')[0] || ''}
                 onChange={handleCheckinChange} />

                <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Check-out Date</label>
                <input type="date" className="w-full p-2 border border-gray-300 rounded" value={checkoutDate?.toISOString().split('T')[0] || ''} 
                onChange={handleCheckoutChange} />
              </div>
            )}
            {rentalType === 'long-term' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Move-in Date</label>
                <input type="date" className="w-full p-2 border border-gray-300 rounded" 
                value={moveInDate?.toISOString().split('T')[0] || ''}
               onChange={handleMoveInDateChange}
                />
                <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Lease Duration</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded" value={`${leaseDuration} month${leaseDuration > 1 ? 's' : ''}`} 
                 onChange={(event) => {
                  const value = parseInt(event.target.value, 10);
                  if (!isNaN(value) && value > 0) {
                    setLeaseDuration(value);
                  } else {
                    setLeaseDuration(1);
                  }
                }}
                />
              </div>
            )}
            {id && (
            <BookingForm
              propertyId={id}
              rentalType={rentalType}
              pricePerNight={property?.pricePerNight}
              pricePerMonth={property?.pricePerMonth}
              checkinDate={checkinDate}
              checkoutDate={checkoutDate}
              moveInDate={moveInDate}
              leaseDuration={leaseDuration}
              calculateShortTermTotal={() => calculateShortTermTotal(property, checkinDate, checkoutDate)} 
              calculateLongTermTotal={() => calculateLongTermTotal(property, leaseDuration)} 
              onBookingSuccess={() => {
                navigate('/bookings/success');
              }}
              onClose={() => navigate(`/property/${id}`)}
            />
        )}
            <button onClick={() => navigate(`/property/room-detail/${id}`)} className="mt-4 text-gray-600 hover:text-gray-800">
              Go Back to Property Details
            </button>
          </div>
        </div>
      );
    };