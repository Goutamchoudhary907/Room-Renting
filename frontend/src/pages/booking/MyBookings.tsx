import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

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
  };
};

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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'SUCCESSFUL': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'FAILED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow animate-pulse">
            <div className="h-48 bg-gray-200 rounded-t-lg"></div>
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-10 bg-gray-200 rounded mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4">
        <svg className="mx-auto h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">Error loading bookings</h3>
       <p className="mt-1 text-sm text-gray-500">{error?.message}</p>
        <button
         onClick={() => refetch()}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 px-4">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900">No bookings yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          You haven't made any bookings yet. Start exploring properties to book your stay.
        </p>
        <button
          onClick={() => navigate('/property/all-rooms')}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Explore Rooms
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
      
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upcoming'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Upcoming ({upcomingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'past'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Past ({pastBookings.length})
          </button>
        </nav>
      </div>

      {displayedBookings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No {activeTab} bookings found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {displayedBookings.map((booking) => (
            <div key={booking.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="h-48 bg-gray-200 relative overflow-hidden">
                <img
                  src={booking.property.images[0]?.url || "https://via.placeholder.com/300"}
                  alt={booking.property.title}
                  className="w-full h-full object-cover"
                />
              </div>

             <div className="px-4 py-5 sm:p-6">
  <div className="flex items-start justify-between">
    <h3 className="text-lg font-medium text-gray-900 truncate pr-2">
      {booking.property.title}
    </h3>
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(booking.paymentStatus)}`}>
      {booking.paymentStatus}
    </span>
  </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Type:</span> {booking.rentalType === 'short-term' ? 'Short stay' : 'Long lease'}
                  </p>
                  {booking.rentalType === 'short-term' ? (
                    <p>
                      <span className="font-medium">Dates:</span> {formatDate(booking.checkinDate)} → {formatDate(booking.checkoutDate)}
                    </p>
                  ) : (
                    <p>
                      <span className="font-medium">Move-in:</span> {formatDate(booking.moveInDate)} ({booking.leaseDuration} months)
                    </p>
                  )}
                  <p><span className="font-medium">Total:</span> ₹{booking.totalAmount}</p>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => navigate(`/property/room-detail/${booking.property.id}`)}
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View Property Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}