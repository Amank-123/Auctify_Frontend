import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineX, HiOutlineLogout } from "react-icons/hi";
import { useAuth } from "@/hooks/useAuth.js";
import { api } from "@/shared/services/axios.js";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints.js";
import { showSuccess } from "@/shared/utils/toast.js";

import SidebarSection from "./SidebarSection.jsx";
import SidebarNavItem from "./SidebarNavItem.jsx";
import AuctionItem from "./AuctionItem.jsx";
import BidItem from "./BidItem.jsx";

import defaultUp from "@/assets/default.png";

const ITEMS_PER_PAGE = 5;

export default function UserSidebar({ open, onClose, user }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(user || null);
    const [auctions, setAuctions] = useState([]);
    const [bids, setBids] = useState([]);

    const [auctionPage, setAuctionPage] = useState(1);
    const [bidPage, setBidPage] = useState(1);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    /* ---------------- FETCH ---------------- */
    useEffect(() => {
        if (!open) return;

        let alive = true;

        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const [userRes, auctionRes, bidRes] = await Promise.all([
                    api.get(API_ENDPOINTS.User.GET),
                    api.get(API_ENDPOINTS.Auction.GET_BY_SELLER),
                    api.get(API_ENDPOINTS.Bid.GET_USER_BIDS),
                ]);

                if (!alive) return;

                setProfile(userRes?.data?.data || null);
                setAuctions(auctionRes?.data?.data || []);
                setBids(bidRes?.data?.data || []);
            } catch (err) {
                if (!alive) return;
                setError(err?.response?.data?.message || "Failed to load.");
            } finally {
                if (alive) setLoading(false);
            }
        };

        loadData();

        return () => {
            alive = false;
        };
    }, [open]);

    /* ---------------- RESET PAGINATION ---------------- */
    useEffect(() => {
        if (open) {
            setAuctionPage(1);
            setBidPage(1);
        }
    }, [open]);

    /* ---------------- ESC CLOSE ---------------- */
    useEffect(() => {
        if (!open) return;

        const handler = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [open]);

    /* ---------------- PAGINATION ---------------- */
    const paginatedAuctions = useMemo(
        () => auctions.slice(0, auctionPage * ITEMS_PER_PAGE),
        [auctions, auctionPage],
    );

    const paginatedBids = useMemo(() => bids.slice(0, bidPage * ITEMS_PER_PAGE), [bids, bidPage]);

    const hasMoreAuctions = paginatedAuctions.length < auctions.length;
    const hasMoreBids = paginatedBids.length < bids.length;

    /* ---------------- LOGOUT ---------------- */
    const handleLogout = () => {
        logout();
        showSuccess("Logged out");
        onClose();
        navigate("/auth/login");
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60]">
            {/* BACKDROP */}
            <div onClick={onClose} className="absolute inset-0 " />

            {/* SIDEBAR */}
            <aside
                className="
                absolute right-0 top-0 h-full
                w-full sm:w-[380px]
                max-w-full
                bg-white shadow-2xl
                flex flex-col
                animate-slideIn
            "
            >
                {/* HEADER */}
                <div className="flex items-center justify-between border-b px-4 sm:px-5 py-3 sm:py-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => {
                                onClose();
                                navigate("/profile");
                            }}
                            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full overflow-hidden bg-gray-200 shrink-0"
                        >
                            <img
                                src={profile?.profile || defaultUp}
                                alt="profile"
                                className="h-full w-full object-cover"
                            />
                        </button>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                                {profile?.firstName || "User"} {profile?.lastName || ""}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                                @{profile?.username || "username"}
                            </p>
                        </div>
                    </div>

                    <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100">
                        <HiOutlineX className="text-xl" />
                    </button>
                </div>

                {/* CONTENT */}
                <div
                    className="
                    flex-1 overflow-y-auto
                    px-3 sm:px-4
                    py-4
                    space-y-5
                "
                >
                    <SidebarSection title="Account">
                        <div className="rounded-xl border p-3 bg-gray-50">
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="text-sm font-semibold break-words">
                                {profile?.email || "No email"}
                            </p>
                        </div>
                    </SidebarSection>

                    <SidebarSection title="Workspace">
                        <SidebarNavItem to="/profile" onClick={onClose}>
                            Profile
                        </SidebarNavItem>
                        <SidebarNavItem to="/watchlist" onClick={onClose}>
                            Watchlist
                        </SidebarNavItem>
                        <SidebarNavItem to="/notifications" onClick={onClose}>
                            Notifications
                        </SidebarNavItem>
                        <SidebarNavItem to="/setting" onClick={onClose}>
                            Settings
                        </SidebarNavItem>
                    </SidebarSection>

                    {/* AUCTIONS */}
                    <SidebarSection title={`My Auctions (${auctions.length})`}>
                        {loading ? (
                            <SidebarPlaceholder text="Loading..." />
                        ) : paginatedAuctions.length ? (
                            <>
                                {paginatedAuctions.map((a) => (
                                    <AuctionItem key={a._id} auction={a} onClick={onClose} />
                                ))}

                                {hasMoreAuctions && (
                                    <LoadMore onClick={() => setAuctionPage((p) => p + 1)} />
                                )}
                            </>
                        ) : (
                            <SidebarPlaceholder text="No auctions yet." />
                        )}
                    </SidebarSection>

                    {/* BIDS */}
                    <SidebarSection title={`My Bids (${bids.length})`}>
                        {loading ? (
                            <SidebarPlaceholder text="Loading..." />
                        ) : paginatedBids.length ? (
                            <>
                                {paginatedBids.map((b) => (
                                    <BidItem key={b._id} bid={b} onClick={onClose} />
                                ))}

                                {hasMoreBids && (
                                    <LoadMore onClick={() => setBidPage((p) => p + 1)} />
                                )}
                            </>
                        ) : (
                            <SidebarPlaceholder text="No bids yet." />
                        )}
                    </SidebarSection>

                    {error && <div className="text-sm text-red-500">{error}</div>}

                    <SidebarSection title="Quick stats">
                        <div className="grid grid-cols-2 gap-3">
                            <StatCard label="Auctions" value={auctions.length} />
                            <StatCard label="Bids" value={bids.length} />
                        </div>
                    </SidebarSection>
                </div>

                {/* FOOTER */}
                <div className=" px-3 pb-3 sm:p-4">
                    <button
                        onClick={handleLogout}
                        className="
                            w-full flex items-center justify-center gap-2
                            bg-red-600 text-white
                            py-2.5 sm:py-3
                            rounded-xl
                            text-sm sm:text-base
                        "
                    >
                        <HiOutlineLogout />
                        Logout
                    </button>
                </div>
            </aside>
        </div>
    );
}

/* ---------- SMALL COMPONENTS ---------- */

function SidebarPlaceholder({ text }) {
    return <div className="text-sm text-gray-500 border border-dashed rounded-xl p-3">{text}</div>;
}

function LoadMore({ onClick }) {
    return (
        <button onClick={onClick} className="w-full text-sm text-blue-600 hover:underline mt-2">
            Load more
        </button>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="border rounded-xl p-3 bg-gray-50">
            <div className="text-xs text-gray-500">{label}</div>
            <div className="text-lg font-semibold">{value}</div>
        </div>
    );
}
