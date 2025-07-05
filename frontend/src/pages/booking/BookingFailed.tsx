import { XCircleIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const BookingFailed = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [propertyId, setPropertyId] = useState<string | null>(null);
  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/payment/${bookingId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setPropertyId(response.data.booking.propertyId);
      } catch (error) {
        console.error('Failed to fetch booking details:', error);
      }
    };

    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="text-center mb-6">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
            <XCircleIcon className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Payment Failed</h1>
          <p className="mt-2 text-gray-600">
            We couldn't process your payment for booking #{bookingId}.
          </p>
        </div>

        <div className="mt-8 flex flex-col space-y-4">
          <button
            onClick={() => {
              if (propertyId) {
                navigate(`/property/room-detail/${propertyId}`);
              } else {
                navigate('/'); 
              }
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          >
            Try Payment Again
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
};