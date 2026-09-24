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
        className="mb-3 block font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft"
      >
        {label}
      </label>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((option) => (
          <div
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`cursor-pointer rounded-[14px] border-[1.5px] p-4 transition-all duration-200 ${
              value === option.value
                ? "border-ink bg-ink"
                : "border-cream-border bg-white hover:border-amber/40 hover:bg-amber/4"
            }`}
          >
            {option.imageSrc && (
              <img
                src={option.imageSrc}
                alt=""
                className={`mb-2 h-6 w-6 ${value === option.value ? "brightness-0 invert" : ""}`}
              />
            )}
            <span
              className={`font-sans text-[13px] font-semibold ${
                value === option.value ? "text-gold" : "text-taupe"
              }`}
            >
              {option.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
