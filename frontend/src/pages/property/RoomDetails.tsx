import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RoomFormData } from "../../components/Property/ListRoom/types";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { amenityOptions } from "../../components/Property/ListRoom/constants";
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
import {
  BathIcon,
  BedIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  MapPinIcon,
  UsersIcon,
} from "../../components/Home/icons";

interface Image {
  id: string;
  url: string;
}
interface Host {
  id: string;
  firstName: string;
  createdAt: string;
}
export interface RoomDetailsData extends RoomFormData {
  images?: Image[];
  id: string;
  hostId: string;
  landmark:string;
  city:string;
  locality?: string;
  maxGuests?: number;
  bookingStatus?: string;
  host?: Host;
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

if (propertyError)
  return (
    <div className="min-h-screen bg-cream px-6 py-20 text-center">
      <p className="font-sans text-sm text-red-500">Error: {propertyError.message}</p>
    </div>
  );
  if (!property) {
    return <RoomDetailsSkeleton/>
  }
  if (!property.images) {
    return (
      <div className="min-h-screen bg-cream px-6 py-20 text-center">
        <p className="font-sans text-sm text-taupe">Images not Available.</p>
      </div>
    );
  }

  const displayedImages = showAllImages
    ? property.images
    : property.images.slice(0, 3);

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

  const locationText = hasBooked
    ? property.formattedAddress
    : property.landmark
      ? `Near ${property.landmark}, ${property.city}`
      : `${property.locality || ''}, ${property.city}`;

  const rentalLabel =
    property.rentalType === "short-term"
      ? "Short-term"
      : property.rentalType === "long-term"
        ? "Long-term"
        : "Short & Long-term";

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const keyDetails = [
    { icon: <BedIcon />, value: property.bedrooms, label: property.bedrooms === 1 ? "Bedroom" : "Bedrooms" },
    { icon: <BathIcon />, value: property.bathrooms, label: property.bathrooms === 1 ? "Bathroom" : "Bathrooms" },
    ...(property.maxGuests != null
      ? [{ icon: <UsersIcon />, value: property.maxGuests, label: property.maxGuests === 1 ? "Guest" : "Guests" }]
      : []),
  ];

  const shortTermTotals = calculateShortTermTotal(property, checkinDate, checkoutDate);

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-6 pt-5">
        <div className="flex items-center gap-2 font-sans text-[13px] text-taupe-light">
          <Link to="/" className="text-taupe-light no-underline hover:text-amber">
            Home
          </Link>
          <span>›</span>
          <Link to="/property/all-rooms" className="text-taupe-light no-underline hover:text-amber">
            All Rooms
          </Link>
          <span>›</span>
          <span className="overflow-hidden text-ellipsis whitespace-nowrap font-medium text-ink">
            {property.title}
          </span>
        </div>
      </div>

