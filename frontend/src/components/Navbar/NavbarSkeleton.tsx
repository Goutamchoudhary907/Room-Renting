const NavbarSkeleton = () => {
  return (
    <nav className="sticky top-0 z-[100] flex h-16 animate-pulse items-center justify-between border-b border-cream-border bg-cream/92 px-4 backdrop-blur-md sm:px-6">
      {/* Logo Skeleton */}
      <div className="flex items-center gap-2.5">
        <div className="h-9 w-9 rounded-[10px] bg-cream-border-soft" />
        <div className="h-5 w-20 rounded bg-cream-border-soft" />
      </div>

      {/* Desktop Menu Skeleton */}
      <div className="hidden items-center gap-8 md:flex">
        <div className="h-4 w-16 rounded bg-cream-border-soft" />
        <div className="h-4 w-20 rounded bg-cream-border-soft" />
        <div className="h-4 w-16 rounded bg-cream-border-soft" />
        <div className="h-4 w-16 rounded bg-cream-border-soft" />
        <div className="h-8 w-20 rounded-full bg-cream-border-soft" />
      </div>

      {/* Mobile Menu Button Skeleton */}
      <div className="md:hidden">
        <div className="h-6 w-6 rounded bg-cream-border-soft" />
      </div>
    </nav>
  );
};

export default NavbarSkeleton;
