import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth.js";
import navlogo from "@/assets/logo.png";
import { HiOutlineBell, HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import NavbarSkeleton from "./navbarSkeleton.jsx";
import UserSidebar from "./UserSidebar.jsx";
import defaultImg from "@/assets/default.png";

export default function Navbar() {
    const { isAuthenticated, Loading, User } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);

    if (Loading) return <NavbarSkeleton isAuth={false} />;

    return (
        <>
            <nav
                className={`sticky top-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? "bg-[#F8F8FF]/95 backdrop-blur-md"
                        : "bg-[#F8F8FF] border-b border-[#E5E7EB]"
                }`}
            >
                <div className="mx-auto flex max-w-8xl items-center justify-between px-4 py-3 sm:px-6 lg:px-20 md:py-4">
                    <div className="flex items-center gap-3">
                        {isAuthenticated && (
                            <button
                                type="button"
                                onClick={() => setSidebarOpen((prev) => !prev)}
                                className="rounded-xl border border-[#E5E7EB] bg-white p-2 text-[#1F2937] transition hover:bg-[#F8F8FF] hover:text-[#2563EB]"
                                aria-label="Toggle dashboard sidebar"
                            >
                                {sidebarOpen ? (
                                    <HiOutlineX className="text-2xl" />
                                ) : (
                                    <HiOutlineMenu className="text-2xl" />
                                )}
                            </button>
                        )}

                        <Link to="/" className="flex items-center">
                            <img
                                src={navlogo}
                                alt="Auctify logo"
                                className="h-12 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    <div className="hidden items-center gap-10 text-sm md:flex">
                        <Link to="/explore" className="text-[#1F2937] hover:text-[#2563EB]">
                            Explore
                        </Link>
                        <Link to="/categories" className="text-[#1F2937] hover:text-[#2563EB]">
                            Categories
                        </Link>
                        <Link
                            to="/auction/sell"
                            className="text-[#C2410C] font-semibold hover:text-[#9A3412]"
                        >
                            Sell
                        </Link>

                        {!isAuthenticated && (
                            <Link
                                to="/how-it-works"
                                className="text-[#1F2937] hover:text-[#2563EB]"
                            >
                                How it Works
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-4 sm:gap-6">
                        {!isAuthenticated ? (
                            <>
                                <Link
                                    to="/auth/login"
                                    className="text-[#1F2937] transition hover:text-[#2563EB]"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/auth/register"
                                    className="rounded-lg bg-[#2563EB] px-4 py-2 text-white transition hover:bg-[#1D4ED8]"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/notifications"
                                    className="relative text-[#1F2937] transition hover:text-[#2563EB]"
                                >
                                    <HiOutlineBell className="text-2xl" />
                                    <span className="absolute -top-1 -right-1 rounded-full bg-[#C2410C] px-1.5 py-0.5 text-xs text-white">
                                        3
                                    </span>
                                </Link>

                                <Link to="/profile" className="flex items-center">
                                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#E5E7EB] text-lg text-[#1F2937] ring-2 ring-white transition hover:ring-[#2563EB]/20">
                                        {User?.profile ? (
                                            <img
                                                src={User.profile}
                                                alt="User profile"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : defaultImg ? (
                                            <img
                                                src={defaultImg}
                                                alt="User profile"
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span>{User?.firstName?.charAt(0) || "U"}</span>
                                        )}
                                    </div>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            <UserSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={User} />
        </>
    );
}
