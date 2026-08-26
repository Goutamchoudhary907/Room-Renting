import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import NavbarSkeleton from "./NavbarSkeleton";
import { useLoading } from "../../context/LoadingContext";

const HouseIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#e8c17a"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 10l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V10z"></path>
    <path d="M9 21V12h6v11"></path>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1c1917" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1c1917" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { isLoading } = useLoading();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isLoading) {
    return <NavbarSkeleton />;
  }

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    logout();
    navigate("/auth/signin");
    closeMenu();
  };

  return (
    <nav className="sticky top-0 z-[100] flex h-16 items-center justify-between border-b border-cream-border bg-cream/92 px-4 font-sans backdrop-blur-md sm:px-6">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 no-underline">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-ink">
          <HouseIcon />
        </div>
        <span className="font-serif text-[22px] font-bold tracking-tight text-ink">Rentpy</span>
      </Link>

      {/* Desktop nav */}
      <div className="hidden items-center gap-8 text-sm font-medium text-taupe md:flex">
        <Link to="/property/all-rooms" className="text-taupe transition-colors hover:text-ink">
          All Rooms
        </Link>

        {user ? (
          <>
            <Link to="/property/my/properties" className="text-taupe transition-colors hover:text-ink">
              My Properties
            </Link>
            <Link to="/property/create" className="text-taupe transition-colors hover:text-ink">
              List Property
            </Link>
            <Link to="/booking/my-bookings" className="text-taupe transition-colors hover:text-ink">
              Bookings
            </Link>
            <button
              onClick={handleLogout}
              className="cursor-pointer rounded-full border-none bg-ink px-[22px] py-[9px] text-[13px] font-semibold text-cream transition-all duration-[250ms] hover:bg-amber hover:text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/auth/signup" className="text-taupe transition-colors hover:text-ink">
              Sign Up
            </Link>
            <Link
              to="/auth/signin"
              className="rounded-full bg-ink px-[22px] py-[9px] text-[13px] font-semibold text-cream no-underline transition-all duration-[250ms] hover:bg-amber hover:text-white"
            >
              Sign In
            </Link>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setIsMenuOpen(true)}
        aria-label="Open menu"
        className="flex h-10 w-10 cursor-pointer items-center justify-center border-none bg-transparent p-0 md:hidden"
      >
        <MenuIcon />
      </button>

      {/* Mobile overlay menu */}
      {isMenuOpen && (
        <div
          className="animate-rp-fade-in fixed inset-0 z-[200] bg-ink/40"
          onClick={closeMenu}
        >
          <div
            className="animate-rp-slide-in absolute right-0 top-0 flex h-full w-[280px] flex-col bg-cream p-6 shadow-[-8px_0_32px_rgba(28,25,23,0.12)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex justify-end">
              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border-none bg-cream-border-soft"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="flex flex-col gap-2 font-sans">
              <Link
                to="/property/all-rooms"
                onClick={closeMenu}
                className="rounded-xl px-4 py-3 text-[15px] font-medium text-ink no-underline transition-colors hover:bg-cream-border-soft"
              >
                All Rooms
              </Link>
              {user ? (
                <>
                  <Link
                    to="/property/my/properties"
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3 text-[15px] font-medium text-ink no-underline transition-colors hover:bg-cream-border-soft"
                  >
                    My Properties
                  </Link>
                  <Link
                    to="/property/create"
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3 text-[15px] font-medium text-ink no-underline transition-colors hover:bg-cream-border-soft"
                  >
                    List Property
                  </Link>
                  <Link
                    to="/booking/my-bookings"
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3 text-[15px] font-medium text-ink no-underline transition-colors hover:bg-cream-border-soft"
                  >
                    My Bookings
                  </Link>
                </>
              ) : (
                <Link
                  to="/auth/signup"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-[15px] font-medium text-ink no-underline transition-colors hover:bg-cream-border-soft"
                >
                  Sign Up
                </Link>
              )}
            </div>

            <div className="mt-auto border-t border-cream-border pt-6">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="block w-full cursor-pointer rounded-xl border-none bg-ink px-6 py-3 text-center font-sans text-sm font-semibold text-cream transition-colors hover:bg-amber"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/auth/signin"
                  onClick={closeMenu}
                  className="block rounded-xl bg-ink px-6 py-3 text-center font-sans text-sm font-semibold text-cream no-underline transition-colors hover:bg-amber"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
