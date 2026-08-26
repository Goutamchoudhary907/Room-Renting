import React from "react";

const FooterSkeleton: React.FC = () => {
  return (
    <footer className="animate-pulse border-t border-cream-border bg-white px-6 pt-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-[2fr_1fr_1fr] md:gap-12">
        <div>
          <div className="mb-4 h-8 w-24 rounded bg-cream-border-soft" />
          <div className="mb-2 h-4 w-48 rounded bg-cream-border-soft" />
          <div className="h-4 w-40 rounded bg-cream-border-soft" />
        </div>

        <div>
          <div className="mb-4 h-3 w-20 rounded bg-cream-border-soft" />
          <div className="space-y-3">
            <div className="h-3 w-16 rounded bg-cream-border-soft" />
            <div className="h-3 w-20 rounded bg-cream-border-soft" />
            <div className="h-3 w-16 rounded bg-cream-border-soft" />
          </div>
        </div>

        <div>
          <div className="mb-4 h-3 w-20 rounded bg-cream-border-soft" />
          <div className="space-y-3">
            <div className="h-3 w-24 rounded bg-cream-border-soft" />
            <div className="h-3 w-28 rounded bg-cream-border-soft" />
            <div className="h-3 w-24 rounded bg-cream-border-soft" />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-cream-border py-5 text-center">
        <div className="mx-auto h-3 w-40 rounded bg-cream-border-soft" />
      </div>
    </footer>
  );
};

export default FooterSkeleton;
