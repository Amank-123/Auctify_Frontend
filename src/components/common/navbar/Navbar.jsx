import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth.js";
import navlogo from "@/assets/logo.png";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

import NavbarSkeleton from "./navbarSkeleton.jsx";
import UserSidebar from "./UserSidebar.jsx";
import NotificationBell from "./notificationBell.jsx";
import NotificationDrawer from "./notification.jsx";

import { socket } from "@/shared/services/socket";

export default function Navbar() {
    const { isAuthenticated, Loading, User } = useAuth();

    const [refreshBell, setRefreshBell] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    // socket connect
    useEffect(() => {
        if (!User?._id) return;

        socket.connect();

        return () => {
            socket.disconnect();
        };
    }, [User?._id]);

    // scroll navbar effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // lock body scroll when drawer/sidebar open
    useEffect(() => {
        document.body.style.overflow = sidebarOpen || notificationOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen, notificationOpen]);

    // close sidebar if notification opens
    useEffect(() => {
        if (notificationOpen) {
            setSidebarOpen(false);
        }
    }, [notificationOpen]);

    if (Loading) {
        return <NavbarSkeleton isAuth={false} />;
    }

    const navLinkStyle = ({ isActive }) =>
        `relative text-sm font-medium transition-colors duration-200 ${
            isActive ? "text-[#2563EB]" : "text-[#1F2937] hover:text-[#2563EB]"
        }`;

    const navUnderline = ({ isActive }) =>
        isActive ? (
            <span className="absolute left-0 -bottom-1 h-[2px] w-full rounded-full bg-[#2563EB]" />
        ) : null;

    return (
        <>
            {/* Navbar */}
            <nav
                className={`sticky top-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? "bg-[#F8F8FF]/90 backdrop-blur-xl shadow-sm shadow-slate-200/70"
                        : "bg-[#F8F8FF] border-b border-[#E5E7EB]"
                }`}
            >
                <div className="mx-auto flex max-w-[1440px] items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
                    {/* Logo */}
                    <Link to="/" className="flex items-center shrink-0">
                        <img src={navlogo} alt="Auctify" className="h-14 w-auto object-contain" />
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-10">
                        <NavLink to="/explore" className={navLinkStyle}>
                            {({ isActive }) => (
                                <>
                                    Explore
                                    {navUnderline({
                                        isActive,
                                    })}
                                </>
                            )}
                        </NavLink>

                        <NavLink to="/category" className={navLinkStyle}>
                            {({ isActive }) => (
                                <>
                                    Categories
                                    {navUnderline({
                                        isActive,
                                    })}
                                </>
                            )}
                        </NavLink>
                        {isAuthenticated && (
                            <Link
                                to="/auction/sell"
                                className="rounded-xl px-4 py-2 text-sm font-semibold text-[#C2410C] hover:bg-orange-50 hover:text-[#9A3412] transition"
                            >
                                Sell
                            </Link>
                        )}
                        <NavLink to="/how-it-works" className={navLinkStyle}>
                            {({ isActive }) => (
                                <>
                                    How it Works
                                    {navUnderline({
                                        isActive,
                                    })}
                                </>
                            )}
                        </NavLink>
                    </div>

                    {/* Right Side */}
                    <div className="flex items-center gap-3 sm:gap-4">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/auth/login"
                                    className="hidden sm:block text-sm font-medium text-[#1F2937] hover:text-[#2563EB] transition"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/auth/register"
                                    className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1D4ED8] transition"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Bell */}
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white hover:bg-slate-50 transition">
                                    <NotificationBell
                                        onClick={() => setNotificationOpen(true)}
                                        refreshKey={refreshBell}
                                    />
                                </div>

                                {/* Menu */}
                                <button
                                    type="button"
                                    onClick={() => setSidebarOpen((prev) => !prev)}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white text-[#1F2937] hover:bg-slate-50 hover:text-[#2563EB] transition"
                                >
                                    {sidebarOpen ? (
                                        <HiOutlineX className="text-2xl" />
                                    ) : (
                                        <HiOutlineMenu className="text-2xl" />
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={User} />

            {/* Notifications */}
            <NotificationDrawer
                open={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                onMarkedAllRead={() => setRefreshBell((prev) => prev + 1)}
            />
        </>
    );
}
