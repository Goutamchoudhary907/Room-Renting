import type { ReactNode } from "react";

interface SectionHeaderProps {
  eyebrow: string;
  heading: ReactNode;
  description?: string;
  align?: "center" | "left";
  /** "dark" is used on the dark CTA panel — swaps amber accents for gold */
  tone?: "light" | "dark";
  className?: string;
}

export const SectionHeader = ({
  eyebrow,
  heading,
  description,
  align = "center",
  tone = "light",
  className = "",
}: SectionHeaderProps) => {
  const accent = tone === "dark" ? "bg-gold" : "bg-amber";
  const eyebrowColor = tone === "dark" ? "text-gold" : "text-amber";
  const headingColor = tone === "dark" ? "text-white" : "text-ink";
  const bodyColor = tone === "dark" ? "text-white/50" : "text-taupe";

  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-xl text-center" : ""} ${className}`}
    >
      <div className={`mb-3 flex items-center gap-2 ${align === "center" ? "justify-center" : ""}`}>
        {align === "center" && <div className={`h-0.5 w-5 ${accent}`} />}
        <span className={`font-sans text-[11px] font-bold uppercase tracking-[0.18em] ${eyebrowColor}`}>
          {eyebrow}
        </span>
        {align === "center" && <div className={`h-0.5 w-5 ${accent}`} />}
      </div>
      <h2
        className={`font-serif text-[clamp(30px,4vw,48px)] font-semibold leading-[1.1] tracking-tight ${headingColor} ${
          description ? "mb-3" : "m-0"
        }`}
      >
        {heading}
      </h2>
      {description && <p className={`m-0 font-sans text-[15px] leading-relaxed ${bodyColor}`}>{description}</p>}
    </div>
  );
};
