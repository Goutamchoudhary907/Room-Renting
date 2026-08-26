import IndoreImage from "../../assets/IndoreImage.png";
import PuneImage from "../../assets/PuneImage.png";
import BangloreImage from "../../assets/BangloreImage.jpg";
import DelhiImage from "../../assets/DelhiImage.png";
import { useNavigate } from "react-router-dom";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { ArrowUpRightIcon } from "./icons";

interface Destination {
  name: string;
  location: string;
  index: string;
  image: string;
  span: string;
  fontSize: string;
}

const DESTINATIONS: Destination[] = [
  { name: "Indore", location: "Indore", index: "01", image: IndoreImage, span: "md:col-span-2 md:row-span-2", fontSize: "text-4xl" },
  { name: "Pune", location: "Pune", index: "02", image: PuneImage, span: "", fontSize: "text-[28px]" },
  { name: "Bengaluru", location: "Bengaluru", index: "03", image: BangloreImage, span: "", fontSize: "text-[28px]" },
  { name: "Delhi", location: "Delhi", index: "04", image: DelhiImage, span: "md:col-span-2", fontSize: "text-[28px]" },
];

export const PopularDestinations = () => {
  const navigate = useNavigate();

  const handleLocationClick = (location: string) => {
    navigate(`/property/all-rooms?location=${encodeURIComponent(location)}`);
  };

  return (
    <section className="bg-cream-alt py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mb-12">
          <SectionHeader
            eyebrow="Top picks"
            heading="Popular destinations"
            description="Explore the cities our guests book the most — from business hubs to weekend escapes."
          />
        </Reveal>

        <div className="grid auto-rows-[200px] grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-4">
          {DESTINATIONS.map((dest, i) => (
            <Reveal key={dest.name} delay={i * 0.06} className={dest.span}>
              <div
                onClick={() => handleLocationClick(dest.location)}
                className="group relative h-full cursor-pointer overflow-hidden rounded-3xl shadow-[0_4px_16px_rgba(28,25,23,0.08)] transition-all duration-[400ms] hover:scale-[1.02] hover:shadow-[0_16px_40px_rgba(28,25,23,0.15)]"
              >
                <img src={dest.image} alt={dest.name} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 via-60% to-transparent" />
                {/* Ghost index */}
                <span className="absolute right-5 top-3.5 font-serif text-5xl font-semibold text-white/15">
                  {dest.index}
                </span>
                {/* Content */}
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="mb-1 font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
                    India
                  </div>
                  <div className="flex items-end justify-between gap-3">
                    <h3 className={`m-0 font-serif font-semibold text-white ${dest.fontSize}`}>{dest.name}</h3>
                    <div className="flex h-10 w-10 shrink-0 translate-y-2 items-center justify-center rounded-full bg-gradient-to-br from-amber to-[#d4944f] opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRightIcon size={18} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
