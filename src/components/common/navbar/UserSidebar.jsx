import { useEffect, useState } from "react";
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

export default function UserSidebar({ open, onClose, user }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [profile, setProfile] = useState(user || null);
    const [auctions, setAuctions] = useState([]);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;

        let alive = true;

        const loadSidebarData = async () => {
            try {
                setLoading(true);
                setError("");

                const [userRes, auctionRes, bidRes] = await Promise.all([
                    api.get(API_ENDPOINTS.User.GET),
                    api.get(API_ENDPOINTS.Auction.GET_BY_SELLER),
                    api.get(API_ENDPOINTS.Bid.GET_USER_BIDS),
                ]);

                if (!alive) return;

                const nextProfile = userRes?.data?.data || null;

                const nextAuctions = auctionRes?.data?.data || [];

                const nextBids = bidRes?.data?.data || [];

                setProfile(nextProfile);
                setAuctions(Array.isArray(nextAuctions) ? nextAuctions : []);
                setBids(Array.isArray(nextBids) ? nextBids : []);
            } catch (err) {
                if (!alive) return;
                setError(
                    err?.response?.data?.message ||
                        err?.message ||
                        "Failed to load dashboard data.",
                );
            } finally {
                if (alive) setLoading(false);
            }
        };

        loadSidebarData();

        return () => {
            alive = false;
        };
    }, [open, user]);

    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    const handleLogout = async () => {
        logout();
        showSuccess("User logged out successfully");
        onClose();
        navigate("/auth/login");
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[60] pointer-events-none">
            <aside className="pointer-events-auto absolute right-0 top-0 flex h-full w-[360px] max-w-[88vw] flex-col border-l border-[#E5E7EB] bg-[#FFFFFF] shadow-2xl">
                <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                onClose();
                                navigate("/profile");
                            }}
                            className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[#E5E7EB] text-lg text-[#1F2937]"
                            aria-label="Open profile"
                        >
                            {profile?.profile ? (
                                <img
                                    src={profile.profile}
                                    alt="User profile"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <img
                                    src={defaultUp}
                                    alt="User profile"
                                    className="h-full w-full object-cover"
                                />
                            )}
                        </button>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#1F2937]">
                                {profile?.firstName || "User"} {profile?.lastName || ""}
                            </p>
                            <p className="truncate text-xs text-[#6B7280]">
                                @{profile?.username || "username"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-[#6B7280] transition hover:bg-[#F8F8FF] hover:text-[#1F2937]"
                        aria-label="Close sidebar"
                    >
                        <HiOutlineX className="text-xl" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                    <SidebarSection title="Account">
                        <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8F8FF] p-4">
                            <p className="text-xs font-medium uppercase tracking-wide text-[#6B7280]">
                                Email
                            </p>
                            <p className="mt-2 break-words text-sm font-semibold text-[#1F2937]">
                                {profile?.email || "No email"}
                            </p>
                            <p className="mt-2 text-xs text-[#6B7280]">
                                Status: {profile?.status || "neutral"}
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
                        <SidebarNavItem to="/account/settings" onClick={onClose}>
                            Settings
                        </SidebarNavItem>
                        <SidebarNavItem to="/account/activity" onClick={onClose}>
                            Activity
                        </SidebarNavItem>
                    </SidebarSection>

                    <SidebarSection title={`My Auctions (${auctions.length})`}>
                        <div className="space-y-2">
                            {loading ? (
                                <SidebarPlaceholder text="Loading auctions..." />
                            ) : auctions.length > 0 ? (
                                auctions
                                    .slice(0, 6)
                                    .map((auction) => (
                                        <AuctionItem
                                            key={auction._id || auction.id}
                                            auction={auction}
                                            onClick={onClose}
                                        />
                                    ))
                            ) : (
                                <SidebarPlaceholder text="No auctions yet." />
                            )}
                        </div>
                    </SidebarSection>

                    <SidebarSection title={`My Bids (${bids.length})`}>
                        <div className="space-y-2">
                            {loading ? (
                                <SidebarPlaceholder text="Loading bids..." />
                            ) : bids.length > 0 ? (
                                bids
                                    .slice(0, 6)
                                    .map((bid) => (
                                        <BidItem
                                            key={bid._id || bid.id}
                                            bid={bid}
                                            onClick={onClose}
                                        />
                                    ))
                            ) : (
                                <SidebarPlaceholder text="No bids yet." />
                            )}
                        </div>
                    </SidebarSection>

                    <SidebarSection title="Quick stats">
                        <div className="grid grid-cols-2 gap-3">
                            <StatCard
                                label="Auctions"
                                value={profile?.auctionCount ?? auctions.length}
                            />
                            <StatCard label="Bids" value={profile?.bidCount ?? bids.length} />
                        </div>
                    </SidebarSection>

                    {/* {error && (
                        <div className="mt-4 rounded-2xl border border-[#C2410C]/20 bg-[#C2410C]/5 px-4 py-3 text-sm text-[#C2410C]">
                            {error}
                        </div>
                    )} */}
                </div>

                <div className="border-t border-[#E5E7EB] p-4">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C2410C] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#9A3412]"
                    >
                        <HiOutlineLogout className="text-lg" />
                        Logout
                    </button>
                </div>
            </aside>
        </div>
    );
}

function SidebarPlaceholder({ text }) {
    return (
        <div className="rounded-xl border border-dashed border-[#E5E7EB] bg-[#F8F8FF] px-3 py-4 text-sm text-[#6B7280]">
            {text}
        </div>
    );
}

function StatCard({ label, value }) {
    return (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#F8F8FF] p-3">
            <div className="text-xs text-[#6B7280]">{label}</div>
            <div className="mt-1 text-lg font-semibold text-[#1F2937]">{value}</div>
        </div>
    );
}
