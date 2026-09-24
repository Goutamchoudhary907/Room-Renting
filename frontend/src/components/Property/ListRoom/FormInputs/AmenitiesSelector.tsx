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
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = value.includes(option.value);
        return (
          <label
            key={option.value}
            className={`flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] px-4 py-2.5 font-sans text-[13px] font-medium transition-all ${
              isSelected
                ? "border-ink bg-ink text-gold"
                : "border-cream-border bg-white text-taupe hover:border-amber hover:bg-amber/4 hover:text-amber"
            }`}
          >
            <input
              type="checkbox"
              value={option.value}
              checked={isSelected}
              onChange={() => handleCheckBoxChange(option.value)}
              className="sr-only"
            />
            {option.imageSrc && (
              <img
                src={option.imageSrc}
                alt=""
                className={`h-4 w-4 shrink-0 ${isSelected ? "brightness-0 invert" : ""}`}
              />
            )}
            <span className="whitespace-nowrap">{option.label}</span>
          </label>
        );
      })}
    </div>
  );
};
