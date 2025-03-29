import React, { ChangeEvent } from "react";

interface SelectInputType {
  label: string;
  id: string;
  name: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  options: { value: string | number; label: string }[];
  value: string | number;
  error?: string;
}

export function SelectInput({
  label,
  id,
  name,
  onChange,
  options,
  value,
  error,
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
        className="block font-semibold text-sm text-[#374151] mb-1"
      >
        {label}
      </label>
      <select
        id={id}
        name={name}
        className={`w-full border ${error ? "border-red-500" : "border-[#ccced3]"} rounded p-2 focus:outline-none`}
        value={value}
        onChange={handleSelectChange}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <div className="text-red-500 text-sm mt-1 p-2 bg-red-50 rounded">
          <p className="flex items-start">
            <svg
              className="w-4 h-4 mr-1 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
          </p>
        </div>
      )}
    </div>
  );
}