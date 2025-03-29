import { InputFieldType } from "../types"

export const PropertyInputField = ({
  label,
  type,
  placeholder,
  id,
  name,
  value,
  className = '',
  onChange,
}: InputFieldType) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="font-semibold text-sm text-[#374151]">
        {label}
      </label>
      
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`border border-[#ccced3] placeholder-black placeholder-opacity-100 rounded-2xl p-3 text-long ${className}`}
          rows={4}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`border border-[#ccced3] placeholder-black placeholder-opacity-100 rounded-2xl p-3 h-12 ${className}`}
        />
      )}
    </div>
  );
};