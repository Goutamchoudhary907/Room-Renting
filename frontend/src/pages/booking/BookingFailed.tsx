import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { XIcon } from "../../components/Home/icons";

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
    <div className="flex min-h-screen items-center justify-center bg-cream px-6 py-12">
      <div className="w-full max-w-[460px] rounded-3xl border border-cream-border bg-white p-8 shadow-[0_8px_32px_rgba(28,25,23,0.08)] sm:p-10">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-red-600/8">
            <XIcon size={30} strokeWidth={2.5} className="text-red-600" />
          </div>
          <h1 className="m-0 mb-2.5 font-serif text-3xl font-semibold tracking-tight text-ink">
            Payment failed
          </h1>
          <p className="m-0 font-sans text-sm leading-relaxed text-taupe">
            We couldn't process your payment. No charge has been made — you can safely try again.
          </p>
        </div>

        {bookingId && (
          <div className="mt-6 flex items-center justify-between rounded-2xl border border-cream-border bg-cream px-4 py-3">
            <span className="font-sans text-[13px] text-taupe">Booking reference</span>
            <span className="font-sans text-[13px] font-semibold text-ink">#{bookingId}</span>
          </div>
        )}

        <div className="mt-7 flex flex-col gap-3">
          <button
            onClick={() => {
              if (propertyId) {
                navigate(`/property/room-detail/${propertyId}`);
              } else {
                navigate('/');
              }
            }}
            className="w-full cursor-pointer rounded-[14px] border-none bg-ink py-3.5 font-sans text-sm font-semibold text-cream shadow-[0_4px_16px_rgba(28,25,23,0.15)] transition-colors hover:bg-amber"
          >
            Try Payment Again
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full cursor-pointer rounded-[14px] border-[1.5px] border-cream-border bg-white py-3.5 font-sans text-sm font-semibold text-ink transition-colors hover:bg-cream"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
