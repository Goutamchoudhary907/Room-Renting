export const ListingAndSearchCardSkeleton = () => {
  return (
    <div className="mx-auto max-w-6xl animate-pulse px-6 pb-20">
      <div className="rounded-[36px] bg-ink/90 px-6 py-16 sm:px-12">
        <div className="mx-auto mb-12 max-w-xl text-center">
          <div className="mx-auto mb-3 h-3 w-24 rounded bg-white/10" />
          <div className="mx-auto h-9 w-72 max-w-full rounded bg-white/10" />
        </div>
        <div className="mx-auto grid max-w-[720px] grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="h-56 rounded-3xl bg-cream/80" />
          <div className="h-56 rounded-3xl bg-cream/80" />
        </div>
      </div>
    </div>
  );
};
