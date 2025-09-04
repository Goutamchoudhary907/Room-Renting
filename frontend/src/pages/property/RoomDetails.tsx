import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomFormData } from "../../components/Property/ListRoom/types";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import locationIcon from "../../assets/LocationRoomDetail.png";
import BedroomIcon from "../../assets/BedroomIcon.png";
import BathroomIcon from "../../assets/BathroomIcon.png";
import { amenityOptions } from "../../components/Property/ListRoom/constants";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import DatePickerImg from "../../assets/DatePickerImg.png";
import DatePicker from "react-datepicker";
import { useQuery } from '@tanstack/react-query';
import {
  calculateNights,
  calculateShortTermTotal,
  calculateLongTermTotal,
} from "../../utils/pricing";
import PropertyLocationMap from "../../components/Property/Map/PropertyMap";
import RoomDetailsSkeleton from "../skeletons/property/RoomDetailsSkeleton";
import { useAuth } from "../../context/AuthContext";
import { checkAvailability } from "../../utils/availablity";
import { useBookingStatus } from "../../hooks/useBookingStatus";

interface Image {
  id: string;
  url: string;
}
export interface RoomDetailsData extends RoomFormData {
  images?: Image[];
  id: string;
  hostId: string;
  landmark:string;
  city:string;
  locality?: string;
}

interface AvailabilityState {
  loading: boolean;
  available: boolean;
  conflict: {
    bookingId: string;
    dates: {
      from: string;
      to: string;
    };
  } | null;
}

export const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [showAllImages, setShowAllImages] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [rentalType, setRentalType] = useState<"short-term" | "long-term">( "short-term" );
   const navigate= useNavigate();

  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  const [moveInDate, setMoveInDate] = useState<Date | null>(null);
  const [leaseDuration, setLeaseDuration] = useState<number>(1); //Default one month
   const { user, token,isLoading: isAuthLoading } = useAuth();
   const [isProcessingPayment, setIsProcessingPayment] = useState(false);
 const { hasBooked } = useBookingStatus(id || "");
   const [availability, setAvailability] = useState<AvailabilityState>({ 
    loading: false, 
    available: true, 
    conflict: null 
  });
 const { 
  data: property, 
  isLoading: isPropertyLoading, 
  error: propertyError 
} = useQuery<RoomDetailsData>({
  queryKey: ['property', id],
  queryFn: async () => {
    const response = await axios.get(`${BACKEND_URL}/property/${id}`);
    return response.data;
  },
  enabled: !!id,
  staleTime: 5 * 60 * 1000
});

useEffect(() => {
  if (property && property.rentalType !== 'both') {
    setRentalType(property.rentalType as 'short-term' | 'long-term');
  }
}, [property]);

  
useEffect(() => {
  const script = document.createElement("script");
  script.src = "https://checkout.razorpay.com/v1/checkout.js";
  script.onerror = () => console.error("Razorpay SDK failed to load");
  document.body.appendChild(script);
}, []);
 
