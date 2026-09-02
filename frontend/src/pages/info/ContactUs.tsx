import type { ReactNode } from "react";
import { Reveal } from "../../components/Home/Reveal";
import { ClockIcon, MailIcon, MapPinIcon, PhoneIcon } from "../../components/Home/icons";

interface ContactCard {
  title: string;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
  body: ReactNode;
}

const CONTACT_CARDS: ContactCard[] = [
  {
    title: "Email",
    icon: <MailIcon size={18} />,
    iconBg: "bg-amber/10",
    iconColor: "text-amber",
    body: (
      <a
        href="mailto:goutamchoudhary907@gmail.com"
        className="break-all font-sans text-[13px] text-amber hover:text-amber-dark"
      >
        goutamchoudhary907@gmail.com
      </a>
    ),
  },
  {
    title: "Phone",
    icon: <PhoneIcon size={18} />,
    iconBg: "bg-verified/10",
    iconColor: "text-verified",
    body: (
      <a href="tel:+919630594507" className="font-sans text-[13px] text-amber hover:text-amber-dark">
        +91 96305 94507
      </a>
    ),
  },
  {
    title: "Location",
    icon: <MapPinIcon size={18} />,
    iconBg: "bg-[rgba(59,130,246,0.1)]",
    iconColor: "text-[#3b82f6]",
    body: <p className="m-0 font-sans text-[13px] text-taupe">Indore, Madhya Pradesh, India</p>,
  },
  {
    title: "Response time",
    icon: <ClockIcon size={18} />,
    iconBg: "bg-gold/15",
    iconColor: "text-[#a08620]",
    body: <p className="m-0 font-sans text-[13px] text-taupe">We typically reply within 24 hours</p>,
  },
];

export const ContactUs = () => {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-[900px] px-6 pb-20 pt-12">
        {/* Header */}
        <Reveal className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber/15 bg-amber/8 px-3.5 py-1.5">
            <span className="font-sans text-[11px] font-bold uppercase tracking-[0.14em] text-amber">
              Get in touch
            </span>
          </div>
          <h1 className="m-0 mb-3 font-serif text-[clamp(32px,5vw,48px)] font-semibold leading-[1.1] tracking-tight text-ink">
            We'd love to hear from you
          </h1>
          <p className="m-0 font-sans text-[15px] leading-relaxed text-taupe">
            Have a question, feedback or need support? Reach us any of these ways.
          </p>
        </Reveal>

        {/* Contact cards */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {CONTACT_CARDS.map((card, i) => (
            <Reveal key={card.title} delay={0.05 + i * 0.05} className="h-full">
              <div className="h-full rounded-[20px] border border-cream-border bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(28,25,23,0.08)]">
                <div
                  className={`mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
                >
                  {card.icon}
                </div>
                <h3 className="m-0 mb-1 font-sans text-sm font-bold text-ink">{card.title}</h3>
                {card.body}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
};
