import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import navlogo from "../../assets/logo.png";

export default function LoginNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinkStyle = ({ isActive }) =>
        `relative text-sm lg:text-[15px] font-medium transition ${
            isActive ? "text-[#2563EB]" : "text-[#1F2937] hover:text-[#2563EB]"
        }`;

    return (
        <nav className="sticky top-0 z-50 transition-all duration-300 bg-[#F8F8FF]/90 backdrop-blur-xl shadow-sm">
            <div
                className="
                    mx-auto flex
                    max-w-[1800px]
                    items-center justify-between

                    px-4 sm:px-6 lg:px-10
                    py-2
                "
            >
                {/* Logo */}
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

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-6 lg:gap-10">
                    <NavLink to="/" className={navLinkStyle}>
                        Home
                    </NavLink>

                    <NavLink to="/explore" className={navLinkStyle}>
                        Explore
                    </NavLink>

                    <NavLink to="/category" className={navLinkStyle}>
                        Categories
                    </NavLink>

                    <NavLink to="/how-it-works" className={navLinkStyle}>
                        How it Works
                    </NavLink>
                </div>

                {/* Right Side */}
                <div className="flex items-center gap-2 sm:gap-4">
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
                </div>
            </div>
        </nav>
    );
}