useEffect(() => {
  const checkDatesAvailability = async () => {
    if (!id) return;
    
    // Short-term availability check
    if (rentalType === 'short-term' && checkinDate && checkoutDate) {
      setAvailability(prev => ({ ...prev, loading: true }));
      
      try {
        const result = await checkAvailability(
          id,
          checkinDate,
          checkoutDate,
          'short-term'
        );
        
        setAvailability({
          loading: false,
          available: result.available,
          conflict: result.conflict || null
        });
      } catch (error) {
        setAvailability({
          loading: false,
          available: false,
          conflict: null
        });
        console.error('Availability check failed:', error);
      }
    }
    // Long-term availability check
    else if (rentalType === 'long-term' && moveInDate) {
      setAvailability(prev => ({ ...prev, loading: true }));
      
      try {
        const endDate = new Date(moveInDate);
        endDate.setMonth(endDate.getMonth() + leaseDuration);
        
        const result = await checkAvailability(
          id,
          moveInDate,
          endDate,
          'long-term'
        );
        
        setAvailability({
          loading: false,
          available: result.available,
          conflict: result.conflict || null
        });
      } catch (error) {
        setAvailability({
          loading: false,
          available: false,
          conflict: null
        });
        console.error('Availability check failed:', error);
      }
    }
  };

  checkDatesAvailability();
}, [checkinDate, checkoutDate, moveInDate, leaseDuration, rentalType, id]);
if (propertyError) return <div>Error: {propertyError.message}</div>;
  if (!property) {
    return <RoomDetailsSkeleton/>
  }
  if (!property.images) {
    return <div>Images not Available.</div>;
  }

  const displayedImages = showAllImages
    ? property.images
    : property.images.slice(0, 4);

  const viewAllButtonStyle = {
    backgroundImage:
      property.images.length > 4
        ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${property.images[4]?.url})`
        : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: property.images.length > 4 ? "white" : "inherit",
  };

  const handleCheckinChange = (date: Date | null) => {
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
  };
  
  if (isPropertyLoading || isAuthLoading) {
  return <RoomDetailsSkeleton/>
}

  return (
    <div className="relative">
     <div className="w-full px-4 md:px-8">
        <div className="mx-auto">
       <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
<div className="md:col-span-2 md:row-span-2 h-[40vh] md:h-[50vh]">
              <img
                src={property.images[0].url}
                alt={property.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {displayedImages.slice(1, 4).map((image, index) => (
              <div key={image.id} className="aspect-[4/3] h-[20vh] md:aspect-[4/2] md:h-[22vh] w-full">
                <img
                  src={image.url}
                  alt={`${property.title} - ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}

            {property.images.length > 4 && (
              <button
                onClick={() => setShowAllImages(!showAllImages)}
               className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-2 md:py-2 md:px-4 rounded-lg text-sm md:text-base
             aspect-[4/2] h-[22vh] w-full"
                style={viewAllButtonStyle}
              >
                {showAllImages
                  ? "Show Less"
                  : `View All (${property.images.length})`}
              </button>
            )}
          </div>

          {showAllImages && property.images.length > 4 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {property.images.slice(4).map((image) => (
                <div key={image.id} className="aspect-[4/2] h-[22vh]">
                  <img
                    src={image.url}
                    alt={property.title}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

      <div className="flex flex-col md:flex-row gap-4 md:gap-8 mt-6 md:mt-10 px-0 md:px-18">
            <div className="w-full md:w-[70%]">
              <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{property.title}
                 {hasBooked && (
    <span className="ml-2 bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded inline-flex items-center">
      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
      Booked
    </span>
  )}
              </h1>

           <div className="flex">
  <div className="">
<img className="w-6 h-5 md:w-8 md:h-7" src={locationIcon} alt="" />
  </div>
  <p className="text-base font-sans font-semibold">
    {hasBooked 
      ? property.formattedAddress 
      : property.landmark 
        ? `Near ${property.landmark}, ${property.city}`
        : `${property.locality || ''}, ${property.city}`}
  </p>
</div>

              <div className="flex gap-10 mt-10">
                <div className="flex gap-5">
                  <img src={BedroomIcon} alt="" className="w-5 h-5 md:w-6 md:h-6" />
                  {property.bedrooms} Bedrooms
                </div>

                <div className="flex gap-5">
                  <img src={BathroomIcon} alt="" className="w-6 h-6" />
                  {property.bathrooms} Bathrooms
                </div>
              </div>

              <div className="mt-10">
                <h1 className="text-2xl font-bold mb-6">About this property</h1>
                <div className="relative">
                  <div
                    className={`overflow-hidden ${
                      !isExpanded ? "max-h-24" : ""
                    }`}
                  >
                    <p className="whitespace-pre-line">
                      {property.description}
                    </p>
                  </div>
                  {property.description.length > 100 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-blue-600 hover:text-blue-800 font-medium mt-2 flex items-center"
                    >
                      {isExpanded ? (
                        <>
                          <span>Read Less</span>
                          <ChevronUpIcon className="ml-1 h-4 w-4" />
                        </>
                      ) : (
                        <>
                          <span>Read More</span>
                          <ChevronDownIcon className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {property.amenities && property.amenities.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-xl font-bold mb-4">
                    What this place offer
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {property.amenities.map((amenityValue) => {
                      const amenity = amenityOptions.find(
                        (opt) => opt.value === amenityValue
                      );
                      return amenity ? (
                        <div
                          key={amenity.value}
                          className="flex items-center gap-3 p-3  rounded-lg"
                        >
                          <img
                            src={amenity.imageSrc}
                            alt={amenity.label}
                            className="w-5 h-5 object-contain"
                          />
                          <span className="text-base">{amenity.label}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              
                
                 <div className="mt-8">
                   <h4 className="text-xl font-bold mb-4">Location</h4>
                  <PropertyLocationMap 
                   address={property.formattedAddress || ""}
                   exactLocation={hasBooked}
                   landmark={property.landmark}
                   city={property.city}
                   latitude={property.latitude ? Number(property.latitude) : undefined}
                   longitude={property.longitude ? Number(property.longitude) : undefined}
                 />
                   <div className="mt-4 flex items-center">
                     <img
                       src={locationIcon}
                       alt="Location"
                       className="w-5 h-5 mr-2"
                     />
                     <p className="text-gray-700">
                      {hasBooked 
                       ? property.formattedAddress 
                       : property.landmark 
                         ? `Near ${property.landmark}, ${property.city}`
                         : `${property.locality || ''}, ${property.city}`}
                      </p>
                   </div>
                 </div>


            </div>

           <div className="w-full md:w-[25%] bg-gray-50 p-4 md:p-6 rounded-lg mt-4 md:mt-0">
              {/* Price Display */}
              <div className="pb-4">
                {property.rentalType === "both" ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-end">
                      <p className="font-bold text-2xl text-black mr-2">
                        ₹{property.pricePerNight}
                      </p>
                      <p className="text-[#4B5563] font-semibold">/night</p>
                    </div>
                    <div className="flex items-end">
                      <p className="font-bold text-2xl text-black mr-2">
                        ₹{property.pricePerMonth}
                      </p>
                      <p className="text-[#4B5563] font-semibold">/month</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-end">
                    <p className="font-bold text-2xl text-black mr-2">
                      ₹
                      {property.rentalType === "short-term"
                        ? property.pricePerNight
                        : property.pricePerMonth}
                    </p>
                    <p className="text-[#4B5563] font-semibold">
                      {property.rentalType === "short-term"
                        ? "/night"
                        : "/month"}
                    </p>
                  </div>
                )}
              </div>

              {/* Rental Type Toggle (only show if property supports both) */}
              {property.rentalType === "both" && (
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setRentalType("short-term")}
                    className={`py-2 px-4 rounded-lg flex-1 ${
                      rentalType === "short-term"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Short Stay
                  </button>
                  <button
                    onClick={() => setRentalType("long-term")}
                    className={`py-2 px-4 rounded-lg flex-1 ${
                      rentalType === "long-term"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    Long Lease
                  </button>
                </div>
              )}

              {/* Date Selection Fields */}
              <div className="space-y-4 mb-6">
                {rentalType === "short-term" ? (
                  <>
                    <DateInputField
                      id="checkin"
                      label="Check-in"
                      selected={checkinDate}
                      minDate={new Date()}
                      onChange={handleCheckinChange}
                    />
                    <DateInputField
                      id="checkout"
                      label="Check-out"
                      selected={checkoutDate}
                      onChange={(date) => setCheckoutDate(date)}
                      minDate={
                        checkinDate
                          ? new Date(checkinDate.getTime() + 86400000)
                          : new Date()
                      }
                    />
                  </>
                ) : (
                  <>
                    <DateInputField
                      id="moveInDate"
                      label="Move-in Date"
                      selected={moveInDate}
                      minDate={new Date()}
                      onChange={setMoveInDate}
                    />

                    <div className="relative w-full h-12 border-2 border-gray-200 rounded-md bg-white">
                      <div className="h-full flex flex-col justify-center pl-10 pr-3">
                        <label className="text-xs text-gray-500 font-medium">
                          Preferred Lease Duration
                        </label>
                        <img
                          src={DatePickerImg}
                          alt="Calendar"
                          className="absolute top-1/2 left-3 transform -translate-y-1/2 h-5 w-5 pointer-events-none"
                        />
                        <select
                          value={leaseDuration}
                          onChange={(e) =>
                            setLeaseDuration(Number(e.target.value))
                          }
                          className="w-full text-sm font-medium focus:outline-none appearance-none bg-transparent"
                        >
                          <option value="1">1 Month</option>
                          <option value="2">2 Month</option>
                          <option value="3">3 Months</option>
                          <option value="4">4 Month</option>
                          <option value="5">5 Month</option>
                          <option value="6">6 Months</option>
                        </select>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      <p>
                        You can adjust the lease duration later with the
                        property owner
                      </p>
                    </div>
                  </>
                )}
              </div>
           {availability.conflict && (
             <div className="text-red-500 text-sm mt-2">
               Property not available from {new Date(availability.conflict.dates.from).toLocaleDateString()} 
               to {availability.conflict.dates.to === 'ongoing' ? 'ongoing' : new Date(availability.conflict.dates.to).toLocaleDateString()}
             </div>
           )}
              {/* Price Calculation and Total */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                {rentalType === "short-term" ? (
                  <>
                    <div className="flex justify-between mb-2">
                      <span>
                        ₹{property.pricePerNight} ×{" "}
                        {calculateNights(checkinDate, checkoutDate)} nights{" "}
                      </span>
                      <span>
                        ₹
                        {
                          calculateShortTermTotal(
                            property,
                            checkinDate,
                            checkoutDate
                          )?.subTotal
                        }
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm">
                      <span>Service charge (5%)</span>
                      <span>
                        ₹
                        {
                          calculateShortTermTotal(
                            property,
                            checkinDate,
                            checkoutDate
                          )?.serviceCharge
                        }
                      </span>
                    </div>
                  </>
                     ) : (
                       <>
                    <div className="space-y-2">
  {/* First month payment breakdown */}
  <div className="flex justify-between">
    <span>First month rent:</span>
    <span className="font-medium">
      ₹{property.pricePerMonth ?? 0}
    </span>
  </div>

  {/* Service charge (5%) */}
  <div className="flex justify-between text-gray-600 text-sm">
    <span>Service charge (5%):</span>
    <span>
      ₹{Math.ceil((property.pricePerMonth ?? 0) * 0.05)}
    </span>
  </div>



  {/* Estimated total for full lease duration */}
  {leaseDuration > 1 && (
    <>
      <div className="flex justify-between text-gray-600 text-sm">
        <span> Estimated total amount:</span>
        <span>
          ₹{calculateLongTermTotal(property, leaseDuration).subTotal}
        </span>
      </div>
    </>
  )}
</div>

                    {moveInDate && (
                      <div className="text-sm text-gray-600 mt-2">
                        Starting {moveInDate.toLocaleDateString()}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Total Price Display */}
              <div className="border-t border-gray-200 pt-4 mb-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>
                    {rentalType === "short-term" ? "Total" : "Due Now"}
                  </span>
                  <span>
                    ₹
                    {rentalType === "short-term"
                      ? calculateShortTermTotal(
                          property,
                          checkinDate,
                          checkoutDate
                        ).total
                      : calculateLongTermTotal(property, 1).total 
                      }
                  </span>
                </div>
              </div>
         
<button
  className={`mt-4 py-2 px-6 rounded-lg w-full ${
    !availability.available || availability.loading || isProcessingPayment
      ? 'bg-gray-400 cursor-not-allowed'
      : 'bg-blue-600 hover:bg-blue-700 text-white'
  }`}
  onClick={async () => {
    // if (!property || !user || isAuthLoading || !availability.available) return;
     if (!property) return;
       if (!user) {
    alert("You need to login to book this property.");
  navigate(`/auth/signin?redirect=/property/room-detail/${property.id}`);
    return;
  }

  if (isAuthLoading || !availability.available) return;
    setIsProcessingPayment(true);
    try {
      await checkoutHandler({
        property: {
          id: property.id,
          title: property.title,
          pricePerNight: property.pricePerNight,
          pricePerMonth: property.pricePerMonth,
          hostId: property.hostId
        },
        rentalType,
        checkinDate: checkinDate || undefined,
        checkoutDate: checkoutDate || undefined,
        moveInDate: moveInDate || undefined,
        leaseDuration,
        user: {
          id: user.id,
          token: token || '', 
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || ''
        },
        isAvailable: availability.available
      });
    } finally {
      setIsProcessingPayment(false);
    }
  }}
  disabled={isAuthLoading|| !availability.available || availability.loading || isProcessingPayment}
>
  {availability.loading ? (
    'Checking availability...'
  ) : isProcessingPayment ? (
    <span className="flex items-center justify-center">
      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Processing...
    </span>
  ) : !availability.available ? (
    'Not available for selected dates'
  ) : rentalType === 'short-term' ? (
    'Book Now'
  ) : (
    'Request Lease'
  )}
</button>
              {/* Book Now Button */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CheckoutHandlerParams {
  property: {
    id: string;
    title: string;
    pricePerNight?: number;
    pricePerMonth?: number;
    hostId:string;
  };
  rentalType: 'short-term' | 'long-term';
  checkinDate?: Date | null;
  checkoutDate?: Date| null;
  moveInDate?: Date| null;
  leaseDuration?: number;
  user: {
    id:string;
    token: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
  isAvailable: boolean;
}

const checkoutHandler = async ({
  property,
  rentalType,
  checkinDate,
  checkoutDate,
  moveInDate,
  leaseDuration,
  user,
  isAvailable
}: CheckoutHandlerParams) => {
  try{
      // First check local availability state
      if (!isAvailable) {
        alert('The property is no longer available for the selected dates');
        return;
      }
    
      
     // Add validation to prevent host from booking their own property
     if (property.hostId === user.id) {
      alert("You cannot book your own property");
      return;
    }

    // Validate required fields for both rental types
    if (rentalType === 'short-term') {
      if (!checkinDate || !checkoutDate) {
        alert('Please select both check-in and check-out dates');
        return;
      }
      if (!property.pricePerNight) {
        alert('Price per night is required');
        return;
      }
    } else {
      if (!moveInDate) {
        alert('Please select a move-in date');
        return;
      }
      if (!property.pricePerMonth) {
        alert('Price per month is required');
        return;
      }
    }
    const amount = rentalType === 'short-term'
    ? calculateShortTermTotal(
        { pricePerNight: property.pricePerNight! }, 
        checkinDate!, 
        checkoutDate!
      ).total
    : calculateLongTermTotal(
        { pricePerMonth: property.pricePerMonth! },1
      ).total;



    // Prepare booking data
    const bookingData={
      amount,
      propertyId:property.id,
      rentalType,
      ...(rentalType === 'short-term' &&{
        checkInDate: checkinDate?.toISOString(),
        checkOutDate: checkoutDate?.toISOString()
      }),
      ...(rentalType === 'long-term' &&{
        moveInDate: moveInDate?.toISOString(),
        leaseDuration
      })
    };

 // Get Razorpay key
 const { data: { key } } = await axios.get(`${BACKEND_URL}/payment/getkey`);
 
    // Create Razorpay order
  const {data:{order ,bookingId}} =await axios.post(`${BACKEND_URL}/payment/checkout`,
    bookingData,
    {
      headers:{
        "Authorization":`Bearer ${user.token}` ,
        'Content-Type': 'application/json'
      }
    }
  );
  // Configure Razorpay options
  const options = {
    key, 
    amount: order.amount,
    currency: 'INR',
    name: 'Rentpy',
    description: `Booking for ${property.title}`,
    order_id: order.id,
    handler:async(response:any) =>{
    try {
      const verificationResponse = await axios.post(
        `${BACKEND_URL}/payment/paymentVerification`, 
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          bookingId
        }
      );
      
      // Handle both redirect and JSON responses
       if (verificationResponse.data.success) {
      if (verificationResponse.data.redirectUrl) {
        window.location.href = verificationResponse.data.redirectUrl;
      } else {
        window.location.href = `/booking/${bookingId}/success?payment_id=${response.razorpay_payment_id}`;
      }
    } else {
      window.location.href = `/booking/${bookingId}/failed`;
    }
    } catch (error) {
      window.location.href = `/booking/${bookingId}/failed`;
    }
    },
    prefill: {
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      contact: user.phoneNumber || ''
    },
    theme: {
      color: '#528FF0'
    },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();

  rzp.on('payment.failed', (response: any) => {
    window.location.href = `/booking/${bookingId}/failed?error=${response.error.description}`;
});
}catch(error){
  console.error('Checkout error:', error);
  alert('Error during checkout. Please try again.');
}
};


interface DateInputField {
  id: string;
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  minDate?: Date;
}

export const DateInputField = ({
  id,
  label,
  selected,
  onChange,
  minDate,
}: DateInputField) => {
  return (
    <div className="relative w-full h-12 border-2 border-gray-200 rounded-md bg-white">
      <div className="h-full flex flex-col justify-center pl-10 pr-3">
        <label htmlFor={id} className="text-xs text-gray-500 font-medium">
          {label}
        </label>
        <img
          src={DatePickerImg}
          alt="Calendar"
          className="absolute top-1/2 left-3 transform -translate-y-1/2 h-5 w-5 pointer-events-none"
        />
        <DatePicker
          id={id}
          selected={selected}
          onChange={onChange}
          placeholderText="Add date"
          className="w-full text-sm font-medium focus:outline-none placeholder:text-black placeholder:text-base"
          dateFormat="dd-MM-yyyy"
          minDate={minDate}
        />
      </div>
    </div>
  );
};