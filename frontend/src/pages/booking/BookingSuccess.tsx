import { CheckCircleIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useEffect, useState } from "react";
import {useNavigate, useParams, useSearchParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
interface BookingDetails{
    id:string ,
    property:{
        title:string;
        image?:string;
    };
    dates:{
        checkIn?: string;
        checkOut?: string;
        moveIn?: string;
        leaseDuration?: number;
    };
    payment:{
        amount:number;
        currency:string;
        transactionId:string;
    };
}

export const BookingSuccess=() =>{
    const { bookingId } = useParams(); 
    const [searchParams] = useSearchParams();
    const paymentId = searchParams.get('payment_id');
    const navigate = useNavigate();
    const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
    const [loading, setLoading] = useState(true)

  
    useEffect(() => {
        const fetchBookingDetails = async () => {
          try {
            const response = await axios.get(`${BACKEND_URL}/payment/${bookingId}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
              }
            });
            
            const booking = response.data.booking;
            setBookingDetails({
              id: booking.bookingId,
              property: {
                title: booking.property.title,
                image: booking.property.images?.[0]?.url
              },
              dates: {
                checkIn: booking.checkinDate,
                checkOut: booking.checkoutDate,
                moveIn: booking.moveInDate,
                leaseDuration: booking.leaseDuration
              },
              payment: {
                amount: booking.totalAmount,
                currency: 'INR',
             transactionId: paymentId || booking.razorpayPaymentId || 'N/A'
              }
            });
          } catch (error) {
            console.error('Failed to fetch booking details:', error);
            navigate('/');
          } finally {
            setLoading(false);
          }
        };
    
        if (bookingId) {
          fetchBookingDetails();
        }
      }, [bookingId, paymentId, navigate]);
      if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckCircleIcon className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-gray-900">Booking Confirmed!</h1>
              <p className="mt-2 text-gray-600">Your payment was successful and your booking is now confirmed.</p>
            </div>
    
            {bookingDetails && (
              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-medium text-gray-900">Booking Details</h2>
                
                <div className="mt-4 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property:</span>
                    <span className="font-medium">{bookingDetails.property.title}</span>
                  </div>
    
                  {bookingDetails.dates.checkIn && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="font-medium">
                        {new Date(bookingDetails.dates.checkIn).toLocaleDateString()}
                      </span>
                    </div>
                  )}
    
                  {bookingDetails.dates.checkOut && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="font-medium">
                        {new Date(bookingDetails.dates.checkOut).toLocaleDateString()}
                      </span>
                    </div>
                  )}
    
                  {bookingDetails.dates.moveIn && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Move-in Date:</span>
                      <span className="font-medium">
                        {new Date(bookingDetails.dates.moveIn).toLocaleDateString()}
                      </span>
                    </div>
                  )}
    
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Paid:</span>
                    <span className="font-medium">
                      ₹{bookingDetails.payment.amount.toLocaleString()}
                    </span>
                  </div>
    
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-medium text-sm">
                      {bookingDetails.payment.transactionId}
                    </span>
                  </div>
                </div>
              </div>
            )}
    
            <div className="mt-8 flex flex-col space-y-4">
              <button
                onClick={() => navigate('/booking/my-bookings')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                View My Bookings
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg border border-gray-300"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      );
}