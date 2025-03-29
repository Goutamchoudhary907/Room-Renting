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
      <div className="grid grid-cols-4 gap-4 p-2">
        {options.map((option) => (
          <label key={option.value}
            className="cursor-pointer pl-3 border rounded-lg  flex items-center h-12 text-sm font-semibold border-gray-300"
          >
            <input 
              type="checkbox" 
              value={option.value} 
              checked={value.includes(option.value)}
              onChange={() => handleCheckBoxChange(option.value)}
              className="mr-3 opacity-0 absolute"
            />
            <span className="mr-3 w-5 h-5 border border-gray-300 rounded-sm  flex items-center justify-center" >
              {value.includes(option.value) && <span className="w-3 h-3 bg-blue-500 rounded-sm" />}
            </span>
            {option.imageSrc && (
              <img src={option.imageSrc} alt={option.label} className="mr-3 w-5 h-5" />
            )}
            <span>{option.label}</span>
          </label>
        ))}                   
      </div>
    </div>
  );
};