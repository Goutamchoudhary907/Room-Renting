import { RoomDetailsData } from '../pages/property/RoomDetails';

export interface ShortTermTotal {
  subTotal: number;
  serviceCharge: number;
  total: number;
}

export const calculateNights = (checkinDate: Date | null, checkoutDate: Date | null): number => {
  if (!checkinDate || !checkoutDate) return 0;
  const diffTime = Math.abs(checkoutDate.getTime() - checkinDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const calculateShortTermTotal = (
  property: Pick<RoomDetailsData, 'pricePerNight'> | null,
  checkinDate: Date | null,
  checkoutDate: Date | null
): ShortTermTotal => {
  if (!property?.pricePerNight || !checkinDate || !checkoutDate) {
    return { subTotal: 0, serviceCharge: 0, total: 0 };
  }
  const nights = calculateNights(checkinDate, checkoutDate);
  const subTotal = nights * property.pricePerNight;
  const serviceCharge = Math.ceil(subTotal * 0.05);
  return { 
    subTotal,
     serviceCharge, 
    //  total: subTotal + serviceCharge
     total: subTotal,
    };
};

export const calculateLongTermTotal = (
  property: Pick<RoomDetailsData, 'pricePerMonth'> | null,
  leaseDuration: number
): number => {
  if (!property?.pricePerMonth) {
    return 0;
  }
  return leaseDuration * property.pricePerMonth;
};