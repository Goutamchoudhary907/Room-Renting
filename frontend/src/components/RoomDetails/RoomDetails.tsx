import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomFormData } from "../Property/ListRoom/types";
import axios from "axios";
import { BACKEND_URL } from "../../config";
import locationIcon from "../../assets/LocationRoomDetail.png";
import BedroomIcon from "../../assets/BedroomIcon.png";
import BathroomIcon from "../../assets/BathroomIcon.png";
import { amenityOptions } from "../Property/ListRoom/constants";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import DatePickerImg from "../../assets/DatePickerImg.png";
import DatePicker from "react-datepicker";
import {
  calculateNights,
  calculateShortTermTotal,
  calculateLongTermTotal,
  // ShortTermTotal,
} from "../../utils/pricing";
import PropertyLocationMap from "../Property/Map/PropertyMap";

interface Image {
  id: string;
  url: string;
}
export interface RoomDetailsData extends RoomFormData {
  images?: Image[];
}

export const RoomDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<RoomDetailsData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllImages, setShowAllImages] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [rentalType, setRentalType] = useState<"short-term" | "long-term">( "short-term" );
  
  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  // const [showBookingForm, setShowBookingForm] = useState(false);
  const [moveInDate, setMoveInDate] = useState<Date | null>(null);
  const [leaseDuration, setLeaseDuration] = useState<number>(1); //Default one month
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPropertyDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${BACKEND_URL}/property/${id}`);
        setProperty(response.data);
        setRentalType(
          response.data.rentalType === "long-term" ? "long-term" : "short-term"
        );
        setLoading(false);
      } catch (error: any) {
        setError(error.message || "Failed to fetch property details");
        setLoading(false);
      }
    };
    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);
  
  if (loading) return <div>Loading property details</div>;
  if (error) return <div>Error: {error}</div>;
  if (!property) {
    return <div>Property not found.</div>;
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
  

  const handleBooking = () => {
    if (rentalType === "short-term") {
      if (!checkinDate || !checkoutDate) {
        alert("Please select both check-in and check-out dates");
        return;
      }
      navigate(
        `/book/${id}?rentalType=short-term&checkinDate=${checkinDate.toISOString()}&checkoutDate=${checkoutDate.toISOString()}`
      );
    } else if (rentalType === "long-term") {
      if (!moveInDate) {
        alert("Please select a move-in date");
        return;
      }
      navigate(
        `/book/${id}?rentalType=long-term&moveInDate=${moveInDate.toISOString()}&leaseDuration=${leaseDuration}`
      );
    }
    // setShowBookingForm(true);
  };

  
  return (
    <div className="relative">
      <div className="w-full px-8">
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 md:row-span-2  h-[50vh]">
              <img
                src={property.images[0].url}
                alt={property.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            {displayedImages.slice(1, 4).map((image, index) => (
              <div key={image.id} className="aspect-[4/2] h-[22vh] w-full">
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
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg flex items-center justify-center
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

          <div className="flex flex-col md:flex-row gap-8 mt-10 px-18">
            <div className="w-full md:w-[70%]">
              <h1 className="text-3xl font-bold mb-6">{property.title}</h1>

              <div className="flex">
                <div className="">
                  <img className="w-8 h-7" src={locationIcon} alt="" />
                </div>
                <p className=" text-base font-sans font-semibold">
                  {property.address}
                </p>
              </div>

              <div className="flex gap-10 mt-10">
                <div className="flex gap-5">
                  <img src={BedroomIcon} alt="" className="w-6 h-6" />
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
                <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-200">
                  <PropertyLocationMap 
                    address={"Rau Bus stand Indore"} 
                  />
                </div>
                <div className="mt-4 flex items-center">
                  <img
                    src={locationIcon}
                    alt="Location"
                    className="w-5 h-5 mr-2"
                  />
                  <p className="text-gray-700">{property.address}</p>
                </div>
              </div>


            </div>

            <div className="w-full md:w-[25%] bg-gray-50 p-6 rounded-lg">
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
                      {/* First month payment (actual charge) */}
                      <div className="flex justify-between">
                        <span>First month payment:</span>
                        <span className="font-medium">
                          ₹{property.pricePerMonth}
                        </span>
                      </div>

                      {/* Estimated total (for reference only) */}
                      {leaseDuration > 1 && (
                        <div className="flex justify-between text-gray-600 text-sm">
                          <span>Estimated {leaseDuration}-month total:</span>
                          <span>
                            ₹{calculateLongTermTotal(property, leaseDuration)}
                          </span>
                        </div>
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
                      : property.pricePerMonth}
                  </span>
                </div>
              </div>
              <button
                className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg w-full"
                onClick={handleBooking}
              >
                {rentalType === "short-term" ? "Book Now" : "Request Lease"}
              </button>

              {/* Book Now Button */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
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