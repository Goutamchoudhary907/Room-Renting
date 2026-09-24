import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { CheckIcon, CreditCardIcon, HeadphonesIcon, HouseIcon, MapPinIcon, ShieldIcon, TagIcon, ZapIcon } from "./icons";
import type { ReactNode } from "react";

interface StatCard {
  value: string;
  label: string;
  hint: string;
  iconBg: string;
  iconColor: string;
  icon: ReactNode;
}

const STAT_CARDS: StatCard[] = [
  { value: "500+", label: "Verified rooms", hint: "ready to book", iconBg: "bg-amber/10", iconColor: "text-amber", icon: <HouseIcon /> },
  { value: "4", label: "Cities", hint: "and growing", iconBg: "bg-gold/15", iconColor: "text-[#a08620]", icon: <MapPinIcon /> },
  { value: "₹0", label: "Hidden fees", hint: "ever", iconBg: "bg-verified/10", iconColor: "text-verified", icon: <TagIcon /> },
  { value: "24/7", label: "Support", hint: "real humans", iconBg: "bg-[rgba(107,85,175,0.1)]", iconColor: "text-[#6b55af]", icon: <HeadphonesIcon /> },
];

interface FeatureCard {
  title: string;
  content: string;
  chips: string[];
  iconBg: string;
  iconColor: string;
  icon: ReactNode;
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    title: "Book in minutes",
    content: "No brokers, no endless calls. Pick your dates, pay securely and your stay is locked in with instant confirmation.",
    chips: ["Instant confirmation", "No paperwork"],
    iconBg: "bg-amber/10",
    iconColor: "text-amber",
    icon: <ZapIcon />,
  },
  {
    title: "Listings you can trust",
    content: "Every home, studio and room is verified — so what you see in photos is exactly what you get at check-in.",
    chips: ["Verified hosts", "Real photos"],
    iconBg: "bg-[rgba(59,130,246,0.1)]",
    iconColor: "text-[#3b82f6]",
    icon: <ShieldIcon />,
  },
  {
    title: "Pay safely, stay covered",
    content: "Encrypted payments with clear refund states — your money is always accounted for, from booking to checkout.",
    chips: ["Secure gateway", "Clear refunds"],
    iconBg: "bg-verified/10",
    iconColor: "text-verified",
    icon: <CreditCardIcon />,
  },
];

export const WhyUs = () => {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <Reveal className="mb-12">
        <SectionHeader
          eyebrow="Why Rentpy"
          heading="Renting, made refreshingly simple"
          description="Everything you need to find and book a place you'll love — without the usual hassle."
        />
      </Reveal>

      {/* Stat cards */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.05}>
            <div className="flex items-center gap-3.5 rounded-2xl border border-cream-border bg-white p-5 shadow-[0_1px_3px_rgba(28,25,23,0.04)] transition-all duration-[350ms] hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(28,25,23,0.08)]">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] ${stat.iconBg} ${stat.iconColor}`}>
                {stat.icon}
              </div>
              <div>
                <div className="font-serif text-[28px] font-semibold leading-none text-ink">{stat.value}</div>
                <div className="mt-0.5 font-sans text-xs text-taupe">
                  <span className="font-semibold text-ink-soft">{stat.label}</span> · {stat.hint}
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURE_CARDS.map((feat, i) => (
          <Reveal key={feat.title} delay={i * 0.08} className="h-full">
            <div className="flex h-full flex-col rounded-3xl border border-cream-border bg-white p-8 shadow-[0_1px_3px_rgba(28,25,23,0.04)] transition-all duration-[400ms] hover:-translate-y-1 hover:border-amber/25 hover:shadow-[0_16px_36px_rgba(28,25,23,0.1)]">
              <div className={`mb-5 flex h-13 w-13 items-center justify-center rounded-2xl ${feat.iconBg} ${feat.iconColor}`}>
                {feat.icon}
              </div>
              <h3 className="mb-2.5 font-serif text-2xl font-semibold tracking-tight text-ink">{feat.title}</h3>
              <p className="mb-5 flex-1 font-sans text-sm leading-relaxed text-taupe">{feat.content}</p>
              <div className="mt-auto flex flex-wrap gap-2">
                {feat.chips.map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-[5px] rounded-full bg-cream px-3.5 py-1.5 font-sans text-[11px] font-bold text-ink-soft"
                  >
                    <CheckIcon className="text-amber" />
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};
