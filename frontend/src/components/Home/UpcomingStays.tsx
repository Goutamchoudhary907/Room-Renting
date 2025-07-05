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
    <div className="bg-[#ffffff00]">
      <div className="flex justify-center items-center font-medium text-xl mt-10 md:font-bold md:text-3xl md:mt-10 lg:font-bold lg:text-3xl lg:mt-20">
        <h2>Your Upcoming Stays</h2>
      </div>

      <div className="mt-15 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-6 mr-7">
        {bookings.map((booking) => (
          <PropertyCard 
            key={booking.id}
            property={{
              id: booking.property.id,
              title: booking.property.title,
              images: booking.property.images,
              bookingStatus: booking.status,
              nextBookingDate: getNextBookingDate(booking)
            }}
          />
        ))}
      </div>
    </div>
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

  const getStatusStyle = () => {
    switch (property.bookingStatus) {
      case 'BOOKED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="rounded-lg shadow-md overflow-hidden ml-8 mb-8">
      <div className="pt-1 pb-3">
        <img 
          src={property.images[0]?.url} 
          alt={property.title} 
          className="w-full h-48 object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-lg whitespace-nowrap overflow-hidden text-ellipsis ">{property.title}</h3>
          <div className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusStyle()}`}>
            {property.bookingStatus}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500">Check-in Date</p>
          <p className="font-medium">{formatDate(property.nextBookingDate)}</p>
        </div>

        <button 
          onClick={() => window.location.href = `/property/room-detail/${property.id}`}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};