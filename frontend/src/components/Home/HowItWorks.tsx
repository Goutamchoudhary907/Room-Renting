import WorkStep1 from "../../assets/Work1.jpg";
import WorkStep2 from "../../assets/Work2.jpg";
import WorkStep3 from "../../assets/Work3.jpg";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { KeyIcon, SearchIcon, ZapIcon } from "./icons";
import type { ReactNode } from "react";

interface Step {
  number: string;
  label: string;
  caption: string;
  image: string;
  tilt: string;
  icon: ReactNode;
}

const STEPS: Step[] = [
  {
    number: "01",
    label: "Search & find",
    caption: "Browse our curated selection of verified rooms, homes and studios.",
    image: WorkStep1,
    tilt: "-rotate-2",
    icon: <SearchIcon size={16} />,
  },
  {
    number: "02",
    label: "Book instantly",
    caption: "Lock in your dates with secure payment and instant confirmation.",
    image: WorkStep2,
    tilt: "rotate-2",
    icon: <ZapIcon size={16} />,
  },
  {
    number: "03",
    label: "Move in & enjoy",
    caption: "Collect your keys and settle into a comfortable, memorable stay.",
    image: WorkStep3,
    tilt: "-rotate-1",
    icon: <KeyIcon size={16} />,
  },
];

export const HowItWorks = () => {
  return (
    <section className="relative overflow-hidden py-20">
      <div className="pointer-events-none absolute left-[-80px] top-[60px] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(181,112,60,0.08),transparent_70%)]" />
      <div className="pointer-events-none absolute bottom-10 right-[-80px] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle,rgba(232,193,122,0.1),transparent_70%)]" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="mb-14">
          <SectionHeader
            eyebrow="How it works"
            heading="Three steps to your next stay"
            description="From browsing to check-in, the whole journey takes just a few minutes."
          />
        </Reveal>

        <div className="relative grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-10">
          {/* Connector line (desktop only) */}
          <div className="pointer-events-none absolute left-[18%] right-[18%] top-[110px] z-0 hidden border-t-2 border-dashed border-amber/25 sm:block" />

          {STEPS.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1} className="relative z-[1] flex flex-col items-center text-center">
              {/* Ghost number */}
              <span className="pointer-events-none absolute -top-6 z-0 font-serif text-[100px] font-semibold leading-none text-gold/15">
                {step.number}
              </span>
              {/* Image */}
              <div
                className={`relative z-[1] h-[200px] w-[200px] overflow-hidden rounded-[28px] border-[6px] border-white shadow-[0_12px_32px_rgba(28,25,23,0.1)] transition-transform duration-500 ${step.tilt}`}
              >
                <img src={step.image} alt={step.label} className="h-full w-full object-cover" />
              </div>
              {/* Step chip */}
              <div className="relative z-[2] -mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink px-[18px] py-2 font-sans text-xs font-bold text-gold shadow-[0_4px_12px_rgba(28,25,23,0.2)]">
                {step.icon}
                Step {step.number}
              </div>
              <h3 className="mb-2 mt-[18px] font-serif text-2xl font-semibold tracking-tight text-ink">
                {step.label}
              </h3>
              <p className="m-0 max-w-[260px] font-sans text-sm leading-relaxed text-taupe">{step.caption}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
