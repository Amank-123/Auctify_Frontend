import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth.js";
import navlogo from "@/assets/logo.png";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";

import NavbarSkeleton from "./navbarSkeleton.jsx";
import UserSidebar from "./UserSidebar.jsx";
import NotificationBell from "./notificationBell.jsx";
import NotificationDrawer from "./notification.jsx";

import { socket } from "@/shared/services/socket";
import { User2 } from "lucide-react";
import ChatButton from "./ChatButton.jsx";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import ShoppingCart from "./ShoppingCart.jsx";

export default function Navbar() {
    const { isAuthenticated, Loading, User, isAdmin } = useAuth();

    const [refreshBell, setRefreshBell] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);

    const navigate = useNavigate();

    /* ---------------- SOCKET FIX ---------------- */
    useEffect(() => {
        if (!User?._id) return;

        if (!socket.connected) {
            socket.connect();
        }

        return () => {
            socket.off(); // prevent duplicate listeners
        };
    }, [User?._id]);

    /* ---------------- SCROLL EFFECT ---------------- */
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    /* ---------------- BODY LOCK FIX ---------------- */
    useEffect(() => {
        const shouldLock = sidebarOpen || notificationOpen;

        if (shouldLock) {
            // Prevent layout shift
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

            document.body.style.overflow = "hidden";

            document.body.style.paddingRight = `${scrollbarWidth}px`;
        } else {
            document.body.style.overflow = "";

            document.body.style.paddingRight = "";
        }

        return () => {
            document.body.style.overflow = "";

            document.body.style.paddingRight = "";
        };
    }, [sidebarOpen, notificationOpen]);

    /* ---------------- CLOSE CONFLICTS ---------------- */
    useEffect(() => {
        if (sidebarOpen) setNotificationOpen(false);
    }, [sidebarOpen]);

    useEffect(() => {
        if (notificationOpen) setSidebarOpen(false);
    }, [notificationOpen]);

    if (Loading) {
        return <NavbarSkeleton isAuth={false} />;
    }

    const navLinkStyle = ({ isActive }) =>
        `relative text-sm lg:text-[15px] font-medium transition ${
            isActive ? "text-[#2563EB]" : "text-[#1F2937] hover:text-[#2563EB]"
        }`;

    return (
        <>
            {/* NAVBAR */}
            <nav
                className={`sticky top-0 z-50 transition ${
                    isScrolled
                        ? "bg-[#F8F8FF]/90 backdrop-blur-xl shadow-sm"
                        : "bg-[#F8F8FF] border-b"
                }`}
            >
                <div
                    className="
                    mx-auto flex
                    h-16 sm:h-auto
                    max-w-[1800px]
                    items-center justify-between

                    px-4 sm:px-6 lg:px-10
                    py-2 sm:py-1
                "
                >
                    {/* LOGO */}
                    <Link to="/" className="flex items-center shrink-0">
                        <img
                            src={navlogo}
                            alt="Auctify"
                            className="
                            h-11 sm:h-12 lg:h-13
                            w-auto object-contain
                        "
                        />
                    </Link>

                    {/* DESKTOP NAV */}
                    <div className="hidden md:flex items-center gap-6 lg:gap-10">
                        <NavLink to="/explore" className={navLinkStyle}>
                            Explore
                        </NavLink>

                        <NavLink to="/category" className={navLinkStyle}>
                            Categories
                        </NavLink>

                        {isAuthenticated && (
                            <Link
                                to="/auction/sell"
                                className="
                                rounded-xl px-3 py-2
                                text-sm font-semibold
                                text-[#C2410C]
                                hover:bg-orange-50
                                transition-all
                            "
                            >
                                Sell
                            </Link>
                        )}

                        <NavLink to="/how-it-works" className={navLinkStyle}>
                            How it Works
                        </NavLink>
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {!isAuthenticated ? (
                            <>
                                {/* LOGIN */}
                                <Link
                                    to="/auth/login"
                                    className="
                                    px-3 py-2
                                    rounded-xl

                                    text-sm sm:text-[15px]
                                    font-medium
                                    text-slate-700

                                    hover:bg-slate-100
                                    hover:text-[#2563EB]

                                    transition-all
                                "
                                >
                                    Login
                                </Link>

                                {/* REGISTER */}
                                <Link
                                    to="/auth/register"
                                    className="
                                    rounded-xl
                                    bg-[#2563EB]

                                    px-4 sm:px-5
                                    py-2.5

                                    text-sm font-semibold
                                    text-white

                                    shadow-sm
                                    hover:bg-blue-700

                                    transition-all
                                "
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* ADMIN DASHBOARD */}
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="
                                        hidden md:flex
                                        rounded-xl bg-[#C2410C]

                                        px-4 py-2.5
                                        text-sm font-semibold

                                        gap-2
                                        cursor-pointer
                                        justify-center items-center

                                        text-white
                                        shadow-sm

                                        hover:bg-orange-700
                                        transition-all
                                    "
                                    >
                                        <User2 size={18} />
                                        Admin Dashboard
                                    </Link>
                                )}

                                {/* NOTIFICATION */}
                                <div
                                    className="
                                    flex h-10 w-10
                                    items-center justify-center

                                    rounded-xl bg-white
                                    border border-slate-200
                                    shadow-sm

                                    cursor-pointer
                                "
                                >
                                    <NotificationBell
                                        onClick={() => setNotificationOpen(true)}
                                        refreshKey={refreshBell}
                                    />
                                </div>

                                {/* orders */}
                                <div
                                    className="
                                    flex h-10 w-10
                                    items-center justify-center

                                    rounded-xl bg-white
                                    border border-slate-200
                                    shadow-sm

                                    cursor-pointer
                                "
                                    onClick={() => navigate("/orders")}
                                >
                                    <ShoppingCart />
                                </div>

                                {/* Chat */}
                                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg  bg-white">
                                    <ChatButton
                                        onClick={() => navigate("/chats")}
                                        refreshKey={refreshBell}
                                    />
                                </div>

                                {/* MENU */}
                                <button
                                    onClick={() => setSidebarOpen((prev) => !prev)}
                                    className="
                                    flex h-10 w-10
                                    items-center justify-center

                                    rounded-xl
                                    cursor-pointer

                                    bg-white
                                    border border-slate-200
                                    shadow-sm
                                "
                                >
                                    {sidebarOpen ? (
                                        <HiOutlineX className="text-[22px]" />
                                    ) : (
                                        <HiOutlineMenu className="text-[22px]" />
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {/* SIDEBAR */}
            <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={User} />

            {/* NOTIFICATIONS */}
            <NotificationDrawer
                open={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                onMarkedAllRead={() => setRefreshBell((prev) => prev + 1)}
            />
        </>
    );
}
