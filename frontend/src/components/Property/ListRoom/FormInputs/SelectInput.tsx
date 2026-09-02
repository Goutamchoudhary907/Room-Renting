import React, { ChangeEvent } from "react";
import { ErrorMessage } from "./ErrorMessage";

interface SelectInputType {
  label: string;
  id: string;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options: { value: string | number; label: string }[];
  value: string | number;
  error?: string;
  inputProps?: React.SelectHTMLAttributes<HTMLSelectElement>;
}

export function SelectInput({
  label,
  id,
  name,
  onChange,
  options,
  value,
  error,
  inputProps
}: SelectInputType) {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    let parsedValue: string | number = event.target.value;

    if (name === "bedrooms" || name === "bathrooms") {
      parsedValue = Number(event.target.value);
    }
    onChange({
      target: { name, value: parsedValue },
    } as ChangeEvent<HTMLSelectElement>);
  };

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        className={`w-full cursor-pointer rounded-[14px] border-[1.5px] bg-cream px-4 py-3.5 font-sans text-sm text-ink transition-colors focus:border-amber focus:outline-none ${
          error ? "border-red-400" : "border-cream-border"
        }`}
        value={value}
        onChange={handleSelectChange}
        {...inputProps}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <ErrorMessage message={error} className="mt-1.5" />}
    </div>
  );
}
