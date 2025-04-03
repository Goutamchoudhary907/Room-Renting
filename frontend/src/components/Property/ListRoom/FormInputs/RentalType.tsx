import React from "react";
import { PropertyTypeInputProps } from "../types";

export const RentalTypeInput: React.FC<PropertyTypeInputProps> = ({
  label,
  id,
  options,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block font-semibold text-sm text-[#374151] mb-1 pb-4"
      >
        {label}
      </label>

      <div className="grid grid-cols-3 gap-4">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer pl-5 pt-4 border rounded-lg h-28 transition-colors duration-200 ${
              value === option.value
                ? "bg-gray-200 border-none shadow-sm"
                : "border-gray-300 hover:bg-gray-100"
            }`}
          >
            <div className="items-center">
              {option.imageSrc && (
                <img
                  src={option.imageSrc}
                  alt={option.label}
                  className="mr-2 w-6 h-6 mb-1"
                />
              )}
              <span className="">{option.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};