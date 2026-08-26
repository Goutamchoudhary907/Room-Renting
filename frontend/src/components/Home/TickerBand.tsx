const TICKER_ITEMS = [
  { icon: "📍", label: "Indore" },
  { icon: "📍", label: "Pune" },
  { icon: "📍", label: "Bengaluru" },
  { icon: "📍", label: "Delhi" },
  { icon: "⚡", label: "Short-term stays" },
  { icon: "📅", label: "Long-term rentals" },
  { icon: "🔒", label: "Verified listings" },
  { icon: "⚡", label: "Instant booking" },
];
// Doubled so the marquee can loop seamlessly at -50%
const ITEMS = [...TICKER_ITEMS, ...TICKER_ITEMS];

/** Purely decorative infinite-scroll strip — no data binding. */
export const TickerBand = () => {
  return (
    <div className="mt-12 overflow-hidden bg-ink py-3.5">
      <div className="animate-rp-marquee flex w-max">
        {ITEMS.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-2 whitespace-nowrap px-7 font-sans text-[13px] font-medium text-cream/60"
          >
            <span className="text-gold">{item.icon}</span>
            {item.label}
            <span className="ml-7 h-1 w-1 rounded-full bg-gold/40" />
          </span>
        ))}
      </div>
    </div>
  );
};
