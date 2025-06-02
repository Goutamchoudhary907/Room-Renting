import { AmenitiesInputType } from "../types";

export const AmenitiesInput = ({
  value,
  options,
  onChange
}: AmenitiesInputType) => {
  const handleCheckBoxChange = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((item) => item !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };
  
  return (
    <div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 p-2">
      {options.map((option) => (
        <label
          key={option.value}
          className="cursor-pointer border rounded-lg flex md:items-center items-start gap-2 md:gap-3 p-2 md:pl-3 h-auto md:h-12 text-sm font-semibold border-gray-300"
        >
          <input
            type="checkbox"
            value={option.value}
            checked={value.includes(option.value)}
            onChange={() => handleCheckBoxChange(option.value)}
            className="opacity-0 absolute"
          />
          {/* Checkbox visual */}
          <span className="w-5 h-5 border border-gray-300 rounded-sm flex items-center justify-center shrink-0 mt-1 md:mt-0">
            {value.includes(option.value) && (
              <span className="w-3 h-3 bg-blue-500 rounded-sm" />
            )}
          </span>

          {/* Image + Text */}
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 text-left">
            {option.imageSrc && (
              <img
                src={option.imageSrc}
                alt={option.label}
                className="w-5 h-5 shrink-0"
              />
            )}
            <span className="break-words leading-snug">{option.label}</span>
          </div>
        </label>
      ))}
    </div>
  </div>
);
};