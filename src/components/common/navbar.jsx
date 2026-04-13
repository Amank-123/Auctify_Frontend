import { Link, NavLink } from "react-router-dom";

const Header = () => {
    return (
        <header className="bg-black text-white px-6 py-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">
                Auctify
            </Link>

            <nav className="flex gap-6">
                <NavLink
                    to="/"
                    end // "end" ensures "/" only matches exactly
                    className={({ isActive }) =>
                        isActive ? "text-yellow-400" : "hover:text-gray-300"
                    }
                >
                    Home
                </NavLink>
                <NavLink
                    to="/auctions"
                    className={({ isActive }) =>
                        isActive ? "text-yellow-400" : "hover:text-gray-300"
                    }
                >
                    Auctions
                </NavLink>
                <NavLink
                    to="/create"
                    className={({ isActive }) =>
                        isActive ? "text-yellow-400" : "hover:text-gray-300"
                    }
                >
                    Create Auction
                </NavLink>
                <NavLink
                    to="/my-bids"
                    className={({ isActive }) =>
                        isActive ? "text-yellow-400" : "hover:text-gray-300"
                    }
                >
                    My Bids
                </NavLink>
            </nav>

            <div className="flex gap-4">
                <Link to="/login" className="hover:text-gray-300">
                    Login
                </Link>
                <Link to="/register" className="bg-white text-black px-3 py-1 rounded">
                    Register
                </Link>
            </div>
        </header>
    );
};

export default Header;
