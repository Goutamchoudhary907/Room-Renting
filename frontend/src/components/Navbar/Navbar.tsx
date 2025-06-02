import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import NavbarSkeleton from "./NavbarSkeleton";
import { useLoading } from "../../context/LoadingContext";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { isLoading } = useLoading();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (isLoading){
    return <NavbarSkeleton/>
  }

  const handleLogout = () => {
    logout();
    navigate("/auth/signin");
    setIsMenuOpen(false);
  };

 
  return (
    <nav className="bg-gradient-to-r from-blue-100 via-white to-blue-100 shadow-md px-6 py-3 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 10l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V10z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 21V10h6v11"
          />
        </svg>
        <Link to="/" className="text-xl font-bold text-gray-900 hover:text-blue-600">
          Rentpy
        </Link>
      </div>

      {/* Desktop Navigation (unchanged) */}
      <div className="hidden lg:flex space-x-6 text-gray-900 font-medium items-center">
        <Link to="/property/all-rooms" className="hover:text-blue-600">
          All Rooms
        </Link>

        {user ? (
          <>
            <Link to="/property/my/properties" className="hover:text-blue-600">
              My Properties
            </Link>
            <Link to="/property/create" className="hover:text-blue-600">
              List Property
            </Link>
            <Link to="/bookings" className="hover:text-blue-600">
              My Bookings
            </Link>
            <button
              onClick={handleLogout}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/auth/signin" className="hover:text-blue-600">
              Login
            </Link>
            <Link to="/auth/signup" className="hover:text-blue-600">
              Signup
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-900 hover:text-blue-600"
        >
          {isMenuOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-lg py-4 px-6">
          <div className="flex flex-col space-y-4">
            <Link 
              to="/property/all-rooms" 
              className="text-gray-900 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              All Rooms
            </Link>

            {user ? (
              <>
                <Link 
                  to="/property/my/properties" 
                  className="text-gray-900 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Properties
                </Link>
                <Link 
                  to="/property/create" 
                  className="text-gray-900 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  List Property
                </Link>
                <Link 
                  to="/bookings" 
                  className="text-gray-900 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/auth/signin" 
                  className="text-gray-900 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/auth/signup" 
                  className="text-gray-900 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};