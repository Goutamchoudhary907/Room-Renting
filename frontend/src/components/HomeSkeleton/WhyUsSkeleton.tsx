export const WhyUsSkeleton = () => {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-6 pb-20">
      <div className="mx-auto mb-12 max-w-xl text-center">
        <div className="mx-auto mb-3 h-3 w-28 rounded bg-cream-border-soft" />
        <div className="mx-auto h-9 w-80 max-w-full rounded bg-cream-border-soft" />
      </div>

      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="flex items-center gap-3.5 rounded-2xl border border-cream-border bg-white p-5">
            <div className="h-12 w-12 shrink-0 rounded-[14px] bg-cream-border-soft" />
            <div className="flex-1 space-y-2">
              <div className="h-5 w-16 rounded bg-cream-border-soft" />
              <div className="h-3 w-24 rounded bg-cream-border-soft" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="rounded-3xl border border-cream-border bg-white p-8 space-y-4">
            <div className="h-13 w-13 rounded-2xl bg-cream-border-soft" />
            <div className="h-6 w-1/2 rounded bg-cream-border-soft" />
            <div className="h-3 w-full rounded bg-cream-border-soft" />
            <div className="h-3 w-3/4 rounded bg-cream-border-soft" />
          </div>
        ))}
      </div>
    </div>
  );
};
