import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRightIcon, MapPinIcon } from '../../components/Home/icons';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

type Booking = {
  id: number;
  bookingId: string;
  paymentStatus: 'PENDING' | 'SUCCESSFUL' | 'FAILED';
  checkinDate?: string;
  checkoutDate?: string;
  moveInDate?: string;
  leaseDuration?: number;
  totalAmount: number;
  rentalType: string;
  property: {
    id: number;
    title: string;
    images: { url: string }[];
    city?: string | null;
    landmark?: string | null;
    locality?: string | null;
  };
};

const STATUS_LABEL: Record<string, { text: string; className: string }> = {
  SUCCESSFUL: { text: 'Confirmed', className: 'bg-verified/10 text-verified' },
  PENDING: { text: 'Pending', className: 'bg-gold/20 text-[#a08620]' },
  FAILED: { text: 'Failed', className: 'bg-red-50 text-red-600' },
};

const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-cream">
    <div className="mx-auto max-w-[900px] px-6 pb-20 pt-8">{children}</div>
  </div>
);

const Header = () => (
  <div className="mb-8">
    <div className="mb-2 flex items-center gap-2">
      <div className="h-0.5 w-5 bg-amber" />
      <span className="font-sans text-[11px] font-bold uppercase tracking-[0.18em] text-amber">
        Your trips
      </span>
    </div>
    <h1 className="m-0 font-serif text-[clamp(28px,4vw,40px)] font-semibold tracking-tight text-ink">
      My Bookings
    </h1>
  </div>
);

