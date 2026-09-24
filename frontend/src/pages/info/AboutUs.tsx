import { Reveal } from "../../components/Home/Reveal";
import { EyeIcon, HeartIcon, ShieldIcon, ZapIcon } from "../../components/Home/icons";
import type { ReactNode } from "react";

interface Value {
  title: string;
  desc: string;
  iconBg: string;
  iconColor: string;
  icon: ReactNode;
}

const VALUES: Value[] = [
  {
    title: "Trust first",
    desc: "Every listing is verified before it goes live. What you see is what you get.",
    iconBg: "bg-amber/10",
    iconColor: "text-amber",
    icon: <ShieldIcon size={20} />,
  },
  {
    title: "No hidden fees",
    desc: "The price you see is the price you pay. Zero broker fees, zero surprises.",
    iconBg: "bg-verified/10",
    iconColor: "text-verified",
    icon: <ZapIcon size={20} />,
  },
  {
    title: "Guest-centric",
    desc: "Built around what renters actually need — fast booking, clear info and real support.",
    iconBg: "bg-[rgba(59,130,246,0.1)]",
    iconColor: "text-[#3b82f6]",
    icon: <HeartIcon size={20} />,
  },
  {
    title: "Transparency",
    desc: "Real photos, honest descriptions and genuine reviews from past guests.",
    iconBg: "bg-gold/15",
    iconColor: "text-[#a08620]",
    icon: <EyeIcon size={20} />,
  },
];

export const AboutUs = () => {
  return (
    <div className="mx-auto max-w-[800px] bg-cream px-6 pb-20 pt-12">
      {/* Hero */}
      <Reveal className="mb-14 text-center">
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber/15 bg-amber/8 px-3.5 py-1.5">
          <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-amber">Our story</span>
        </div>
        <h1 className="mx-auto mb-4 font-serif text-[clamp(32px,5vw,52px)] font-semibold leading-[1.1] tracking-tight text-ink">
          Making renting simple, honest and <em className="font-medium italic text-amber">human</em>
        </h1>
        <p className="mx-auto max-w-[560px] font-sans text-base leading-relaxed text-taupe">
          Rentpy was born from a simple frustration — finding a decent room in India shouldn&apos;t require dozens
          of calls, broker fees and guesswork. We&apos;re building the platform we wished existed.
        </p>
      </Reveal>

      {/* Mission */}
      <Reveal delay={0.1} className="mb-10 rounded-3xl border border-cream-border bg-white p-10">
        <h2 className="mb-3.5 font-serif text-[28px] font-semibold text-ink">Our Mission</h2>
        <p className="m-0 font-sans text-[15px] leading-[1.75] text-taupe">
          To create a rental marketplace where every listing is verified, every price is transparent and every
          booking is instant. No hidden fees, no middlemen — just you and your next home, connected in minutes.
        </p>
      </Reveal>

      {/* Values */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {VALUES.map((v, i) => (
          <Reveal key={v.title} delay={0.15 + i * 0.05}>
            <div className="h-full rounded-[20px] border border-cream-border bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(28,25,23,0.08)]">
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-[14px] ${v.iconBg} ${v.iconColor}`}>
                {v.icon}
              </div>
              <h3 className="mb-2 font-serif text-[22px] font-semibold text-ink">{v.title}</h3>
              <p className="m-0 font-sans text-sm leading-relaxed text-taupe">{v.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Team note */}
      <Reveal delay={0.3} className="rounded-3xl bg-ink px-6 py-10 text-center sm:px-10">
        <h2 className="mb-3 font-serif text-[28px] font-semibold text-white">Built with care</h2>
        <p className="mx-auto max-w-[480px] font-sans text-[15px] leading-[1.7] text-white/50">
          Rentpy is a solo project by Goutam Choudhary — designed, coded and maintained with the goal of making
          renting better for everyone in India.
        </p>
        <div className="mt-7 flex justify-center gap-8">
          <div>
            <div className="font-serif text-[28px] font-semibold text-gold">500+</div>
            <div className="font-sans text-xs text-white/30">Rooms listed</div>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <div className="font-serif text-[28px] font-semibold text-gold">4</div>
            <div className="font-sans text-xs text-white/30">Cities</div>
          </div>
          <div className="w-px bg-white/10" />
          <div>
            <div className="font-serif text-[28px] font-semibold text-gold">24/7</div>
            <div className="font-sans text-xs text-white/30">Support</div>
          </div>
        </div>
      </Reveal>
    </div>
  );
};
