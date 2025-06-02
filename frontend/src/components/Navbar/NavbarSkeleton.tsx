const NavbarSkeleton = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-100 via-white to-blue-100 shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50 animate-pulse">
      {/* Logo Skeleton */}
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-gray-300 rounded-full" />
        <div className="h-6 w-20 bg-gray-300 rounded" />
      </div>

      {/* Desktop Menu Skeleton */}
      <div className="hidden lg:flex space-x-6 items-center">
        <div className="h-4 w-20 bg-gray-300 rounded" />
        <div className="h-4 w-24 bg-gray-300 rounded" />
        <div className="h-4 w-20 bg-gray-300 rounded" />
        <div className="h-4 w-24 bg-gray-300 rounded" />
        <div className="h-8 w-20 bg-gray-300 rounded-md" />
      </div>

      {/* Mobile Menu Button Skeleton */}
      <div className="lg:hidden">
        <div className="h-6 w-6 bg-gray-300 rounded" />
      </div>
    </nav>
  );
};

export default NavbarSkeleton;
