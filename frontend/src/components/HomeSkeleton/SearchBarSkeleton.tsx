export const SearchBarSkeleton = () => {
  return (
    <section className="flex min-h-[85vh] animate-pulse items-start justify-center bg-cream px-6 pt-12 sm:pt-[72px]">
      <div className="flex w-full max-w-6xl flex-wrap items-center gap-14">
        <div className="min-w-[320px] max-w-[600px] flex-1">
          <div className="mb-6 h-7 w-64 rounded-full bg-cream-border-soft" />
          <div className="mb-3 h-12 w-full rounded-lg bg-cream-border-soft" />
          <div className="mb-5 h-12 w-4/5 rounded-lg bg-cream-border-soft" />
          <div className="mb-7 h-4 w-full max-w-[420px] rounded bg-cream-border-soft" />
          <div className="mb-5 h-11 w-72 rounded-full bg-cream-border-soft" />
          <div className="h-24 w-full max-w-[560px] rounded-[20px] bg-cream-border-soft" />
          <div className="mt-8 h-9 w-full max-w-[480px] rounded bg-cream-border-soft" />
        </div>
        <div className="hidden h-[520px] min-w-[320px] max-w-[480px] flex-1 rounded-[32px] bg-cream-border-soft md:block" />
      </div>
    </section>
  );
};
