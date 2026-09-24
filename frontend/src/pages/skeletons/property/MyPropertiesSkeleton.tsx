export default function MyPropertiesSkeleton() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-[1000px] animate-pulse px-6 pb-20 pt-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 h-3 w-24 rounded bg-cream-border-soft" />
            <div className="h-9 w-56 rounded bg-cream-border-soft" />
          </div>
          <div className="h-11 w-40 rounded-full bg-cream-border-soft" />
        </div>

        {/* Stats */}
        <div className="mb-9 grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-[18px] border border-cream-border bg-white p-5">
              <div className="mb-2.5 h-10 w-10 rounded-xl bg-cream-border-soft" />
              <div className="h-7 w-12 rounded bg-cream-border-soft" />
              <div className="mt-2 h-3 w-24 rounded bg-cream-border-soft" />
            </div>
          ))}
        </div>

        {/* Search + filters */}
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="h-11 rounded-[14px] bg-white lg:w-[320px]" />
          <div className="h-11 w-[320px] rounded-[14px] bg-white" />
        </div>

        {/* Property list */}
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="rounded-[20px] border border-cream-border bg-white p-3">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="h-[180px] w-full shrink-0 rounded-[14px] bg-cream-border-soft sm:h-[160px] sm:w-[220px]" />
                <div className="flex-1 space-y-3 py-1.5">
                  <div className="flex gap-2">
                    <div className="h-6 w-20 rounded-full bg-cream-border-soft" />
                    <div className="h-6 w-20 rounded-full bg-cream-border-soft" />
                  </div>
                  <div className="h-6 w-2/3 rounded bg-cream-border-soft" />
                  <div className="h-3 w-1/3 rounded bg-cream-border-soft" />
                  <div className="h-10 w-full rounded bg-cream-border-soft" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
