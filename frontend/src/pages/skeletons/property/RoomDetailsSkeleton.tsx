export const RoomDetailsSkeleton = () => {
  return (
    <div className="min-h-screen animate-pulse bg-cream">
      {/* Breadcrumb */}
      <div className="mx-auto max-w-6xl px-6 pt-5">
        <div className="h-3 w-56 rounded bg-cream-border-soft" />
      </div>

      {/* Gallery */}
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="grid grid-cols-1 gap-2.5 overflow-hidden rounded-3xl md:grid-cols-[2fr_1fr] md:grid-rows-[195px_195px]">
          <div className="h-[240px] bg-cream-border-soft sm:h-[300px] md:row-span-2 md:h-full" />
          <div className="hidden bg-cream-border-soft md:block md:h-full" />
          <div className="hidden bg-cream-border-soft md:block md:h-full" />
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-6">
        <div className="flex flex-col items-start gap-10 lg:flex-row">
          <div className="min-w-0 flex-1">
            {/* Title + meta */}
            <div className="mb-8">
              <div className="mb-3 flex gap-2">
                <div className="h-7 w-20 rounded-full bg-cream-border-soft" />
                <div className="h-7 w-24 rounded-full bg-cream-border-soft" />
              </div>
              <div className="mb-3 h-10 w-3/4 rounded bg-cream-border-soft" />
              <div className="h-4 w-1/3 rounded bg-cream-border-soft" />
            </div>

            {/* Host card */}
            <div className="mb-8 flex items-center gap-3.5 rounded-2xl border border-cream-border bg-white p-5">
              <div className="h-13 w-13 shrink-0 rounded-full bg-cream-border-soft" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 rounded bg-cream-border-soft" />
                <div className="h-3 w-32 rounded bg-cream-border-soft" />
              </div>
            </div>

            {/* Description */}
            <div className="mb-8 space-y-3">
              <div className="h-7 w-48 rounded bg-cream-border-soft" />
              <div className="h-4 w-full rounded bg-cream-border-soft" />
              <div className="h-4 w-5/6 rounded bg-cream-border-soft" />
              <div className="h-4 w-3/4 rounded bg-cream-border-soft" />
            </div>

            {/* Key details */}
            <div className="mb-8 grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[104px] rounded-[14px] border border-cream-border bg-white" />
              ))}
            </div>

            {/* Amenities */}
            <div className="mb-8 space-y-3">
              <div className="h-7 w-36 rounded bg-cream-border-soft" />
              <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-16 rounded-xl border border-cream-border bg-white" />
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="space-y-3">
              <div className="h-7 w-32 rounded bg-cream-border-soft" />
              <div className="h-96 rounded-lg bg-cream-border-soft" />
            </div>
          </div>

          {/* Booking card */}
          <div className="w-full lg:w-[360px] lg:shrink-0">
            <div className="space-y-4 rounded-3xl border border-cream-border bg-white p-7">
              <div className="h-10 w-40 rounded bg-cream-border-soft" />
              <div className="grid grid-cols-2 gap-2.5">
                <div className="h-16 rounded-xl bg-cream-border-soft" />
                <div className="h-16 rounded-xl bg-cream-border-soft" />
              </div>
              <div className="h-20 rounded bg-cream-border-soft" />
              <div className="h-14 rounded-[14px] bg-cream-border-soft" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsSkeleton;
