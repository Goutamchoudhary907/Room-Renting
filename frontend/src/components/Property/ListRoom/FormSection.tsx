import { useEffect, useState, type ReactNode } from "react";

export interface FormSectionDef {
  id: string;
  label: string;
}

export const FORM_SECTIONS: FormSectionDef[] = [
  { id: "details", label: "Details" },
  { id: "rental", label: "Rental & Type" },
  { id: "specification", label: "Specification" },
  { id: "amenities", label: "Amenities" },
  { id: "pricing", label: "Pricing" },
  { id: "location", label: "Location" },
];

interface FormSectionProps {
  id: string;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
}

export const FormSection = ({ id, title, icon, children }: FormSectionProps) => (
  <section
    id={id}
    className="mb-5 scroll-mt-24 rounded-3xl border border-cream-border bg-white p-6 shadow-[0_1px_3px_rgba(28,25,23,0.04)] sm:p-8"
  >
    <div className="mb-5 flex items-center gap-2.5">
      {icon && (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-amber/10 text-amber">
          {icon}
        </span>
      )}
      <h3 className="m-0 font-serif text-xl font-semibold text-ink sm:text-2xl">{title}</h3>
    </div>
    {children}
  </section>
);

export const SectionNav = () => {
  const [activeId, setActiveId] = useState(FORM_SECTIONS[0].id);

  useEffect(() => {
    const elements = FORM_SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-88px 0px -55% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleJump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="hidden w-[200px] shrink-0 lg:sticky lg:top-24 lg:block">
      <div className="flex flex-col gap-1">
        {FORM_SECTIONS.map((section, index) => {
          const isActive = activeId === section.id;
          return (
            <button
              key={section.id}
              onClick={() => handleJump(section.id)}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border-none px-4 py-3 text-left transition-colors ${
                isActive ? "bg-amber/6" : "bg-transparent hover:bg-cream-border-soft/60"
              }`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-sans text-xs font-bold ${
                  isActive ? "bg-ink text-gold" : "bg-cream-border-soft text-taupe-light"
                }`}
              >
                {index + 1}
              </span>
              <span
                className={`font-sans text-[13px] ${
                  isActive ? "font-semibold text-ink" : "font-medium text-taupe-light"
                }`}
              >
                {section.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
