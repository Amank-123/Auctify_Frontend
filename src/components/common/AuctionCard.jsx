import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Clock, Tag, Gavel, Flame, TrendingUp } from "lucide-react";

import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { showError } from "@/shared/utils/toast";
// import { AuthContext } from "@/context/AuthContext";
import { useAuth } from "@/hooks/useAuth.js";
const AUCTION_DURATION_HOURS = 2;

/* ── COUNTDOWN ── */
function Countdown({ endsAt }) {
    const calc = () => {
        if (!endsAt) return { h: "00", m: "00", s: "00", urgent: false };
        const diff = Math.max(0, Math.floor((new Date(endsAt) - Date.now()) / 1000));
        return {
            h: String(Math.floor(diff / 3600)).padStart(2, "0"),
            m: String(Math.floor((diff % 3600) / 60)).padStart(2, "0"),
            s: String(diff % 60).padStart(2, "0"),
            urgent: diff < 600,
        };
    };

    const [t, setT] = useState(calc);
    useEffect(() => {
        const id = setInterval(() => setT(calc()), 1000);
        return () => clearInterval(id);
    }, [endsAt]);

    return (
        <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold mb-2.5 border
            ${
                t.urgent
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-blue-50 border-blue-200 text-[#1a3db5]"
            }`}
        >
            {t.urgent ? (
                <Flame size={11} className="fill-red-500 text-red-500" />
            ) : (
                <Clock size={11} strokeWidth={2.5} />
            )}
            <span className="tabular-nums tracking-wider">
                {t.h}:{t.m}:{t.s}
            </span>
            {t.urgent && <span className="font-semibold text-red-500">· Ending soon</span>}
        </div>
    );
}

/* ── WATCHLIST BUTTON — hooks-rule-safe ── */
function FavBtn({ auctionId, sellerId }) {
    const { User, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [on, setOn] = useState(false);

    // ✅ ALL hooks at top — no early returns before this
    useEffect(() => {
        if (!auctionId || !User?._id) return;
        (async () => {
            try {
                const { data } = await api.get(API_ENDPOINTS.User.FETCH_WATCHLIST);
                setOn(data?.data?.some((item) => item?._id === auctionId));
            } catch (e) {
                console.error(e);
            }
        })();
    }, [auctionId, User?._id]);

    // ✅ Early returns AFTER all hooks
    if (authLoading || !User?._id || User._id === sellerId) return null;

    const toggle = async (e) => {
        e.stopPropagation();
        if (loading) return;
        try {
            setLoading(true);
            await api.post(API_ENDPOINTS.User.TOGGLE_WATCHLIST(auctionId));
            setOn((p) => !p);
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to update watchlist");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.button
            whileTap={{ scale: 0.82 }}
            whileHover={{ scale: 1.1 }}
            onClick={toggle}
            disabled={loading}
            className={`w-8 h-8 rounded-full flex items-center justify-center border backdrop-blur-sm shadow-md transition-all
                ${on ? "bg-red-50 border-red-200" : "bg-white/85 border-white/60"}
                ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
            <Heart
                size={14}
                strokeWidth={2}
                className={on ? "fill-red-500 text-red-500" : "text-gray-400"}
            />
        </motion.button>
    );
}

/* ── STATUS BADGE ── */
function StatusBadge({ status, isActive }) {
    const map = {
        active: {
            label: "Live",
            cls: "bg-emerald-50 text-emerald-700 border-emerald-200",
            dot: "bg-emerald-500 animate-pulse",
        },
        draft: {
            label: "Upcoming",
            cls: "bg-blue-50 text-[#1a3db5] border-blue-200",
            dot: "bg-[#1a3db5]",
        },
        ended: {
            label: "Ended",
            cls: "bg-gray-100 text-gray-500 border-gray-200",
            dot: "bg-gray-400",
        },
        expired: {
            label: "Expired",
            cls: "bg-orange-50 text-orange-700 border-orange-200",
            dot: "bg-orange-500",
        },
    };
    const c = map[isActive ? "active" : status] ?? map.draft;
    return (
        <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold tracking-wide ${c.cls}`}
        >
            <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </div>
    );
}

/* ── MAIN CARD ── */
export default function AuctionCard({ auction }) {
    const navigate = useNavigate();
    const [imgErr, setImgErr] = useState(false);
    const [hovered, setHovered] = useState(false);

    const image = auction?.media?.[0];
    // console.log("images from auction card: ", image);

    const title = auction?.name || "Untitled Auction";
    const category = auction?.category || "";
    const price =
        auction?.currentHighestBid > 0 ? auction.currentHighestBid : auction?.startPrice || 0;
    const status = auction?.status || "draft";
    const hasBids = auction?.currentHighestBid > 0;

    const endsAt = auction?.startTime
        ? new Date(new Date(auction.startTime).getTime() + AUCTION_DURATION_HOURS * 3600 * 1000)
        : null;
    const isActive = status === "active" && endsAt && new Date(endsAt) > new Date();

    return (
        <motion.div
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => navigate(`/auction/${auction._id}`)}
            className="
        relative w-full max-w-sm 
        bg-white rounded-2xl overflow-hidden 
        border border-gray-100 
        cursor-pointer select-none
        transition-shadow duration-300
        hover:shadow-xl
    "
        >
            {/* MEDIA */}
            <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                {image ? (
                    image.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={title}
                            className="w-full h-full object-cover"
                        />
                    ))
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50">
                        <Gavel size={40} className="text-[#e87c1e] opacity-60" />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                {/* TOP BADGES */}
                <div className="absolute top-3 left-3">
                    <StatusBadge status={status} isActive={isActive} />
                </div>

                <div className="absolute top-3 right-3">
                    <FavBtn auctionId={auction._id} sellerId={auction.sellerId} />
                </div>

                {/* BOTTOM META */}
                <div className="absolute bottom-3 left-3">
                    {category && (
                        <div className="px-2 py-1 rounded-md bg-white/90 text-[11px] font-semibold text-[#1a3db5]">
                            {category}
                        </div>
                    )}
                </div>

                {hasBids && (
                    <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-white/90 text-[11px] font-semibold text-emerald-600">
                        {auction.totalBids ?? ""} bids
                    </div>
                )}
            </div>

            {/* BODY */}
            <div className="p-4 space-y-3">
                {isActive && <Countdown endsAt={endsAt} />}

                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">{title}</h3>

                {/* PRICE */}
                <div className="rounded-xl p-3 border bg-orange-50 border-orange-100 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-semibold uppercase text-orange-500">
                            {hasBids ? "Current Bid" : "Starting Bid"}
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                            ₹{price.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center">
                        <Gavel size={16} className="text-white" />
                    </div>
                </div>

                {/* CTA */}
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/auction/${auction._id}`);
                    }}
                    className={`
                w-full py-2.5 rounded-lg text-sm font-semibold 
                transition-all flex items-center justify-center gap-2
                ${
                    isActive
                        ? "bg-orange-500 text-white hover:bg-orange-600"
                        : "bg-gray-100 text-gray-600"
                }
            `}
                >
                    {isActive ? "Place Bid" : "View Details"}
                </motion.button>
            </div>
        </motion.div>
    );
}
