import { useAuth } from "../../context/AuthContext";
import { HeroSearchFields } from "./HeroSearchFields";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SearchBarSkeleton } from "../HomeSkeleton/SearchBarSkeleton";
import { CalendarIcon, CheckIcon, ClockIcon, ShieldIcon } from "./icons";

export const SearchBar = () => {
  const { user, isLoading } = useAuth();
  const isLoggedIn = !!user;
  const [rentalType, setRentalType] = useState<string | null>(null);

  const navigate = useNavigate();
  const handleSearch = (
    location: string,
    checkin: Date | null,
    checkout: Date | null
  ) => {
    const queryParams = new URLSearchParams();

    if (location) queryParams.set("location", location);
    if (checkin)
      queryParams.set(
        "checkin",
        checkin ? checkin.toISOString().split("T")[0] : ""
      );
    if (checkout)
      queryParams.set(
        "checkout",
        checkout ? checkout.toISOString().split("T")[0] : ""
      );
    if (rentalType) queryParams.set("rentalType", rentalType);

    navigate(`/property/all-rooms?${queryParams.toString()}`);
  };
  const handleRentalTypeClick = (type: string) => {
    // Toggle selection - if same type is clicked again, deselect it
    setRentalType((prev) => (prev === type ? null : type));
  };

  if (isLoading) {
    return <SearchBarSkeleton />;
  }

  return (
    <section className="relative flex min-h-[85vh] items-start justify-center overflow-hidden bg-cream px-6 pt-12 sm:pt-[72px]">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -right-16 -top-20 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(181,112,60,0.12),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle,rgba(232,193,122,0.15),transparent_70%)]" />
      {/* Dot pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(28,25,23,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
        }}
      />

      <div className="relative z-[2] flex w-full max-w-6xl flex-wrap items-center gap-14">
        {/* Left column */}
        <div className="min-w-[320px] max-w-[600px] flex-1">
          {/* Eyebrow */}
          <div className="animate-rp-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-amber/20 bg-amber/10 py-1.5 pl-3 pr-4">
            <div className="animate-rp-pulse-dot h-1.5 w-1.5 rounded-full bg-amber" />
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.16em] text-amber">
              India&apos;s flexible rental platform
            </span>
          </div>

          {/* Headline */}
          {isLoggedIn && user ? (
            <h1
              className="animate-rp-fade-up mb-5 font-serif text-[clamp(38px,5.5vw,64px)] font-semibold leading-[1.06] tracking-tight text-ink"
              style={{ animationDelay: "0.1s" }}
            >
              Welcome back, <em className="font-medium italic text-amber">{user.firstName}</em>.
            </h1>
          ) : (
            <h1
              className="animate-rp-fade-up mb-5 font-serif text-[clamp(38px,5.5vw,64px)] font-semibold leading-[1.06] tracking-tight text-ink"
              style={{ animationDelay: "0.1s" }}
            >
              A place that feels like <em className="font-medium italic text-amber">home</em>, for a night or a
              year.
            </h1>
          )}

          <p
            className="animate-rp-fade-up mb-7 max-w-[480px] font-sans text-base leading-relaxed text-taupe"
            style={{ animationDelay: "0.2s" }}
          >
            {isLoggedIn
              ? "Ready to explore? Pick up your search or check what's coming up next."
              : "Verified rooms, transparent prices and instant booking — rentals that flex around your life, not the other way around."}
          </p>

          {/* Rental type toggle */}
          <div
            className="animate-rp-fade-up mb-5 inline-flex rounded-full border border-cream-border bg-white p-[5px] shadow-[0_1px_4px_rgba(28,25,23,0.06)]"
            style={{ animationDelay: "0.25s" }}
          >
            <button
              type="button"
              onClick={() => handleRentalTypeClick("short-term")}
              className={`flex cursor-pointer items-center gap-[7px] rounded-full border-none px-5 py-2.5 font-sans text-[13px] font-semibold transition-all duration-300 ${
                rentalType === "short-term" || rentalType === null
                  ? "bg-ink text-gold"
                  : "bg-transparent text-taupe hover:bg-cream"
              }`}
            >
              <ClockIcon />
              Short-Term Stays
            </button>
            <button
              type="button"
              onClick={() => handleRentalTypeClick("long-term")}
              className={`flex cursor-pointer items-center gap-[7px] rounded-full border-none px-5 py-2.5 font-sans text-[13px] font-semibold transition-all duration-300 ${
                rentalType === "long-term"
                  ? "bg-ink text-gold"
                  : "bg-transparent text-taupe hover:bg-cream"
              }`}
            >
              <CalendarIcon />
              Long-Term Rentals
            </button>
          </div>

          {/* Search card */}
          <div className="animate-rp-fade-up" style={{ animationDelay: "0.3s" }}>
            <HeroSearchFields onSearch={handleSearch} />
          </div>

          {/* Trust row */}
          <div
            className="animate-rp-fade-up mt-8 flex flex-col flex-wrap items-start gap-4 sm:flex-row sm:items-center sm:gap-6"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-verified/10">
                <ShieldIcon size={18} strokeWidth={2.5} className="text-verified" />
              </div>
              <div>
                <div className="font-sans text-[13px] font-semibold text-ink">100% Verified</div>
                <div className="mt-px font-sans text-[11px] text-taupe-light">Every listing checked</div>
              </div>
            </div>
            <div className="hidden h-8 w-px bg-cream-border sm:block" />
            <div className="flex gap-7">
              <div>
                <div className="font-serif text-[26px] font-semibold leading-none text-ink">500+</div>
                <div className="mt-0.5 font-sans text-[11px] text-taupe-light">Verified rooms</div>
              </div>
              <div>
                <div className="font-serif text-[26px] font-semibold leading-none text-ink">4</div>
                <div className="mt-0.5 font-sans text-[11px] text-taupe-light">Cities &amp; growing</div>
              </div>
              <div>
                <div className="font-serif text-[26px] font-semibold leading-none text-ink">24/7</div>
                <div className="mt-0.5 font-sans text-[11px] text-taupe-light">Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: hero image collage */}
        <div className="relative hidden h-[520px] min-w-[320px] max-w-[480px] flex-1 md:block">
          {/* Backdrop shape */}
          <div className="absolute -right-3 -top-3 bottom-6 left-6 rotate-3 rounded-[40px] bg-gradient-to-br from-amber/15 to-gold/10" />
          {/* Main image placeholder */}
          <div
            className="absolute inset-y-2.5 left-2.5 right-0 -rotate-1 overflow-hidden rounded-[32px] border-[6px] border-white shadow-[0_24px_48px_rgba(28,25,23,0.12)]"
            style={{
              background:
                "repeating-linear-gradient(45deg, #f0ebe4, #f0ebe4 10px, #e8e3dc 10px, #e8e3dc 20px)",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-cream/40">
              <span className="rounded-lg border border-dashed border-[#ccc] bg-white/90 px-4 py-2 font-mono text-[13px] text-taupe-light">
                hero photo · beautiful stay
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent to-50%" />
          </div>

          {/* Floating mini card */}
          <div className="animate-rp-float absolute left-[-24px] top-[60px] z-[3] w-[180px] rounded-[18px] border border-cream-border bg-white p-2.5 shadow-[0_12px_32px_rgba(28,25,23,0.1)]">
            <div
              className="h-[72px] overflow-hidden rounded-xl"
              style={{
                background:
                  "repeating-linear-gradient(45deg, #f0ebe4, #f0ebe4 8px, #e8e3dc 8px, #e8e3dc 16px)",
              }}
            >
              <div className="flex h-full items-center justify-center">
                <span className="font-mono text-[10px] text-taupe-light">room photo</span>
              </div>
            </div>
            <div className="px-1 pb-0.5 pt-1.5">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap font-sans text-xs font-bold text-ink">
                Cozy studio · Pune
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="font-serif text-lg font-semibold text-amber">
                  ₹1,499<span className="ml-0.5 font-sans text-[10px] font-medium text-taupe-light">/night</span>
                </span>
                <span className="flex items-center gap-[3px] font-sans text-[9px] font-bold text-verified">
                  <CheckIcon size={9} strokeWidth={3} />
                  Verified
                </span>
              </div>
            </div>
          </div>

          {/* Floating booking toast */}
          <div
            className="animate-rp-float-slow absolute bottom-20 right-[-16px] z-[3] flex items-center gap-2.5 rounded-full border border-cream-border bg-white py-2 pl-2 pr-5 shadow-[0_12px_32px_rgba(28,25,23,0.1)]"
            style={{ animationDelay: "1.5s" }}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e6f5ec]">
              <CheckIcon size={16} strokeWidth={2.5} className="text-verified" />
            </div>
            <div>
              <div className="font-sans text-xs font-bold text-ink">Booking confirmed</div>
              <div className="font-sans text-[10px] text-taupe-light">Just now · Bengaluru</div>
            </div>
          </div>

          {/* Verified chip */}
          <div className="animate-rp-float-slow absolute -top-2 right-5 z-[3] rounded-2xl bg-ink px-[18px] py-3 shadow-[0_8px_24px_rgba(28,25,23,0.2)]">
            <div className="flex items-center gap-1.5 font-sans text-sm font-semibold leading-none text-gold">
              <CheckIcon size={16} strokeWidth={2.5} />
              Verified
            </div>
            <div className="mt-[3px] font-sans text-[10px] text-white/50">All listings</div>
          </div>
        </div>
      </div>
    </section>
  );
};
