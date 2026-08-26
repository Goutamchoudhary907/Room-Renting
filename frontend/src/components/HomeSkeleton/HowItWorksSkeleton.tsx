export const HowItWorksSkeleton = () => {
  return (
    <div className="animate-pulse py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto mb-14 max-w-xl text-center">
          <div className="mx-auto mb-3 h-3 w-28 rounded bg-cream-border-soft" />
          <div className="mx-auto h-9 w-80 max-w-full rounded bg-cream-border-soft" />
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-10">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col items-center">
              <div className="h-[200px] w-[200px] rounded-[28px] bg-cream-border-soft" />
              <div className="-mt-4 h-8 w-24 rounded-full bg-cream-border" />
              <div className="mt-[18px] h-6 w-32 rounded bg-cream-border-soft" />
              <div className="mt-2 h-3 w-48 rounded bg-cream-border-soft" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