export default function MyBookings() {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const navigate = useNavigate();

 const {
  data: bookings = [],
  isLoading: loading,
  error ,
  refetch
} = useQuery<Booking[]>({
  queryKey: ['myBookings'],
  queryFn: async () => {
    const response = await axios.get(`${BACKEND_URL}/booking/my-bookings`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data.bookings || [];
  },
  enabled: !!token,
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false
});

  // Keep your existing date normalization logic
  const isUpcoming = (startDateString?: string) => {
    if (!startDateString) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = new Date(startDateString);
    startDate.setHours(0, 0, 0, 0);
    return startDate >= today;
  };

  const upcomingBookings = bookings.filter(booking =>
    isUpcoming(booking.checkinDate || booking.moveInDate) &&
    booking.paymentStatus === 'SUCCESSFUL'
  );

  const pastBookings = bookings.filter(booking => {
    const startDate = booking.checkinDate || booking.moveInDate;
    return startDate && !isUpcoming(startDate);
  });

  const displayedBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatLocation = (property: Booking['property']) => {
    if (!property.city) return null;
    if (property.landmark) return `Near ${property.landmark}, ${property.city}`;
    return property.locality ? `${property.locality}, ${property.city}` : property.city;
  };

  if (loading) {
    return (
      <PageShell>
        <Header />
        <div className="mb-7 h-[50px] w-[240px] animate-pulse rounded-[14px] bg-white" />
        <div className="flex animate-pulse flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-[20px] border border-cream-border bg-white p-3">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="h-[150px] w-full shrink-0 rounded-[14px] bg-cream-border-soft sm:w-[200px]" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-6 w-24 rounded-full bg-cream-border-soft" />
                  <div className="h-6 w-2/3 rounded bg-cream-border-soft" />
                  <div className="h-3 w-1/3 rounded bg-cream-border-soft" />
                  <div className="h-10 w-full rounded bg-cream-border-soft" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <Header />
        <div className="rounded-[20px] border border-cream-border bg-white px-6 py-16 text-center">
          <h3 className="m-0 font-serif text-xl font-semibold text-ink">Error loading bookings</h3>
          <p className="mx-auto mt-2 max-w-sm font-sans text-sm text-taupe">{error?.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-6 cursor-pointer rounded-full border-none bg-ink px-7 py-3 font-sans text-[13px] font-semibold text-cream transition-colors hover:bg-amber"
          >
            Try Again
          </button>
        </div>
      </PageShell>
    );
  }

  if (bookings.length === 0) {
    return (
      <PageShell>
        <Header />
        <div className="rounded-[20px] border border-cream-border bg-white px-6 py-16 text-center">
          <h3 className="m-0 font-serif text-xl font-semibold text-ink">No bookings yet</h3>
          <p className="mx-auto mt-2 max-w-sm font-sans text-sm text-taupe">
            You haven't made any bookings yet. Start exploring properties to book your stay.
          </p>
          <button
            onClick={() => navigate('/property/all-rooms')}
            className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full border-none bg-ink px-7 py-3 font-sans text-[13px] font-semibold text-cream transition-colors hover:bg-amber"
          >
            Explore Rooms
            <ArrowRightIcon />
          </button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Header />

      {/* Tabs */}
      <div className="mb-7 flex w-fit gap-1.5 rounded-[14px] border border-cream-border bg-white p-[5px]">
        {([
          { key: 'upcoming' as const, label: 'Upcoming', count: upcomingBookings.length },
          { key: 'past' as const, label: 'Past', count: pastBookings.length },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`cursor-pointer rounded-[10px] border-none px-[22px] py-2.5 font-sans text-[13px] font-semibold transition-colors ${
              activeTab === tab.key
                ? 'bg-ink text-gold'
                : 'bg-transparent text-taupe hover:bg-cream'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {displayedBookings.length === 0 ? (
        <div className="rounded-[20px] border border-cream-border bg-white px-6 py-16 text-center">
          <p className="m-0 font-serif text-xl font-semibold text-ink">No {activeTab} bookings found</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {displayedBookings.map((booking) => {
            const status = STATUS_LABEL[booking.paymentStatus] ?? {
              text: booking.paymentStatus,
              className: 'bg-cream text-taupe',
            };
            const location = formatLocation(booking.property);
            const isShortTerm = booking.rentalType === 'short-term';

            return (
              <div
                key={booking.id}
                onClick={() => navigate(`/property/room-detail/${booking.property.id}`)}
                className="cursor-pointer rounded-[20px] border border-cream-border bg-white p-3 shadow-[0_1px_3px_rgba(28,25,23,0.04)] transition-all duration-300 hover:shadow-[0_12px_32px_rgba(28,25,23,0.08)]"
              >
                <div className="flex flex-col gap-5 sm:flex-row">
                  {/* Image */}
                  <div className="h-[180px] w-full shrink-0 overflow-hidden rounded-[14px] bg-cream-border-soft sm:h-[150px] sm:w-[200px]">
                    {booking.property.images[0]?.url ? (
                      <img
                        src={booking.property.images[0].url}
                        alt={booking.property.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-sans text-sm text-taupe-light">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                    <div>
                      <div className="mb-1.5">
                        <span
                          className={`rounded-full px-3 py-1 font-sans text-[11px] font-semibold ${status.className}`}
                        >
                          {status.text}
                        </span>
                      </div>
                      <h3 className="m-0 mb-1.5 overflow-hidden text-ellipsis whitespace-nowrap font-serif text-xl font-semibold text-ink">
                        {booking.property.title}
                      </h3>
                      {location && (
                        <div className="flex items-center gap-1 font-sans text-[13px] text-taupe-light">
                          <MapPinIcon size={12} className="shrink-0" />
                          <span className="overflow-hidden text-ellipsis whitespace-nowrap">{location}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center gap-4 border-t border-cream-border-soft pt-2.5">
                      <div>
                        <div className="mb-[3px] font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-taupe-light">
                          {isShortTerm ? 'Check-in' : 'Move-in'}
                        </div>
                        <div className="font-sans text-sm font-semibold text-ink">
                          {formatDate(isShortTerm ? booking.checkinDate : booking.moveInDate)}
                        </div>
                      </div>

                      <ArrowRightIcon className="text-taupe-light" />

                      <div>
                        <div className="mb-[3px] font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-taupe-light">
                          {isShortTerm ? 'Check-out' : 'Duration'}
                        </div>
                        <div className="font-sans text-sm font-semibold text-ink">
                          {isShortTerm
                            ? formatDate(booking.checkoutDate)
                            : `${booking.leaseDuration} ${booking.leaseDuration === 1 ? 'month' : 'months'}`}
                        </div>
                      </div>

                      <div className="ml-auto flex items-center gap-4">
                        <span className="font-serif text-[22px] font-semibold text-ink">
                          ₹{booking.totalAmount}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/property/room-detail/${booking.property.id}`);
                          }}
                          className="cursor-pointer rounded-[10px] border-[1.5px] border-cream-border bg-white px-4 py-2 font-sans text-xs font-semibold text-ink transition-all hover:border-amber hover:text-amber"
                        >
                          View property
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
