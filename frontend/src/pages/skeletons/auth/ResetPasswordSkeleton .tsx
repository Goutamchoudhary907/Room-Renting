export const ResetPasswordSkeleton = () => {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left decorative panel — static, not a loading placeholder */}
      <div className="relative hidden flex-1 items-center justify-center overflow-hidden bg-ink p-12 md:flex">
        <div className="pointer-events-none absolute -left-16 -top-24 h-[400px] w-[400px] rounded-full bg-amber/20 blur-[100px]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-[350px] w-[350px] rounded-full bg-gold/12 blur-[80px]" />
      </div>

      {/* Right form panel */}
      <div className="flex flex-1 animate-pulse items-center justify-center bg-cream px-5 py-8 sm:px-12 sm:py-12">
        <div className="w-full max-w-[400px]">
          <div className="mb-4 h-7 w-36 rounded-full bg-cream-border-soft" />
          <div className="mb-2 h-10 w-4/5 rounded bg-cream-border-soft" />
          <div className="mb-9 h-4 w-64 rounded bg-cream-border-soft" />

          <div className="mb-7 flex flex-col gap-5">
            {[0, 1].map((i) => (
              <div key={i}>
                <div className="mb-2 h-3 w-32 rounded bg-cream-border-soft" />
                <div className="h-[50px] rounded-[14px] bg-cream-border-soft" />
              </div>
            ))}
          </div>

          <div className="h-[52px] w-full rounded-[14px] bg-cream-border-soft" />
          <div className="mx-auto mt-6 h-3 w-44 rounded bg-cream-border-soft" />
        </div>
      </div>
    </div>
  );
};
