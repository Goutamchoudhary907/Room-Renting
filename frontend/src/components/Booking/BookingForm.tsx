import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"
import {updatePhoneInput} from "../../../schema/dist/authSchema"
import { z } from "zod";
interface BookingFormProps {
    propertyId: string;
    rentalType: 'short-term' | 'long-term';
    pricePerNight?: number;
    pricePerMonth?: number;
    onBookingSuccess?: () => void;
    checkinDate: Date | null;
    checkoutDate: Date | null;
    moveInDate: Date | null;
    leaseDuration: number;
    calculateShortTermTotal: () => { subTotal: number; serviceCharge: number; total: number };
    calculateLongTermTotal: () => number;
    onClose?: () => void;
}

export const BookingForm = ({
    propertyId,
    rentalType,
    pricePerNight,
    pricePerMonth,
    onBookingSuccess,
    checkinDate,
    checkoutDate,
    moveInDate,
    leaseDuration,
    calculateShortTermTotal,
    calculateLongTermTotal,
    onClose
}: BookingFormProps) => {
    const { user, isLoading,updateUserPhoneNumber} = useAuth();
    const isLoggedIn = !!user;

    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
    const [isBooking, setIsBooking] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const [paymentMethod, setPaymentMethod] = useState<'credit-card' | 'paypal'>('credit-card');
    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    });

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsBooking(true);
        setErrors({});
        try {
            updatePhoneInput.parse(phoneNumber);
         await updateUserPhoneNumber(phoneNumber);

        const totalAmount = rentalType === 'short-term' ? calculateShortTermTotal().total : calculateLongTermTotal();

        const bookingData = {
            propertyId: propertyId,
            rentalType: rentalType,
            checkinDate: rentalType === 'short-term' ? checkinDate?.toISOString() : null,
            checkoutDate: rentalType === 'short-term' ? checkoutDate?.toISOString() : null,
            moveInDate: rentalType === 'long-term' ? moveInDate?.toISOString() : null,
            leaseDuration: rentalType === 'long-term' ? leaseDuration : null,
            totalPrice: totalAmount,
            guestPhoneNumber: phoneNumber,
            paymentMethod: paymentMethod === 'credit-card' ? 'credit_card' : 'paypal',
            cardDetails: paymentMethod === 'credit-card' ? cardDetails : null,
        };

       
            console.log("Booking Data:", bookingData);
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (onBookingSuccess) {
                onBookingSuccess();
            }
            navigate('/bookings/success');
        } catch (err) {
            if (err instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                err.errors.forEach((validationError) => {
                    if (validationError.path[0] === "phoneNumber") {
                        newErrors.phoneNumber = validationError.message;
                    }
                });
                setErrors(newErrors);
            } else {
                setErrors({ general: 'Failed to process booking. Please try again.' });
            }
        } finally {
            setIsBooking(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full bg-gray-50 p-6 rounded-lg text-center">
                <div>Loading user information...</div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="w-full bg-gray-50 p-6 rounded-lg text-center">
                <h3 className="text-lg font-semibold mb-4">Sign In Required</h3>
                <p className="mb-4">You need to be signed in to make a booking.</p>
                <button
                    className="bg-blue-600 text-white py-2 px-6 rounded-lg"
                    onClick={() => navigate("/auth/signin")}
                >
                    Sign In
                </button>
            </div>
        );
    }

    const totalAmount = rentalType === 'short-term' ? calculateShortTermTotal().total : calculateLongTermTotal();

    return (
        <div className="w-full bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-6">Complete Your Booking and Payment</h3>

            <form onSubmit={handleSubmit}>
                <div className="mb-8">
                    <h4 className="text-lg font-medium mb-4">Guest Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={user?.firstName || ''}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={user?.lastName || ''}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={user?.email || ''}
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number*</label>
                            <input
                                type="tel"
                                className="w-full p-2 border border-gray-300 rounded"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                placeholder="Enter your phone number"
                            />
                            {errors.phoneNumber && (
                             <div className="mb-1 text-red-500 text-sm">
                                 {errors.phoneNumber}
                             </div>
                         )}
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h4 className="text-lg font-medium mb-4">Booking Details</h4>
                    {rentalType === 'short-term' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={checkinDate?.toISOString().split('T')[0] || ''}
                                    
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={checkoutDate?.toISOString().split('T')[0] || ''}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Move-in Date</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={moveInDate?.toISOString().split('T')[0] || ''}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Lease Duration</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={`${leaseDuration} month${leaseDuration > 1 ? 's' : ''}`}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Payment Details and Price Summary remain the same */}
                <div className="mb-8">
                    <h4 className="text-lg font-medium mb-4">Payment Details</h4>
                    <div className="flex space-x-4 mb-4">
                        <button
                            type="button"
                            className={`px-4 py-2 rounded-lg ${paymentMethod === 'credit-card' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            onClick={() => setPaymentMethod('credit-card')}
                        >
                            Credit Card
                        </button>
                        <button
                            type="button"
                            className={`px-4 py-2 rounded-lg ${paymentMethod === 'paypal' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                            onClick={() => setPaymentMethod('paypal')}
                        >
                            PayPal
                        </button>
                    </div>

                    {paymentMethod === 'credit-card' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number*</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={cardDetails.number}
                                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                    placeholder="1234 5678 9012 3456"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date*</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={cardDetails.expiry}
                                    onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                    placeholder="MM/YY"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">CVV*</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={cardDetails.cvv}
                                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                    placeholder="123"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card*</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded"
                                    value={cardDetails.name}
                                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <p>You will be redirected to PayPal to complete your payment after submitting the form.</p>
                        </div>
                    )}
                </div>

                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-lg font-medium mb-2">Price Summary</h4>
                    {rentalType === 'short-term' && pricePerNight && checkinDate && checkoutDate ? (
                        <>
                            <div className="flex justify-between mb-1">
                                <span>₹{pricePerNight} × {Math.ceil((checkoutDate.getTime() - checkinDate.getTime()) / (1000 * 60 * 60 * 24))} nights</span>
                                <span>₹{calculateShortTermTotal().subTotal}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 text-sm">
                                <span>Service charge (5%)</span>
                                <span>₹{calculateShortTermTotal().serviceCharge}</span>
                            </div>
                        </>
                    ) : rentalType === 'long-term' && pricePerMonth ? (
                        <>
                            <div className="flex justify-between mb-1">
                                <span>₹{pricePerMonth} x {leaseDuration} month{leaseDuration > 1 ? 's' : ''}</span>
                                <span>₹{calculateLongTermTotal()}</span>
                            </div>
                        </>
                    ) : null}
                    <div className="border-t border-gray-300 my-2"></div>
                    <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span>₹{totalAmount}</span>
                    </div>
                </div>

                {errors && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {errors.general}
                    </div>
                )}
                <div className="w-full bg-gray-50 p-6 rounded-lg relative">
                  <button 
                    onClick={() => onClose?.()}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                  {/* ... rest of your booking form ... */}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition"
                    disabled={isBooking}
                >
                    {isBooking ? 'Processing Payment...' : 'Pay Now'}
                </button>
            </form>
        </div>
    );
};