      {/* Image gallery */}
      <div className="mx-auto max-w-6xl px-6 py-4">
        {/* Explicit row heights: with auto rows, `h-full` on the image is
            indeterminate and the <img> falls back to its natural size, which
            blows the gallery up to full-viewport height on large uploads. */}
        <div className="grid grid-cols-1 gap-2.5 overflow-hidden rounded-3xl md:grid-cols-[2fr_1fr] md:grid-rows-[195px_195px]">
          {/* Main image */}
          <div className="relative h-[240px] overflow-hidden bg-cream-border-soft sm:h-[300px] md:row-span-2 md:h-full">
            <img
              src={property.images[0].url}
              alt={property.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/15 to-transparent to-40%" />
            {/* Mobile-only view-all: the sub images are hidden below md, so without
                this there'd be no way to reach the rest of the photos on a phone. */}
            {property.images.length > 1 && (
              <button
                onClick={() => setShowAllImages(!showAllImages)}
                className="absolute bottom-3 right-3 cursor-pointer rounded-[10px] border-none bg-ink/75 px-4 py-2 font-sans text-xs font-semibold text-white backdrop-blur md:hidden"
              >
                {showAllImages ? "Show less" : `View all photos (${property.images.length})`}
              </button>
            )}
          </div>

          {/* Sub images (hidden on mobile, matching the design) */}
          {property.images.slice(1, 3).map((image, index) => (
            <div key={image.id} className="relative hidden overflow-hidden bg-cream-border-soft md:block md:h-full">
              <img
                src={image.url}
                alt={`${property.title} - ${index + 1}`}
                className="h-full w-full object-cover"
              />
              {/* View-all button sits on the last visible sub image */}
              {index === 1 && property.images && property.images.length > 3 && (
                <button
                  onClick={() => setShowAllImages(!showAllImages)}
                  className="absolute bottom-3 right-3 cursor-pointer rounded-[10px] border-none bg-ink/75 px-4 py-2 font-sans text-xs font-semibold text-white backdrop-blur transition-colors hover:bg-ink/90"
                >
                  {showAllImages ? "Show less" : `View all photos (${property.images.length})`}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Remaining images. Images 1-2 already appear in the desktop gallery, so
            they're only surfaced here on mobile where that gallery is hidden. */}
        {showAllImages && property.images.length > 1 && (
          <div className="mt-2.5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
            {displayedImages.slice(1).map((image, index) => (
              <div
                key={image.id}
                className={`h-[160px] overflow-hidden rounded-2xl bg-cream-border-soft ${
                  index < 2 ? "md:hidden" : ""
                }`}
              >
                <img src={image.url} alt={property.title} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content layout */}
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-6">
        <div className="flex flex-col items-start gap-10 lg:flex-row">
          {/* Left content */}
          <div className="min-w-0 flex-1">
            {/* Title + meta */}
            <div className="mb-8">
              <div className="mb-3 flex flex-wrap gap-2">
                {property.propertyType && (
                  <span className="rounded-full bg-amber/10 px-3.5 py-1.5 font-sans text-xs font-semibold text-amber">
                    {capitalize(property.propertyType)}
                  </span>
                )}
                {property.bookingStatus === "AVAILABLE" && (
                  <span className="rounded-full bg-verified/10 px-3.5 py-1.5 font-sans text-xs font-semibold text-verified">
                    Available
                  </span>
                )}
                <span className="rounded-full border border-cream-border bg-cream px-3.5 py-1.5 font-sans text-xs font-semibold text-taupe">
                  {rentalLabel}
                </span>
                {hasBooked && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-verified/10 px-3.5 py-1.5 font-sans text-xs font-semibold text-verified">
                    <CheckIcon size={12} strokeWidth={3} />
                    Booked
                  </span>
                )}
              </div>
              <h1 className="mb-2.5 font-serif text-[clamp(28px,4vw,40px)] font-semibold leading-[1.1] tracking-tight text-ink">
                {property.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 font-sans text-sm text-taupe">
                <span className="flex items-center gap-1.5">
                  <MapPinIcon size={14} className="text-taupe-light" />
                  {locationText}
                </span>
              </div>
            </div>

            {/* Host info */}
            {property.host && (
              <div className="mb-8 flex items-center gap-3.5 rounded-2xl border border-cream-border bg-white p-5">
                <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber to-[#d4944f] font-sans text-lg font-bold text-white">
                  {property.host.firstName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-sans text-[15px] font-semibold text-ink">
                    Hosted by {property.host.firstName}
                  </div>
                  <div className="flex items-center gap-2 font-sans text-[13px] text-taupe-light">
                    <span className="flex items-center gap-1">
                      <CheckIcon size={12} strokeWidth={2.5} className="text-verified" />
                      Verified host
                    </span>
                    {property.host.createdAt && (
                      <>· Joined {new Date(property.host.createdAt).getFullYear()}</>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-3.5 font-serif text-[26px] font-semibold text-ink">About this place</h2>
              <div className="relative">
                <div className={`overflow-hidden ${!isExpanded ? "max-h-24" : ""}`}>
                  <p className="m-0 whitespace-pre-line font-sans text-[15px] leading-[1.75] text-taupe">
                    {property.description}
                  </p>
                </div>
                {property.description.length > 100 && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="mt-2 flex cursor-pointer items-center gap-1 border-none bg-transparent p-0 font-sans text-sm font-semibold text-amber hover:text-amber-dark"
                  >
                    {isExpanded ? (
                      <>
                        <span>Read less</span>
                        <ChevronUpIcon size={14} />
                      </>
                    ) : (
                      <>
                        <span>Read more</span>
                        <ChevronDownIcon size={14} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Key details */}
            <div className="mb-8 grid grid-cols-3 gap-3">
              {keyDetails.map((kd) => (
                <div
                  key={kd.label}
                  className="rounded-[14px] border border-cream-border bg-white p-4 text-center"
                >
                  <div className="mb-2 flex justify-center text-amber">{kd.icon}</div>
                  <div className="mb-0.5 font-serif text-[22px] font-semibold text-ink">{kd.value}</div>
                  <div className="font-sans text-[11px] font-semibold text-taupe-light">{kd.label}</div>
                </div>
              ))}
            </div>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-4.5 font-serif text-[26px] font-semibold text-ink">Amenities</h2>
                <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
                  {property.amenities.map((amenityValue) => {
                    const amenity = amenityOptions.find((opt) => opt.value === amenityValue);
                    return amenity ? (
                      <div
                        key={amenity.value}
                        className="flex items-center gap-2.5 rounded-xl border border-cream-border bg-white p-3.5 transition-all hover:border-amber/30 hover:bg-amber/3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-amber/10">
                          <img src={amenity.imageSrc} alt="" className="h-4.5 w-4.5 object-contain" />
                        </div>
                        <span className="font-sans text-[13px] font-medium text-ink-soft">{amenity.label}</span>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Location */}
            <div>
              <h2 className="mb-4.5 font-serif text-[26px] font-semibold text-ink">Location</h2>
              <PropertyLocationMap
                address={property.formattedAddress || ""}
                exactLocation={hasBooked}
                landmark={property.landmark}
                city={property.city}
                latitude={property.latitude ? Number(property.latitude) : undefined}
                longitude={property.longitude ? Number(property.longitude) : undefined}
              />
              <div className="mt-4 flex items-center gap-2">
                <MapPinIcon size={16} className="text-amber" />
                <p className="m-0 font-sans text-sm text-taupe">{locationText}</p>
              </div>
            </div>
          </div>

          {/* Booking card */}
          <div className="w-full lg:sticky lg:top-[88px] lg:w-[360px] lg:shrink-0">
            <div className="rounded-3xl border border-cream-border bg-white p-7 shadow-[0_8px_32px_rgba(28,25,23,0.08)]">
              {/* Price */}
              <div className="mb-6">
                {property.rentalType === "both" ? (
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif text-[32px] font-semibold text-ink">₹{property.pricePerNight}</span>
                      <span className="font-sans text-sm text-taupe-light">/night</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-serif text-[26px] font-semibold text-ink">₹{property.pricePerMonth}</span>
                      <span className="font-sans text-sm text-taupe-light">/month</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-4xl font-semibold text-ink">
                      ₹{property.rentalType === "short-term" ? property.pricePerNight : property.pricePerMonth}
                    </span>
                    <span className="font-sans text-sm text-taupe-light">
                      {property.rentalType === "short-term" ? "/night" : "/month"}
                    </span>
                  </div>
                )}
              </div>

              {/* Rental Type Toggle (only show if property supports both) */}
              {property.rentalType === "both" && (
                <div className="mb-5 flex gap-2 rounded-full border border-cream-border bg-cream p-1">
                  <button
                    onClick={() => setRentalType("short-term")}
                    className={`flex-1 cursor-pointer rounded-full border-none px-4 py-2.5 font-sans text-[13px] font-semibold transition-all ${
                      rentalType === "short-term" ? "bg-ink text-gold" : "bg-transparent text-taupe"
                    }`}
                  >
                    Short Stay
                  </button>
                  <button
                    onClick={() => setRentalType("long-term")}
                    className={`flex-1 cursor-pointer rounded-full border-none px-4 py-2.5 font-sans text-[13px] font-semibold transition-all ${
                      rentalType === "long-term" ? "bg-ink text-gold" : "bg-transparent text-taupe"
                    }`}
                  >
                    Long Lease
                  </button>
                </div>
              )}

              {/* Date Selection Fields */}
              <div className="mb-5">
                {rentalType === "short-term" ? (
                  <div className="grid grid-cols-2 gap-2.5">
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
                        checkinDate ? new Date(checkinDate.getTime() + 86400000) : new Date()
                      }
                    />
                  </div>
                ) : (
                  <div className="space-y-3">
                    <DateInputField
                      id="moveInDate"
                      label="Move-in Date"
                      selected={moveInDate}
                      minDate={new Date()}
                      onChange={setMoveInDate}
                    />

                    <div>
                      <label className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-taupe-light">
                        Preferred Lease Duration
                      </label>
                      <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-cream-border bg-cream px-3 py-3">
                        <CalendarIcon size={14} className="shrink-0 text-taupe-light" />
                        <select
                          value={leaseDuration}
                          onChange={(e) => setLeaseDuration(Number(e.target.value))}
                          className="w-full cursor-pointer appearance-none border-none bg-transparent p-0 font-sans text-[13px] font-medium text-ink focus:outline-none"
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
                    <p className="m-0 font-sans text-[11px] text-taupe-light">
                      You can adjust the lease duration later with the property owner
                    </p>
                  </div>
                )}
              </div>

              {availability.conflict && (
                <div className="mb-4 rounded-xl bg-red-50 px-3.5 py-3 font-sans text-[13px] text-red-600">
                  Property not available from{" "}
                  {new Date(availability.conflict.dates.from).toLocaleDateString()} to{" "}
                  {availability.conflict.dates.to === "ongoing"
                    ? "ongoing"
                    : new Date(availability.conflict.dates.to).toLocaleDateString()}
                </div>
              )}

              {/* Price Calculation */}
              <div className="mb-4 flex flex-col gap-2.5 border-y border-cream-border-soft py-4">
                {rentalType === "short-term" ? (
                  <>
                    <div className="flex justify-between font-sans text-sm">
                      <span className="text-taupe">
                        ₹{property.pricePerNight} × {calculateNights(checkinDate, checkoutDate)} nights
                      </span>
                      <span className="font-medium text-ink">₹{shortTermTotals?.subTotal}</span>
                    </div>
                    <div className="flex justify-between font-sans text-sm">
                      <span className="text-taupe">Service charge (5%)</span>
                      <span className="font-medium text-ink">₹{shortTermTotals?.serviceCharge}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between font-sans text-sm">
                      <span className="text-taupe">First month rent</span>
                      <span className="font-medium text-ink">₹{property.pricePerMonth ?? 0}</span>
                    </div>
                    <div className="flex justify-between font-sans text-sm">
                      <span className="text-taupe">Service charge (5%)</span>
                      <span className="font-medium text-ink">
                        ₹{Math.ceil((property.pricePerMonth ?? 0) * 0.05)}
                      </span>
                    </div>
                    {leaseDuration > 1 && (
                      <div className="flex justify-between font-sans text-sm">
                        <span className="text-taupe">Estimated total amount</span>
                        <span className="font-medium text-ink">
                          ₹{calculateLongTermTotal(property, leaseDuration).subTotal}
                        </span>
                      </div>
                    )}
                    {moveInDate && (
                      <div className="font-sans text-[13px] text-taupe-light">
                        Starting {moveInDate.toLocaleDateString()}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Total */}
              <div className="mb-6 flex items-center justify-between">
                <span className="font-sans text-base font-bold text-ink">
                  {rentalType === "short-term" ? "Total" : "Due Now"}
                </span>
                <span className="font-serif text-2xl font-semibold text-ink">
                  ₹
                  {rentalType === "short-term"
                    ? shortTermTotals.total
                    : calculateLongTermTotal(property, 1).total}
                </span>
              </div>

              <button
                className={`w-full rounded-[14px] border-none py-4 font-sans text-[15px] font-semibold transition-all ${
                  !availability.available || availability.loading || isProcessingPayment
                    ? "cursor-not-allowed bg-cream-border text-taupe-light"
                    : "cursor-pointer bg-ink text-cream shadow-[0_4px_16px_rgba(28,25,23,0.15)] hover:bg-amber hover:shadow-[0_8px_24px_rgba(181,112,60,0.25)]"
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
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
              <p className="m-0 mt-3 text-center font-sans text-xs text-taupe-light">
                You won't be charged yet
              </p>
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
      color: '#b5703c'
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
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-taupe-light"
      >
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-xl border-[1.5px] border-cream-border bg-cream px-3 py-3">
        <CalendarIcon size={14} className="shrink-0 text-taupe-light" />
        <DatePicker
          id={id}
          selected={selected}
          onChange={onChange}
          placeholderText="Add date"
          className="w-full min-w-0 cursor-pointer border-none bg-transparent p-0 font-sans text-[13px] font-medium text-ink placeholder-taupe-light focus:outline-none"
          dateFormat="dd-MM-yyyy"
          minDate={minDate}
        />
      </div>
    </div>
  );
};
