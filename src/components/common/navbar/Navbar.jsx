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
        document.body.style.overflow = shouldLock ? "hidden" : "auto";

        return () => {
            document.body.style.overflow = "auto";
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
                <div className="mx-auto flex max-w-[1800px] items-center justify-between px-4 py-1 sm:px-6 lg:px-10">
                    {/* LOGO */}
                    <Link to="/" className="flex items-center shrink-0">
                        <img src={navlogo} alt="Auctify" className="h-10 sm:h-12 lg:h-13 w-auto" />
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
                                className="rounded-xl px-3 py-2 text-sm font-semibold text-[#C2410C] hover:bg-orange-50"
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
                                <Link
                                    to="/auth/login"
                                    className="hidden sm:block text-[16px] font-medium"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/auth/register"
                                    className="rounded-sm bg-[#2563EB] px-3 py-2 text-sm font-semibold text-white"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Admin dashboard */}
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="rounded-sm bg-[#C2410C] px-3 py-2 text-sm font-semibold gap-1 flex cursor-pointer justify-center items-center text-white"
                                    >
                                        <User2 size={18} /> Admin Dashboard
                                    </Link>
                                )}

                                {/* NOTIFICATION */}
                                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg  bg-white">
                                    <NotificationBell
                                        onClick={() => setNotificationOpen(true)}
                                        refreshKey={refreshBell}
                                    />
                                </div>

                                {/* Chat */}
                                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg  bg-white">
                                    <ChatButton
                                        onClick={() => navigate("/auction/room")}
                                        refreshKey={refreshBell}
                                    />
                                </div>

                                {/* MENU */}
                                <button
                                    onClick={() => setSidebarOpen((prev) => !prev)}
                                    className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg cursor-pointer bg-white"
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
