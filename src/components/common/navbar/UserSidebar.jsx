import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineX, HiOutlineLogout } from "react-icons/hi";

import { useAuth } from "@/hooks/useAuth.js";
import { api } from "@/shared/services/axios.js";
import { showSuccess } from "@/shared/utils/toast.js";

import SidebarSection from "./SidebarSection.jsx";
import SidebarNavItem from "./SidebarNavItem.jsx";
import AuctionItem from "./AuctionItem.jsx";
import BidItem from "./BidItem.jsx";

import defaultUp from "@/assets/default.png";
import { API_ENDPOINTS } from "../../../shared/constants/apiEndpoints.js";

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

    /* FETCH DATA */
    useEffect(() => {
        if (!open) return;

        let alive = true;

        const loadData = async () => {
            try {
                setLoading(true);

                setError("");

                const bidRes = await api.get(API_ENDPOINTS.Bid.GET_USER_BIDS);

                setBids(bidRes?.data?.data || []);

                const auctionRes = await api.get(API_ENDPOINTS.Auction.GET_BY_SELLER);

                setAuctions(auctionRes?.data?.data || []);
            } catch (err) {
                if (!alive) return;

                setError(err?.response?.data?.message || "Failed to load data.");
            } finally {
                if (alive) {
                    setLoading(false);
                }
            }
        };

        loadData();

        return () => {
            alive = false;
        };
    }, [open]);

    /* ESC CLOSE */
    useEffect(() => {
        if (!open) return;

        const handleKey = (e) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
        };
    }, [open, onClose]);

    /* PAGINATION */
    const paginatedAuctions = useMemo(
        () => auctions.slice(0, auctionPage * ITEMS_PER_PAGE),
        [auctions, auctionPage],
    );

    const paginatedBids = useMemo(() => bids.slice(0, bidPage * ITEMS_PER_PAGE), [bids, bidPage]);

    const hasMoreAuctions = paginatedAuctions.length < auctions.length;

    const hasMoreBids = paginatedBids.length < bids.length;

    /* LOGOUT */
    const handleLogout = () => {
        logout();

        showSuccess("Logged out");

        onClose();

        navigate("/auth/login");
    };

    return (
        <div
            className={`
                fixed inset-0 z-[60]

               transition-opacity duration-300

                ${open ? "pointer-events-auto" : "pointer-events-none"}
            `}
        >
            {/* BACKDROP */}
            <div
                onClick={onClose}
                className={`
                    absolute inset-0
                    bg-black/25

                    transition-opacity duration-300

                    ${open ? "opacity-100" : "opacity-0"}
                `}
            />

            {/* SIDEBAR */}
            <aside
                className={`
                    absolute right-0 top-0 h-full

                    w-[100%]
                    sm:w-[380px]

                    max-w-full

                    bg-gradient-to-b
                    from-[#FCFCFD]
                    to-[#F8FAFC]

                    border-l border-slate-200

                    shadow-2xl

                    flex flex-col

                    transform-gpu
                    will-change-transform

                    transition-transform
                    duration-200
                    ease-out

                    ${open ? "translate-x-0" : "translate-x-full"}
                `}
            >
                {/* TOP ACCENT */}
                {/* <div
                    className="
                        h-[3px]
                        w-full

                        bg-gradient-to-r
                        from-blue-700
                        via-cyan-500
                        to-blue-400

                        shrink-0
                    "
                /> */}

                {/* HEADER */}
                <div
                    className="
                        flex items-center
                        justify-between

                        border-b border-slate-200

                        px-4 sm:px-5
                        py-4
                    "
                >
                    <div className="flex items-center gap-3 min-w-0">
                        {/* PROFILE */}
                        <button
                            onClick={() => {
                                onClose();

                                navigate("/profile");
                            }}
                            className="
                                h-11 w-11
                                sm:h-12 sm:w-12

                                rounded-full
                                overflow-hidden

                                bg-slate-200

                                ring-4 ring-white
                                shadow-md

                                shrink-0
                            "
                        >
                            <img
                                src={profile?.profile || defaultUp}
                                alt="profile"
                                className="
                                    h-full w-full
                                    object-cover
                                "
                            />
                        </button>

                        {/* USER */}
                        <div className="min-w-0">
                            <p
                                className="
                                    truncate
                                    text-sm
                                    font-semibold
                                    tracking-tight
                                    text-slate-900
                                "
                            >
                                {profile?.firstName || "User"} {profile?.lastName || ""}
                            </p>

                            <p
                                className="
                                    truncate
                                    text-xs
                                    text-slate-500
                                "
                            >
                                @{profile?.username || "username"}
                            </p>
                        </div>
                    </div>

                    {/* CLOSE */}
                    <button
                        onClick={onClose}
                        className="
                            p-2 rounded-xl

                            text-slate-400
                            hover:text-slate-700
                            hover:bg-slate-100

                            transition-all
                        "
                    >
                        <HiOutlineX className="text-xl" />
                    </button>
                </div>

                {/* CONTENT */}
                <div
                    className="
                        flex-1 overflow-y-auto

                        px-3 sm:px-4
                        py-4 pb-6

                        space-y-4
                    "
                >
                    {/* ACCOUNT */}
                    <SidebarSection title="Account">
                        <div
                            className="
                                rounded-2xl
                                border border-slate-200

                                px-4 py-3

                                bg-gradient-to-br
                                from-white
                                to-slate-50

                                shadow-sm
                            "
                        >
                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Email
                            </p>

                            <p
                                className="
                                    text-sm
                                    font-semibold

                                    break-words

                                    text-slate-800
                                "
                            >
                                {profile?.email || "No email"}
                            </p>
                        </div>
                    </SidebarSection>
                    {/* WORKSPACE */}
                    <SidebarSection title="Workspace">
                        <SidebarNavItem to="/profile" onClick={onClose}>
                            Profile
                        </SidebarNavItem>

                        <SidebarNavItem to="/watchlist" onClick={onClose}>
                            Watchlist
                        </SidebarNavItem>

                        <SidebarNavItem to="/chats" onClick={onClose}>
                            Chats
                        </SidebarNavItem>

                        <SidebarNavItem to="/orders" onClick={onClose}>
                            Orders
                        </SidebarNavItem>

                        {/* MOBILE ONLY */}
                        <div
                            className="
                                md:hidden

                                mt-2 pt-2

                                border-t border-slate-200

                                space-y-1
                            "
                        >
                            <SidebarNavItem to="/explore" onClick={onClose}>
                                Explore
                            </SidebarNavItem>

                            <SidebarNavItem to="/category" onClick={onClose}>
                                Categories
                            </SidebarNavItem>

                            <SidebarNavItem to="/how-it-works" onClick={onClose}>
                                How It Works
                            </SidebarNavItem>

                            <SidebarNavItem to="/auction/sell" onClick={onClose}>
                                Seller Dashboard
                            </SidebarNavItem>
                        </div>

                        <SidebarNavItem to="/setting" onClick={onClose}>
                            Reset Password
                        </SidebarNavItem>
                    </SidebarSection>
                    {/*  AUCTIONS  */}
                    <SidebarSection title={`My Auctions (${auctions.length})`}>
                        {loading ? (
                            <SidebarPlaceholder text="Loading..." />
                        ) : paginatedAuctions.length ? (
                            <div className="space-y-2">
                                {paginatedAuctions.map((auction) => (
                                    <button
                                        key={auction._id}
                                        onClick={() => {
                                            navigate(`/auction/${auction._id}`);
                                            onClose();
                                        }}
                                        className="
                        w-full

                        flex items-center gap-3

                        rounded-2xl
                        border border-slate-200

                        bg-white

                        px-2.5 py-2

                        hover:border-blue-200
                        hover:bg-slate-50

                        transition-all
                    "
                                    >
                                        {/* IMAGE */}
                                        <div
                                            className="
                            h-12 w-12
                            shrink-0

                            overflow-hidden
                            rounded-xl

                            bg-slate-100
                            border border-slate-200
                        "
                                        >
                                            <img
                                                src={
                                                    Array.isArray(auction?.media?.[0])
                                                        ? auction?.media?.[0]?.[0]
                                                        : auction?.media?.[0] || defaultUp
                                                }
                                                alt={auction?.name}
                                                className="
                                h-full w-full
                                object-cover
                            "
                                            />
                                        </div>

                                        {/* CONTENT */}
                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="flex items-center justify-between gap-2">
                                                <p
                                                    className="
                                    truncate

                                    text-[13px]
                                    font-semibold

                                    text-slate-800
                                "
                                                >
                                                    {auction?.name}
                                                </p>

                                                <span
                                                    className={`
                                    shrink-0

                                    rounded-full

                                    px-2 py-[3px]

                                    text-[10px]
                                    font-medium

                                    ${
                                        auction?.status === "active"
                                            ? "bg-green-50 text-green-700"
                                            : "bg-slate-100 text-slate-600"
                                    }
                                `}
                                                >
                                                    {auction?.status}
                                                </span>
                                            </div>

                                            <div
                                                className="
                                mt-1

                                flex items-center justify-between gap-2
                            "
                                            >
                                                <p
                                                    className="
                                    truncate

                                    text-[11px]
                                    text-slate-500
                                "
                                                >
                                                    {auction?.bidCount} bids
                                                </p>

                                                <p
                                                    className="
                                    text-[12px]
                                    font-semibold

                                    text-blue-700
                                "
                                                >
                                                    ₹{auction?.currentHighestBid}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}

                                {hasMoreAuctions && (
                                    <LoadMore onClick={() => setAuctionPage((p) => p + 1)} />
                                )}
                            </div>
                        ) : (
                            <SidebarPlaceholder text="No auctions yet." />
                        )}
                    </SidebarSection>
                    {/* BIDS */}
                    <SidebarSection title={`My Bids (${bids.length})`}>
                        {loading ? (
                            <SidebarPlaceholder text="Loading..." />
                        ) : paginatedBids.length ? (
                            <div className="space-y-2">
                                {paginatedBids.map((bid) => (
                                    <button
                                        key={bid._id}
                                        onClick={() => {
                                            navigate(`/auction/${bid?.auctionId?._id}`);
                                            onClose();
                                        }}
                                        className="
                        w-full

                        flex items-center gap-3

                        rounded-2xl
                        border border-slate-200

                        bg-white

                        px-2.5 py-2

                        hover:border-emerald-200
                        hover:bg-slate-50

                        transition-all
                    "
                                    >
                                        {/* IMAGE */}
                                        <div
                                            className="
                            h-12 w-12
                            shrink-0

                            overflow-hidden
                            rounded-xl

                            bg-slate-100
                            border border-slate-200
                        "
                                        >
                                            <img
                                                src={
                                                    Array.isArray(bid?.auctionId?.media?.[0])
                                                        ? bid?.auctionId?.media?.[0]?.[0]
                                                        : bid?.auctionId?.media?.[0] || defaultUp
                                                }
                                                alt={bid?.auctionId?.name}
                                                className="
                                h-full w-full
                                object-cover
                            "
                                            />
                                        </div>

                                        {/* CONTENT */}
                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="flex items-center justify-between gap-2">
                                                <p
                                                    className="
                                    truncate

                                    text-[13px]
                                    font-semibold

                                    text-slate-800
                                "
                                                >
                                                    {bid?.auctionId?.name || "Auction"}
                                                </p>

                                                <span
                                                    className={`
                                    shrink-0

                                    rounded-full

                                    px-2 py-[3px]

                                    text-[10px]
                                    font-medium

                                    ${
                                        bid?.auctionId?.status === "active"
                                            ? "bg-green-50 text-green-700"
                                            : "bg-slate-100 text-slate-600"
                                    }
                                `}
                                                >
                                                    {bid?.auctionId?.status}
                                                </span>
                                            </div>

                                            <div
                                                className="
                                mt-1

                                flex items-center justify-between gap-2
                            "
                                            >
                                                <p
                                                    className="
                                    text-[11px]
                                    text-slate-500
                                "
                                                >
                                                    Your Bid
                                                </p>

                                                <p
                                                    className="
                                    text-[12px]
                                    font-semibold

                                    text-emerald-700
                                "
                                                >
                                                    ₹{bid?.amount}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}

                                {hasMoreBids && (
                                    <LoadMore onClick={() => setBidPage((p) => p + 1)} />
                                )}
                            </div>
                        ) : (
                            <SidebarPlaceholder text="No bids yet." />
                        )}
                    </SidebarSection>
                    {/* ERROR */}
                    {/* {error && (
                        <div
                            className="
                                text-sm text-red-500

                                border border-red-200
                                bg-red-50

                                rounded-2xl

                                px-4 py-3
                            "
                        >
                            {error}
                        </div>
                    )} */}
                </div>

                {/* FOOTER */}
                <div className="px-3 pb-3 sm:p-4">
                    <button
                        onClick={handleLogout}
                        className="
                            w-full flex items-center justify-center gap-2

                            bg-gradient-to-r
                            from-red-500
                            to-rose-500

                            hover:from-red-600
                            hover:to-rose-600

                            text-white

                            py-3

                            rounded-2xl

                            text-sm font-semibold

                            shadow-md shadow-red-500/20

                            transition-all
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

/* SMALL COMPONENTS */

function SidebarPlaceholder({ text }) {
    return (
        <div
            className="
                text-sm
                text-slate-500

                border border-dashed
                border-slate-200

                rounded-2xl

                p-3

                bg-white
            "
        >
            {text}
        </div>
    );
}

function LoadMore({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="
                w-full

                text-sm
                text-blue-600

                hover:text-blue-700
                hover:underline

                mt-2

                transition-all
            "
        >
            Load more
        </button>
    );
}
