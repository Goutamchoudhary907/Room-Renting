import { InputFieldType } from "../types"

const FIELD_CLASS =
  "w-full rounded-[14px] border-[1.5px] border-cream-border bg-cream px-4 py-3.5 font-sans text-sm text-ink placeholder-taupe-light transition-colors focus:border-amber focus:outline-none";

export const PropertyInputField = ({
  label,
  type,
  placeholder,
  id,
  name,
  value,
  className = '',
  onChange,
  inputProps,
}: InputFieldType) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft"
      >
        {label}
      </label>

      {type === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${FIELD_CLASS} resize-y ${className}`}
          rows={4}
          {...inputProps}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${FIELD_CLASS} ${className}`}
          {...inputProps}
        />
      )}
    </div>
  );
};
