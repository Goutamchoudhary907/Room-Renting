export default function ListRoomSkeleton() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto flex max-w-[1000px] animate-pulse items-start gap-12 px-6 pb-20 pt-8">
        {/* Section nav */}
        <div className="hidden w-[200px] shrink-0 flex-col gap-1 lg:flex">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="h-7 w-7 shrink-0 rounded-lg bg-cream-border-soft" />
              <div className="h-3 w-24 rounded bg-cream-border-soft" />
            </div>
          ))}
        </div>

        {/* Form column */}
        <div className="min-w-0 flex-1">
          <div className="mb-8">
            <div className="mb-3 h-3 w-24 rounded bg-cream-border-soft" />
            <div className="mb-2 h-9 w-64 rounded bg-cream-border-soft" />
            <div className="h-4 w-80 max-w-full rounded bg-cream-border-soft" />
          </div>

          <div className="mb-5 h-28 rounded-2xl border border-cream-border bg-white" />

          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-5 rounded-3xl border border-cream-border bg-white p-6 sm:p-8">
              <div className="mb-5 flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-[10px] bg-cream-border-soft" />
                <div className="h-6 w-40 rounded bg-cream-border-soft" />
              </div>
              <div className="space-y-4">
                <div className="h-12 rounded-[14px] bg-cream-border-soft" />
                <div className="h-12 rounded-[14px] bg-cream-border-soft" />
              </div>
            </div>
          ))}

          <div className="flex justify-end">
            <div className="h-12 w-40 rounded-[14px] bg-cream-border-soft" />
          </div>
        </div>
      </div>
    </div>
  );
}
