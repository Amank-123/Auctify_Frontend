import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import navlogo from "../../assets/logo.png";

import { HiOutlineHeart, HiOutlineBell, HiOutlineMenu, HiOutlineX } from "react-icons/hi";

import { HiOutlineFire } from "react-icons/hi2";
import { useEffect, useState } from "react";
import NavbarSkeleton from "./navbarSkeleton.jsx";

export default function Navbar() {
    const { isAuthenticated, Loading, User, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const NavItem = ({ to, children, highlight, icon }) => {
        return (
            <NavLink
                to={to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                    `flex items-center gap-2 ${
                        highlight ? "text-orange-700 font-semibold" : "text-gray-800"
                    } hover:text-blue-600 ${isActive ? "text-blue-600 font-medium" : ""}`
                }
            >
                {icon && <span className="text-lg">{icon}</span>}
                {children}
            </NavLink>
        );
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (Loading) return <NavbarSkeleton isAuth={false} />;

    return (
        <>
            <nav
                className={`sticky top-0 z-50 transition-all duration-300 ${
                    isScrolled ? "bg-[#F8F8FF]/95 " : "bg-[#F8F8FF] border-b border-gray-200"
                }`}
            >
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20 py-3 md:py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img
                            src={navlogo}
                            alt="Auctify logo"
                            className="h-12 w-auto object-contain"
                        />
                    </Link>

                    {/* Center Links */}
                    <div className="hidden md:flex items-center gap-10 text-gray-800">
                        <NavItem to="/explore">Explore</NavItem>
                        <NavItem to="/categories">Categories</NavItem>

                        <NavItem to="/sell" highlight>
                            Sell
                        </NavItem>

                        {!isAuthenticated && <NavItem to="/how-it-works">How it Works</NavItem>}

                        {isAuthenticated && (
                            <>
                                <NavItem to="/watchlist" icon={<HiOutlineHeart />}>
                                    Watchlist
                                </NavItem>

                                <NavItem to="/bids" icon={<HiOutlineFire />}>
                                    My Bids
                                </NavItem>
                            </>
                        )}
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-6">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/auth/login"
                                    className="text-gray-700 hover:text-blue-600 transition"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/auth/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-8">
                                {/* Notifications */}
                                <NavLink
                                    to="/notifications"
                                    className="relative text-gray-700 hover:text-blue-600 transition"
                                >
                                    <HiOutlineBell className="text-2xl" />

                                    <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs px-1 rounded-full">
                                        3
                                    </span>
                                </NavLink>

                                {/* Profile Dropdown */}
                                <div className="relative group">
                                    <button className="flex items-center gap-5">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg">
                                            {User?.porfile ? (
                                                <img src={User?.porfile} />
                                            ) : (
                                                User?.firstName?.charAt(0)
                                            )}
                                        </div>
                                    </button>

                                    <div className="absolute right-0 pt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition pointer-events-none group-hover:pointer-events-auto">
                                        <Link
                                            to="/profile"
                                            className="block px-4 py-2 hover:bg-gray-100"
                                        >
                                            Profile
                                        </Link>

                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        <button
                            className="md:hidden text-gray-800"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? (
                                <HiOutlineX className="text-3xl" />
                            ) : (
                                <HiOutlineMenu className="text-3xl" />
                            )}
                        </button>
                    </div>
                </div>
                {isOpen && (
                    <div className="md:hidden absolute right-4 top-full mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-4 space-y-4">
                        <NavItem to="/explore">Explore</NavItem>
                        <NavItem to="/categories">Categories</NavItem>

                        <NavItem to="/sell" highlight>
                            Sell
                        </NavItem>

                        {!isAuthenticated && (
                            <>
                                <NavItem to="/how-it-works">How it Works</NavItem>
                            </>
                        )}

                        {isAuthenticated && (
                            <>
                                <NavItem to="/watchlist" icon={<HiOutlineHeart />}>
                                    Watchlist
                                </NavItem>

                                <NavItem to="/bids" icon={<HiOutlineFire />}>
                                    My Bids
                                </NavItem>
                            </>
                        )}
                    </div>
                )}
            </nav>
        </>
    );
}
