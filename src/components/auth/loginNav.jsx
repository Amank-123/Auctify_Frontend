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

    return (
        <nav className="absolute w-full  top-0 z-50 transition-all duration-300 ">
            <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-20 py-3 md:py-2 flex items-center justify-between">
                {/* LOGO */}
                <Link to="/" className="flex items-center">
                    <img src={navlogo} alt="Auctify logo" className="h-14 w-auto object-contain" />
                </Link>

                {/* CENTER LINKS (minimal) */}
                <div className="hidden md:flex items-center gap-10 text-gray-800">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `hover:text-blue-600 ${isActive ? "text-blue-600 font-medium" : ""}`
                        }
                    >
                        Home
                    </NavLink>

                    <NavLink
                        to="/how-it-works"
                        className={({ isActive }) =>
                            `hover:text-blue-600 ${isActive ? "text-blue-600 font-medium" : ""}`
                        }
                    >
                        How it works
                    </NavLink>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center gap-4">
                    <Link to="/auth/login" className="text-gray-700 hover:text-blue-600 transition">
                        Login
                    </Link>

                    <Link
                        to="/auth/register"
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
}
