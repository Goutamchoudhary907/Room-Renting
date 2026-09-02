import axios from "axios";
import { useEffect, useState } from "react";
import {useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowRightIcon, CheckIcon } from "../../components/Home/icons";

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

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="font-sans text-[13px] text-taupe">{label}</span>
    <span className="min-w-0 truncate text-right font-sans text-[13px] font-semibold text-ink">
      {value}
    </span>
  </div>
);

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
          <div className="flex min-h-screen items-center justify-center bg-cream px-6">
            <div className="h-12 w-12 animate-spin rounded-full border-2 border-cream-border border-t-amber" />
          </div>
        );
      }

      const formatDate = (value: string) => new Date(value).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      return (
        <div className="flex min-h-screen items-center justify-center bg-cream px-6 py-12">
          <div className="w-full max-w-[460px] rounded-3xl border border-cream-border bg-white p-8 shadow-[0_8px_32px_rgba(28,25,23,0.08)] sm:p-10">
            <div className="text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-verified/10">
                <CheckIcon size={30} strokeWidth={2.5} className="text-verified" />
              </div>
              <h1 className="m-0 mb-2.5 font-serif text-3xl font-semibold tracking-tight text-ink">
                Booking confirmed
              </h1>
              <p className="m-0 font-sans text-sm leading-relaxed text-taupe">
                Your payment went through and your stay is locked in.
              </p>
            </div>

            {bookingDetails && (
              <div className="mt-7 rounded-2xl border border-cream-border bg-cream p-5">
                <h2 className="m-0 mb-4 font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft">
                  Booking details
                </h2>

                <div className="flex flex-col gap-3">
                  <DetailRow label="Property" value={bookingDetails.property.title} />

                  {bookingDetails.dates.checkIn && (
                    <DetailRow label="Check-in" value={formatDate(bookingDetails.dates.checkIn)} />
                  )}

                  {bookingDetails.dates.checkOut && (
                    <DetailRow label="Check-out" value={formatDate(bookingDetails.dates.checkOut)} />
                  )}

                  {bookingDetails.dates.moveIn && (
                    <DetailRow label="Move-in date" value={formatDate(bookingDetails.dates.moveIn)} />
                  )}

                  {bookingDetails.dates.leaseDuration && (
                    <DetailRow
                      label="Lease duration"
                      value={`${bookingDetails.dates.leaseDuration} ${bookingDetails.dates.leaseDuration === 1 ? 'month' : 'months'}`}
                    />
                  )}

                  <div className="mt-1 flex items-center justify-between border-t border-cream-border pt-3">
                    <span className="font-sans text-sm font-bold text-ink">Total paid</span>
                    <span className="font-serif text-xl font-semibold text-ink">
                      ₹{bookingDetails.payment.amount.toLocaleString()}
                    </span>
                  </div>

                  <DetailRow label="Transaction ID" value={bookingDetails.payment.transactionId} />
                </div>
              </div>
            )}

            <div className="mt-7 flex flex-col gap-3">
              <button
                onClick={() => navigate('/booking/my-bookings')}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[14px] border-none bg-ink py-3.5 font-sans text-sm font-semibold text-cream shadow-[0_4px_16px_rgba(28,25,23,0.15)] transition-colors hover:bg-amber"
              >
                View My Bookings
                <ArrowRightIcon />
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
}
