import { useAuth } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import FooterSkeleton from "./FooterSkeleton";

const HouseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8c17a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V10z"></path>
    <path d="M9 21V12h6v11"></path>
  </svg>
);

export const Footer = () => {
  const { isLoading } = useLoading();
  const { isLoading: isAuthLoading } = useAuth();

  if (isLoading || isAuthLoading) {
    return <FooterSkeleton />;
  }

  return (
    <footer className="border-t border-cream-border bg-white px-6 pt-16 font-sans">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-[2fr_1fr_1fr] md:gap-12">
        {/* Brand */}
        <div>
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-ink">
              <HouseIcon />
            </div>
            <span className="font-serif text-xl font-bold text-ink">Rentpy</span>
          </div>
          <p className="mb-3 max-w-[300px] text-sm leading-relaxed text-taupe">
            Find your perfect stay — short or long term.
          </p>
          <p className="text-[13px] text-taupe-light">
            Email:{" "}
            <a href="mailto:goutamchoudhary907@gmail.com" className="text-amber hover:text-amber-dark">
              goutamchoudhary907@gmail.com
            </a>
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-ink">Quick Links</h4>
          <div className="flex flex-col gap-2.5">
            <a href="/" className="text-sm text-taupe no-underline transition-colors hover:text-amber">
              Home
            </a>
            <a href="/about" className="text-sm text-taupe no-underline transition-colors hover:text-amber">
              About Us
            </a>
            <a href="/property/all-rooms" className="text-sm text-taupe no-underline transition-colors hover:text-amber">
              All Rooms
            </a>
          </div>
        </div>

        {/* Support */}
        <div>
          <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-ink">Support</h4>
          <div className="flex flex-col gap-2.5">
            <a href="/contact" className="text-sm text-taupe no-underline transition-colors hover:text-amber">
              Contact Us
            </a>
            <a href="/privacy-policy" className="text-sm text-taupe no-underline transition-colors hover:text-amber">
              Privacy Policy
            </a>
            <a href="/terms-of-service" className="text-sm text-taupe no-underline transition-colors hover:text-amber">
              Terms of Service
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mx-auto mt-12 max-w-6xl border-t border-cream-border py-5 text-center">
        <p className="text-[13px] text-taupe-light">© {new Date().getFullYear()} Rentpy. All rights reserved.</p>
      </div>
    </footer>
  );
};
