import { useState } from "react";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from "react-router-dom";
import MyPropertiesSkeleton from "../skeletons/property/MyPropertiesSkeleton";
import { useAuth } from "../../context/AuthContext";
import { HostAvailabilityCalendar } from "../../components/Availability/HostAvailabilityCalendar";
import * as Popover from '@radix-ui/react-popover';
import {
  CalendarDaysIcon,
  CheckIcon,
  EditIcon,
  HouseIcon,
  MapPinIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "../../components/Home/icons";

export const MyProperties =() =>{

    const navigate=useNavigate();
    const [searchQuery, setSearchQuery]=useState("");
    const [filteredStatus, setFilteredStatus]=useState<string | null>(null);

    const [activeButton, setActiveButton]=useState<string | null>(null);
    // Property queued for deletion; drives the confirm dialog.
    const [deleteTarget, setDeleteTarget] = useState<Property | null>(null);
     const { isLoading: isAuthLoading } = useAuth();

  const queryClient = useQueryClient();

const {
  data: properties = [],
  isLoading: isPropertiesLoading,
  error: propertiesError
} = useQuery({
  queryKey: ['myProperties'],
  queryFn: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error("Unauthorized");
    }
    const response = await axios.get(`${BACKEND_URL}/property/my/properties`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  },
  staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  refetchOnWindowFocus: false
});

   // Calculate active listings
   const activeListingsCount=properties.filter(
    (property:Property) => property.bookingStatus === "AVAILABLE"
   ).length;

   // Total confirmed bookings across all of this host's properties
   const totalBookingsCount = properties.reduce(
     (sum: number, property: Property) =>
       sum + (property.bookings?.filter((b) => b.paymentStatus === 'SUCCESSFUL').length || 0),
     0
   );

     // Filter properties based on search query
     const normalizedSearchQuery=searchQuery.toLowerCase().replace(/\s/g, '');

     const filteredProperties=properties.filter((property:Property) =>
    property.title.toLowerCase().replace(/\s/g,'') .includes(normalizedSearchQuery)
    );

     const statusFilteredProperties=filteredStatus ? properties.filter((property:Property) =>
     property.bookingStatus===filteredStatus
    ):properties;

    const displayProperties=searchQuery ? statusFilteredProperties.filter((property:Property) =>
    filteredProperties.some((filteredProperty:Property) => filteredProperty.id === property.id)
    ):statusFilteredProperties;


   const { mutate: deleteProperty, isPending: isDeleting } = useMutation({
  mutationFn: async (propertyId: number) => {
    const token = localStorage.getItem('token');
    await axios.delete(`${BACKEND_URL}/property/delete/${propertyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    return propertyId;
  },
  onSuccess: (deletedId) => {
    queryClient.setQueryData(['myProperties'], (old: Property[]) =>
      old.filter(property => property.id !== deletedId)
    );
    setDeleteTarget(null);
  },
  onError: () => {
    alert("Error deleting property");
    setDeleteTarget(null);
  }
});

const handleDelete = (property: Property) => {
  setDeleteTarget(property);
};

const confirmDelete = () => {
  if (deleteTarget) deleteProperty(deleteTarget.id);
};
     const handleEdit= (propertyId:number) =>{
        navigate(`/property/edit/${propertyId}`);
     }

     if (isPropertiesLoading || isAuthLoading) {
  return <MyPropertiesSkeleton/>
}

    const stats = [
      {
        value: properties.length,
        label: 'Total Properties',
        icon: <HouseIcon size={18} />,
        iconBg: 'bg-amber/10',
        iconColor: 'text-amber',
      },
      {
        value: activeListingsCount,
        label: 'Active Listings',
        icon: <CheckIcon size={18} strokeWidth={2} />,
        iconBg: 'bg-verified/10',
        iconColor: 'text-verified',
      },
      {
        value: totalBookingsCount,
        label: 'Total Bookings',
        icon: <CalendarDaysIcon size={18} />,
        iconBg: 'bg-gold/15',
        iconColor: 'text-[#a08620]',
      },
    ];

    const filterTabs = [
      { key: null, label: 'All Properties', id: 'all' },
      { key: 'AVAILABLE', label: 'Available', id: 'AVAILABLE' },
      { key: 'BOOKED', label: 'Booked', id: 'BOOKED' },
    ];

    return(
        <div className="min-h-screen bg-cream">
          <div className="mx-auto max-w-[1000px] px-6 pb-20 pt-8">
            {propertiesError && (
              <div className="mb-6 rounded-xl bg-red-50 px-4 py-3 font-sans text-sm text-red-600">
                Error loading properties: {propertiesError.message}
              </div>
            )}

            {/* Header */}
            <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-0.5 w-5 bg-amber" />
                  <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-amber">
                    Dashboard
                  </span>
                </div>
                <h1 className="m-0 font-serif text-[clamp(28px,4vw,40px)] font-semibold tracking-tight text-ink">
                  My Properties
                </h1>
              </div>
              <button
                onClick={() => navigate("/property/create")}
                className="flex cursor-pointer items-center gap-2 rounded-full border-none bg-ink px-6 py-3 font-sans text-[13px] font-semibold text-cream shadow-[0_4px_16px_rgba(28,25,23,0.15)] transition-colors hover:bg-amber"
              >
                <PlusIcon />
                Add Property
              </button>
            </div>

            {/* Stats */}
            <div className="mb-9 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-[18px] border border-cream-border bg-white p-5 shadow-[0_1px_3px_rgba(28,25,23,0.04)]"
                >
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.iconBg} ${s.iconColor}`}>
                      {s.icon}
                    </div>
                  </div>
                  <div className="font-serif text-[28px] font-semibold leading-none text-ink">{s.value}</div>
                  <div className="mt-1 font-sans text-xs text-taupe-light">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Search + filters */}
            <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex h-11 items-center gap-2.5 rounded-[14px] border border-cream-border bg-white px-4 lg:w-[320px]">
                <SearchIcon size={16} className="shrink-0 text-taupe-light" />
                <input
                  type="text"
                  placeholder="Search properties..."
                  className="h-full w-full min-w-0 border-none bg-transparent p-0 font-sans text-sm text-ink placeholder-taupe-light focus:outline-none focus:ring-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex w-fit gap-1.5 rounded-[14px] border border-cream-border bg-white p-[5px]">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setFilteredStatus(tab.key);
                      setActiveButton(tab.id);
                    }}
                    className={`cursor-pointer rounded-[10px] border-none px-4 py-2 font-sans text-[13px] font-semibold transition-colors ${
                      activeButton === tab.id
                        ? 'bg-ink text-gold'
                        : 'bg-transparent text-taupe hover:bg-cream'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Property list */}
            {displayProperties.length === 0 ? (
              <div className="rounded-[20px] border border-cream-border bg-white px-6 py-16 text-center">
                <p className="m-0 font-serif text-xl font-semibold text-ink">No properties found</p>
                <p className="mx-auto mt-2 max-w-sm font-sans text-sm text-taupe">
                  {properties.length === 0
                    ? "You haven't listed any properties yet."
                    : 'Try a different search or filter.'}
                </p>
                {properties.length === 0 && (
                  <button
                    onClick={() => navigate('/property/create')}
                    className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full border-none bg-ink px-7 py-3 font-sans text-[13px] font-semibold text-cream transition-colors hover:bg-amber"
                  >
                    <PlusIcon />
                    Add Property
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {displayProperties.map((property:Property) =>(
                       <PropertyCard
                            key={property.id}
                            property={property}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            />
                    ))}
              </div>
            )}
          </div>

          {/* Delete confirmation — deletion is permanent and cannot be undone. */}
          {deleteTarget && (
            <div
              className="animate-rp-fade-in fixed inset-0 z-[200] flex items-center justify-center bg-ink/40 px-5"
              onClick={() => !isDeleting && setDeleteTarget(null)}
            >
              <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="delete-title"
                className="w-full max-w-[420px] rounded-3xl border border-cream-border bg-white p-7 shadow-[0_20px_48px_rgba(28,25,23,0.2)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600/8">
                  <TrashIcon size={20} className="text-red-600" />
                </div>
                <h2 id="delete-title" className="m-0 mb-2 font-serif text-2xl font-semibold text-ink">
                  Delete this property?
                </h2>
                <p className="m-0 mb-6 font-sans text-sm leading-relaxed text-taupe">
                  <span className="font-semibold text-ink">{deleteTarget.title}</span> will be permanently
                  removed along with its listing details. This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setDeleteTarget(null)}
                    disabled={isDeleting}
                    className="flex-1 cursor-pointer rounded-xl border-[1.5px] border-cream-border bg-white py-3 font-sans text-sm font-semibold text-ink transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="flex-1 cursor-pointer rounded-xl border-none bg-red-600 py-3 font-sans text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
    );
}

interface Booking {
  id: number;
  checkinDate: string | null;
  checkoutDate: string | null;
  moveInDate: string | null;
  paymentStatus: string;
}
interface Property{
  id: number;
  title: string;
  rentalType: string;
  propertyType?: string;
  pricePerNight: number | null;
  pricePerMonth: number | null;
  address: string;
  city?: string | null;
  landmark?: string | null;
  locality?: string | null;
  availability: null;
  hostId: number;
  images: Image[];
  bookingStatus:'AVAILABLE' | 'BOOKED' | 'UNAVAILABLE';
   bookings: Booking[];
}

interface Image {
    id: number;
    url: string;
    propertyId: number;
  }
interface PropertyCardProps {
    property: Property;
    onDelete: (property: Property) => void;
    onEdit:(propertyId:number) => void;
  }

const STATUS_STYLE: Record<string, string> = {
  AVAILABLE: 'bg-verified/10 text-verified',
  BOOKED: 'bg-[rgba(234,88,12,0.1)] text-[#ea580c]',
  UNAVAILABLE: 'bg-cream text-taupe',
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const PropertyCard= ({property,onDelete,onEdit }:PropertyCardProps) =>{
    const navigate = useNavigate();
   const getNextBookingDate = (bookings: Booking[]): string | null => {
  if (!bookings || bookings.length === 0) return null;

  const now = new Date();
  // Set to start of today for comparison
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const futureBookings = bookings
    .filter(booking =>
      booking.paymentStatus === 'SUCCESSFUL' &&
      (booking.checkinDate || booking.moveInDate)
    )
    .map(booking => {
      const bookingDate = booking.checkinDate || booking.moveInDate;
      return {
        date: new Date(bookingDate!),
        type: booking.checkinDate ? 'short-term' : 'long-term'
      };
    })
    .filter(booking => booking.date >= startOfToday) // Include today and future dates
    .sort((a, b) => a.date.getTime() - b.date.getTime()); // Sort ascending

  if (futureBookings.length === 0) return null;
  return futureBookings[0].date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

  // Show every rate this property offers.
  const prices: { amount: number; unit: string }[] = [];
  if (property.pricePerNight != null && property.rentalType !== 'long-term') {
    prices.push({ amount: property.pricePerNight, unit: '/night' });
  }
  if (property.pricePerMonth != null && property.rentalType !== 'short-term') {
    prices.push({ amount: property.pricePerMonth, unit: '/month' });
  }
  const isDualPrice = prices.length > 1;

  const location = property.city
    ? property.landmark
      ? `Near ${property.landmark}, ${property.city}`
      : property.locality
        ? `${property.locality}, ${property.city}`
        : property.city
    : null;

  const nextBooking = getNextBookingDate(property.bookings);

 return(
    <div
    className="cursor-pointer rounded-[20px] border border-cream-border bg-white p-3 shadow-[0_1px_3px_rgba(28,25,23,0.04)] transition-all duration-300 hover:border-amber/20 hover:shadow-[0_12px_32px_rgba(28,25,23,0.08)]"
    onClick={(e) => {
    const isButtonClick =
      (e.target as HTMLElement).closest("button") !== null;

    if (!isButtonClick) {
      navigate(`/property/room-detail/${property.id}`);
    }
  }}
  >
      <div className="flex flex-col gap-5 sm:flex-row">
        {/* Image */}
        <div className="h-[180px] w-full shrink-0 overflow-hidden rounded-[14px] bg-cream-border-soft sm:h-[160px] sm:w-[220px]">
          {property.images?.[0]?.url ? (
            <img
              src={property.images[0].url}
              alt={property.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center font-sans text-sm text-taupe-light">
              No Image
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-1.5">
          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 font-sans text-[11px] font-semibold ${
                  STATUS_STYLE[property.bookingStatus] || 'bg-cream text-taupe'
                }`}
              >
                {capitalize(property.bookingStatus)}
              </span>
              {property.propertyType && (
                <span className="rounded-full bg-cream px-2.5 py-1 font-sans text-[11px] font-semibold text-taupe">
                  {capitalize(property.propertyType)}
                </span>
              )}
            </div>
            <h3 className="m-0 mb-1.5 overflow-hidden text-ellipsis whitespace-nowrap font-serif text-xl font-semibold text-ink">
              {property.title}
            </h3>
            {location && (
              <div className="flex items-center gap-1 font-sans text-[13px] text-taupe-light">
                <MapPinIcon size={12} className="shrink-0" />
                <span className="overflow-hidden text-ellipsis whitespace-nowrap">{location}</span>
              </div>
            )}
            <div className="mt-1.5 font-sans text-xs text-taupe-light">
              Next booking:{' '}
              <span className="font-semibold text-ink-soft">{nextBooking || 'None upcoming'}</span>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              {prices.map((p) => (
                <div key={p.unit} className="whitespace-nowrap leading-tight">
                  <span
                    className={`font-serif font-semibold text-ink ${isDualPrice ? 'text-[18px]' : 'text-[22px]'}`}
                  >
                    ₹{p.amount}
                  </span>
                  <span
                    className={`ml-1 font-sans text-taupe-light ${isDualPrice ? 'text-[11px]' : 'text-xs'}`}
                  >
                    {p.unit}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                className="flex cursor-pointer items-center gap-1.5 rounded-[10px] border-[1.5px] border-cream-border bg-white px-4 py-2 font-sans text-xs font-semibold text-taupe transition-all hover:border-amber hover:text-amber"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(property.id);
                }}
              >
                <EditIcon />
                Edit
              </button>

              <Popover.Root>
                <Popover.Trigger asChild>
                  <button
                    className="flex cursor-pointer items-center gap-1.5 rounded-[10px] border-[1.5px] border-cream-border bg-white px-4 py-2 font-sans text-xs font-semibold text-taupe transition-all hover:border-amber hover:text-amber"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CalendarDaysIcon size={14} />
                    Availability
                  </button>
                </Popover.Trigger>

                <Popover.Content
                  className="z-50 w-[350px] rounded-2xl border border-cream-border bg-white p-4 shadow-[0_12px_32px_rgba(28,25,23,0.12)]"
                  side="bottom"
                  sideOffset={8}
                  align="center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <HostAvailabilityCalendar propertyId={property.id} />
                </Popover.Content>
              </Popover.Root>

              <button
                className="flex cursor-pointer items-center gap-1.5 rounded-[10px] border-[1.5px] border-red-600/20 bg-red-600/4 px-4 py-2 font-sans text-xs font-semibold text-red-600 transition-all hover:bg-red-600/10"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(property);
                }}
              >
                <TrashIcon />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
  </div>
 )
}
