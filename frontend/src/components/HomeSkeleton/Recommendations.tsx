export const RecommendationSkeleton = () => {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-6 py-20">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-5">
        <div>
          <div className="mb-3 h-3 w-32 rounded bg-cream-border-soft" />
          <div className="h-10 w-72 rounded bg-cream-border-soft" />
        </div>
        <div className="h-11 w-40 rounded-full bg-cream-border-soft" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="rounded-[20px] border border-cream-border bg-white p-2.5">
            <div className="h-[180px] w-full rounded-[14px] bg-cream-border-soft" />
            <div className="px-2 pb-2 pt-3.5">
              <div className="mb-3 h-5 w-3/4 rounded bg-cream-border-soft" />
              <div className="mb-4 flex gap-1.5">
                <div className="h-5 w-16 rounded-full bg-cream-border-soft" />
                <div className="h-5 w-16 rounded-full bg-cream-border-soft" />
              </div>
              <div className="h-6 w-1/2 rounded bg-cream-border-soft" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
