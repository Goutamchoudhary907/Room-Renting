export const PopularDestinationsSkeleton = () => {
  return (
    <div className="animate-pulse bg-cream-alt py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <div className="mx-auto mb-3 h-3 w-24 rounded bg-cream-border-soft" />
          <div className="mx-auto h-9 w-72 max-w-full rounded bg-cream-border-soft" />
        </div>

        <div className="grid auto-rows-[200px] grid-cols-1 gap-4 min-[480px]:grid-cols-2 md:grid-cols-4">
          <div className="rounded-3xl bg-cream-border-soft md:col-span-2 md:row-span-2" />
          <div className="rounded-3xl bg-cream-border-soft" />
          <div className="rounded-3xl bg-cream-border-soft" />
          <div className="rounded-3xl bg-cream-border-soft md:col-span-2" />
        </div>
      </div>
    </div>
  );
};
