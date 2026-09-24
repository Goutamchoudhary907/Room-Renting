export const SearchFieldsSkeleton = () => {
  return (
    <div className="animate-pulse rounded-2xl border border-cream-border bg-cream p-1.5">
      <div className="flex flex-col gap-1.5 md:flex-row md:items-stretch md:gap-0.5">
        <div className="h-11 flex-[2] rounded-xl bg-white" />
        <div className="h-11 rounded-xl bg-white md:w-32" />
        <div className="h-11 rounded-xl bg-white md:w-32" />
        <div className="h-11 rounded-xl bg-cream-border-soft md:w-28" />
      </div>
    </div>
  );
};
