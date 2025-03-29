import { ChangeEvent } from "react";

export interface ChildrenProps {
  children: React.ReactNode;
}

export interface RoomFormData {
  title: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  kitchen: string;
  livingRoom: string;
  propertyType: string;
  rentalType: string;
  pricePerNight: number | undefined;
  pricePerMonth: number | undefined;
  address: string;
  amenities: string[];
  depositAmount?: number | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface InputFieldType {
  label: string;
  type: string;
  placeholder: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  className?: string;
}

export interface SelectInputType {
  label: string;
  id: string;
  name: string;
  options: { value: number | string; label: string }[];
  value: number | string;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export interface PropertyTypeInputProps {
  label: string;
  id: string;
  options: { value: string; label: string; imageSrc: string }[];
  value: string;
  onChange: (value: string) => void;
  className?:string;
}

export interface AmenitiesInputType {
  id: string;
  value: string[];
  options: { value: string; label: string; imageSrc: string }[];
  onChange: (values: string[]) => void;
}
