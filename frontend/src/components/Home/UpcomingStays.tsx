import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export interface UpcomingBooking {
  id: string;
  property: {
    id: string;
    title: string;
    images: { url: string }[];
  };
  checkinDate?: string;
  checkoutDate?: string;
  moveInDate?: string;
  leaseDuration?: number;
  status: 'BOOKED' | 'PENDING' | 'CANCELLED';
}

interface UpcomingStaysProps {
  bookings: UpcomingBooking[];
}

export const UpcomingStays = ({ bookings }: UpcomingStaysProps) => {
  const getNextBookingDate = (booking: UpcomingBooking) => {
    return booking.checkinDate || booking.moveInDate || "";
  };

  return (
    <section className="mx-auto max-w-6xl px-6 pt-14">
      <Reveal className="mb-10">
        <SectionHeader
          align="left"
          eyebrow="Coming up"
          heading="Your upcoming stays"
        />
      </Reveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bookings.map((booking, i) => (
          <Reveal key={booking.id} delay={Math.min(i, 3) * 0.05}>
            <PropertyCard
              property={{
                id: booking.property.id,
                title: booking.property.title,
                images: booking.property.images,
                bookingStatus: booking.status,
                nextBookingDate: getNextBookingDate(booking),
              }}
            />
          </Reveal>
        ))}
      </div>
    </section>
  );
};

interface Property {
  id: string;
  title: string;
  images: { url: string }[];
  bookingStatus: 'BOOKED' | 'PENDING' | 'CANCELLED';
  nextBookingDate?: string;
}

interface PropertyCardProps {
  property: Property;
}

const STATUS_STYLE: Record<Property["bookingStatus"], string> = {
  BOOKED: "bg-verified/10 text-verified",
  PENDING: "bg-gold/20 text-[#a08620]",
  CANCELLED: "bg-red-100 text-red-700",
};

const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="overflow-hidden rounded-[20px] border border-cream-border bg-white p-2.5 shadow-[0_1px_3px_rgba(28,25,23,0.04)] transition-all duration-[400ms] hover:-translate-y-1.5 hover:shadow-[0_20px_44px_rgba(28,25,23,0.12)]">
      <div className="relative h-[180px] overflow-hidden rounded-[14px] bg-cream-border-soft">
        <img
          src={property.images[0]?.url}
          alt={property.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="px-2 pb-2 pt-3.5">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h3 className="overflow-hidden text-ellipsis whitespace-nowrap font-serif text-[19px] font-semibold text-ink">
            {property.title}
          </h3>
          <span className={`shrink-0 rounded-full px-3 py-1 font-sans text-[11px] font-bold ${STATUS_STYLE[property.bookingStatus]}`}>
            {property.bookingStatus}
          </span>
        </div>

        <div className="mb-4 border-t border-cream-border-soft pt-3">
          <p className="m-0 font-sans text-xs text-taupe-light">Check-in Date</p>
          <p className="m-0 mt-0.5 font-sans text-sm font-semibold text-ink">{formatDate(property.nextBookingDate)}</p>
        </div>

        <button
          onClick={() => window.location.href = `/property/room-detail/${property.id}`}
          className="w-full cursor-pointer rounded-full border-none bg-ink py-2.5 font-sans text-sm font-semibold text-cream transition-colors hover:bg-amber"
        >
          View Details
        </button>
      </div>
    </div>
  );
};
