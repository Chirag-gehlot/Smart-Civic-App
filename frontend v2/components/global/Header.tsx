import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContextNew";

// SVG Avatar Component
const DefaultAvatar = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 2048 2048"
    className="h-8 w-8 rounded-full border-2 border-indigo-400 bg-white">
    <defs>
      <style>{`.fil0{fill:none}.fil1{fill:#471e00}.fil2{fill:#fad3a8}`}</style>
    </defs>
    <g id="Layer_x0020_1">
      <path className="fil0" d="M256 255.999h1536v1536H256z" />
      <path className="fil0" d="M0 0h2048v2048H0z" />
      <path
        className="fil1"
        d="M1011.14 256.001c230.326 0 417.024 196.533 417.024 438.966 0 242.45-186.698 438.984-417.024 438.984-230.309 0-417.017-196.534-417.017-438.984 0-242.433 186.708-438.966 417.017-438.966z"
      />
      <path
        className="fil2"
        d="M1025.12 439.576c183.96 0 328.465 110.068 305.416 373.866-6.559 75.094 59.63 35.43 59.63 62.563 0 224.02-169.684 405.622-379.024 405.622-209.312 0-379.015-181.602-379.015-405.622 44.678 71.718 51.515-19.252 49.504-61.202-16.52-343.422 150.643-375.227 343.49-375.227z"
      />
      <path
        style={{ fill: "#c99154", fillRule: "nonzero" }}
        d="m1083.14 935.237-19.691-22.037.526-.544.545-.51..."
      />
      <path
        className="fil1"
        d="M1138.77 379.082c146.689 64.911 265.61 160.867 265.61 214.328 0 53.458-118.921 44.176-265.61-20.734-146.687-64.911-265.601-160.867-265.601-214.328 0-53.458 118.913-44.182 265.601 20.734z"
      />
      <path
        className="fil2"
        d="M582.756 737.966c20.947-9.912 54.085 29.236 73.994 87.433 19.92 58.205 19.078 113.42-1.884 123.324-20.954 9.912-54.078-29.235-73.987-87.43-19.933-58.215-19.078-113.422 1.877-123.327zM1434.49 737.966c-27.191-9.912-63.367 29.236-80.787 87.433-17.42 58.205-9.474 113.42 17.733 123.324 27.2 9.912 63.367-29.235 80.781-87.43 17.418-58.215 9.471-113.422-17.727-123.327z"
      />
    </g>
  </svg>
);

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  console.log(user);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setMenuOpen(false);
      window.location.href = "/login";
    } else {
      console.error("Logout failed:", result.message);
      alert(result.message || "Logout failed. Please try again.");
    }
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-700 text-white"
        : "text-indigo-200 hover:bg-indigo-800 hover:text-white"
    }`;

  return (
    <header className="bg-indigo-800 shadow-md sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Nav */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex-shrink-0 text-white font-bold text-xl tracking-wide">
              CivicTrust
            </Link>
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink to="/e-voting" className={navLinkClass}>
                  E-Voting
                </NavLink>
                <NavLink to="/chatbot" className={navLinkClass}>
                  Law-Chatbot
                </NavLink>
                <NavLink to="/help" className={navLinkClass}>
                  Help
                </NavLink>
              </div>
            </nav>
          </div>

          {/* User Section */}
          <div className="flex items-center">
            {user ? (
              <div className="relative flex items-center" ref={menuRef}>
                {/* Welcome Text */}
                <span
                  className="text-white text-sm font-medium mr-3 hidden sm:block"
                  aria-live="polite">
                  Welcome,{" "}
                  {(user.full_name || user.name || "User").split(" ")[0]}
                </span>

                {/* Avatar Button */}
                <button
                  id="user-menu-button"
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-900 focus:ring-white"
                  aria-expanded={menuOpen}
                  aria-haspopup="true">
                  <span className="sr-only">Open user menu</span>

                  {user.avatarUrl ? (
                    <img
                      className="h-8 w-8 rounded-full border-2 border-indigo-400 object-cover"
                      src={user.avatarUrl}
                      alt={user.full_name || user.name || "User"}
                    />
                  ) : (
                    <DefaultAvatar />
                  )}
                </button>

                {/* Dropdown Menu */}
                <div
                  className={`origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 ease-out z-50 ${
                    menuOpen
                      ? "transform opacity-100 scale-100"
                      : "transform opacity-0 scale-95 pointer-events-none"
                  }`}
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu-button">
                  <div className="py-1" role="none">
                    <div className="px-4 py-3 border-b border-slate-200">
                      <p
                        className="text-sm font-semibold text-slate-800 truncate"
                        role="none">
                        {user.full_name || user.name || "User"}
                      </p>
                    </div>

                    {/* Sign Out Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                      role="menuitem">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-3 text-slate-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-white bg-teal-500 hover:bg-teal-600 px-3 py-2 rounded-md text-sm font-medium">
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
