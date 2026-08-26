import { useNavigate } from "react-router-dom";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { ArrowRightIcon, HouseIcon, SearchIcon } from "./icons";

export const ListingAndSearchCard = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20">
      <div className="relative overflow-hidden rounded-[36px] bg-ink px-6 py-16 sm:px-12">
        {/* Glows */}
        <div className="pointer-events-none absolute -left-16 -top-20 h-[300px] w-[300px] rounded-full bg-amber/20 blur-[80px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-16 h-[300px] w-[300px] rounded-full bg-gold/12 blur-[80px]" />
        {/* Dot texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            maskImage: "radial-gradient(ellipse 65% 65% at 50% 50%, black, transparent)",
            WebkitMaskImage: "radial-gradient(ellipse 65% 65% at 50% 50%, black, transparent)",
          }}
        />

        <Reveal className="relative z-[1] mb-12">
          <SectionHeader
            tone="dark"
            eyebrow="Get started"
            heading={
              <>
                Ready to make your <em className="font-medium italic text-gold">next move</em>?
              </>
            }
            description="Whether you have a room to share or a stay to find — it starts here."
          />
        </Reveal>

        <div className="relative z-[1] mx-auto grid max-w-[720px] grid-cols-1 gap-5 sm:grid-cols-2">
          <Reveal delay={0.05}>
            <ActionCard
              icon={<HouseIcon />}
              iconBg="bg-amber/10"
              iconColor="text-amber"
              title="List your room"
              description="Become a host and earn money by renting out your space."
              buttonText="Start listing"
              onClick={() => navigate("/property/create")}
              variant="solid"
            />
          </Reveal>
          <Reveal delay={0.1}>
            <ActionCard
              icon={<SearchIcon size={24} />}
              iconBg="bg-[rgba(59,130,246,0.1)]"
              iconColor="text-[#3b82f6]"
              title="Find your room"
              description="Browse thousands of verified rooms and find your perfect match."
              buttonText="Start searching"
              onClick={() => navigate("/property/all-rooms")}
              variant="outline"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
};

interface ActionCardProps {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
  variant: "solid" | "outline";
}

const ActionCard = ({ icon, iconBg, iconColor, title, description, buttonText, onClick, variant }: ActionCardProps) => {
  return (
    <div className="h-full rounded-3xl bg-cream p-8 transition-all duration-[350ms]">
      <div className={`mb-[18px] flex h-13 w-13 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}>
        {icon}
      </div>
      <h3 className="mb-2 font-serif text-2xl font-semibold text-ink">{title}</h3>
      <p className="mb-5 font-sans text-sm leading-relaxed text-taupe">{description}</p>
      <button
        onClick={onClick}
        className={`group flex cursor-pointer items-center gap-2 rounded-full border-none px-6 py-3 font-sans text-[13px] font-semibold transition-all hover:gap-3 ${
          variant === "solid"
            ? "bg-ink text-cream shadow-[0_4px_16px_rgba(28,25,23,0.2)]"
            : "bg-transparent text-ink shadow-[inset_0_0_0_1.5px_#e8e4de]"
        }`}
      >
        {buttonText}
        <ArrowRightIcon />
      </button>
    </div>
  );
};
