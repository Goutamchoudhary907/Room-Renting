import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeftIcon, MapPinIcon } from "../Home/icons";

interface AuthLayoutProps {
  children: ReactNode;
  panelTitle: string;
  panelText: string;
  panelIcon?: ReactNode;
  showStats?: boolean;
  backTo?: string;
  backLabel?: string;
}

const HouseIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e8c17a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V10z"></path>
    <path d="M9 21V12h6v11"></path>
  </svg>
);

export const AuthLayout = ({
  children,
  panelTitle,
  panelText,
  panelIcon,
  showStats = true,
  backTo = "/",
  backLabel = "Back to home",
}: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left decorative panel */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-ink p-12 md:flex">
        {/* Glows */}
        <div className="pointer-events-none absolute -left-16 -top-24 h-[400px] w-[400px] rounded-full bg-amber/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-[350px] w-[350px] rounded-full bg-gold/12 blur-[80px]" />
        {/* Dot texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-12"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-[1] max-w-[360px] text-center">
          <div className="mb-12 flex items-center justify-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border border-gold/30 bg-gold/15">
              <HouseIcon />
            </div>
            <span className="font-serif text-[26px] font-bold tracking-tight text-cream">Rentpy</span>
          </div>

          {/* Floating card */}
          <div className={`animate-rp-float-slow rounded-3xl border border-white/8 bg-cream/6 p-8 ${showStats ? "mb-10" : ""}`}>
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gold/12 text-gold">
              {panelIcon ?? <MapPinIcon size={32} strokeWidth={1.5} className="text-gold" />}
            </div>
            <h2 className="m-0 mb-2 font-serif text-[28px] font-semibold tracking-tight text-white">
              {panelTitle}
            </h2>
            <p className="m-0 font-sans text-sm leading-relaxed text-white/40">{panelText}</p>
          </div>

          {/* Trust badges */}
          {showStats && (
          <div className="flex justify-center gap-6">
            <div className="text-center">
              <div className="font-serif text-2xl font-semibold text-gold">500+</div>
              <div className="font-sans text-[11px] text-white/30">Rooms</div>
            </div>
            <div className="w-px bg-white/8" />
            <div className="text-center">
              <div className="font-serif text-2xl font-semibold text-gold">4</div>
              <div className="font-sans text-[11px] text-white/30">Cities</div>
            </div>
            <div className="w-px bg-white/8" />
            <div className="text-center">
              <div className="font-serif text-2xl font-semibold text-gold">24/7</div>
              <div className="font-sans text-[11px] text-white/30">Support</div>
            </div>
          </div>
          )}
        </div>
      </div>

      {/* Right form panel */}
      <div className="relative flex flex-1 items-center justify-center bg-cream px-5 py-8 sm:px-12 sm:py-12">
        <div className="absolute left-6 top-6">
          <Link
            to={backTo}
            className="flex items-center gap-1.5 font-sans text-[13px] font-medium text-taupe no-underline transition-colors hover:text-ink"
          >
            <ArrowLeftIcon />
            {backLabel}
          </Link>
        </div>

        <div className="animate-rp-fade-up w-full max-w-[400px] pt-10 sm:pt-0">{children}</div>
      </div>
    </div>
  );
};


interface AuthFieldProps {
  label: string;
  id: string;
  /** Falls back to `id`. Needed by forms whose handler reads e.target.name. */
  name?: string;
  type?: string;
  placeholder: string;
  icon?: ReactNode;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage?: string;
  labelAction?: ReactNode;
  trailing?: ReactNode;
}

export const AuthField = ({
  label,
  id,
  name,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
  errorMessage,
  labelAction,
  trailing,
}: AuthFieldProps) => (
  <div>
    <div className="mb-2 flex items-center justify-between">
      <label
        htmlFor={id}
        className="font-sans text-xs font-bold uppercase tracking-[0.08em] text-ink-soft"
      >
        {label}
      </label>
      {labelAction}
    </div>
    <div
      className={`flex h-[50px] items-center gap-2.5 rounded-[14px] border-[1.5px] bg-white px-4 transition-colors focus-within:border-amber ${
        errorMessage ? "border-red-300" : "border-cream-border"
      }`}
    >
      {icon && <span className="shrink-0 text-taupe-light">{icon}</span>}
      <input
        id={id}
        name={name ?? id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-full w-full min-w-0 border-none bg-transparent p-0 font-sans text-sm text-ink placeholder-taupe-light focus:outline-none focus:ring-0"
      />
      {trailing}
    </div>
    {errorMessage && <p className="m-0 mt-1.5 font-sans text-xs text-red-500">{errorMessage}</p>}
  </div>
);

export const AuthDivider = ({ label }: { label: string }) => (
  <div className="mb-7 flex items-center gap-4">
    <div className="h-px flex-1 bg-cream-border" />
    <span className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-taupe-light">
      {label}
    </span>
    <div className="h-px flex-1 bg-cream-border" />
  </div>
);

export const AuthSubmitButton = ({
  onClick,
  disabled,
  loading,
  loadingText,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingText: string;
  children: ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`flex w-full items-center justify-center gap-2 rounded-[14px] border-none py-[15px] font-sans text-[15px] font-semibold transition-all ${
      disabled
        ? "cursor-not-allowed bg-cream-border text-taupe-light"
        : "cursor-pointer bg-ink text-cream shadow-[0_4px_16px_rgba(28,25,23,0.15)] hover:bg-amber hover:shadow-[0_8px_24px_rgba(181,112,60,0.25)]"
    }`}
  >
    {loading ? (
      <span className="flex items-center justify-center">
        <svg className="-ml-1 mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {loadingText}
      </span>
    ) : (
      children
    )}
  </button>
);

export const AuthLegal = ({ prefix }: { prefix: string }) => (
  <p className="m-0 mt-5 text-center font-sans text-xs leading-relaxed text-taupe-light">
    {prefix}{" "}
    <Link to="/terms-of-service" className="font-medium text-amber">
      Terms
    </Link>{" "}
    and{" "}
    <Link to="/privacy-policy" className="font-medium text-amber">
      Privacy Policy
    </Link>
  </p>
);
