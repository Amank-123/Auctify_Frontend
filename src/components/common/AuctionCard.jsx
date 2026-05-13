import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Clock, Gavel, Flame, TrendingUp, Tag, Users, Play } from "lucide-react";

import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { showError } from "@/shared/utils/toast";
import { useAuth } from "@/hooks/useAuth.js";
import { getCurrentTime } from "../../shared/utils/timeSync";

/* ─────────────────────────────────────────────
   COUNTDOWN HOOK
───────────────────────────────────────────── */
function useCountdown(target) {
    const calc = () => {
        if (!target) return null;
        const now = getCurrentTime();
        const diff = Math.max(0, Math.floor((new Date(target).getTime() - now) / 1000));
        if (diff === 0) return null;
        return {
            d: Math.floor(diff / 86400),
            h: Math.floor((diff % 86400) / 3600),
            m: Math.floor((diff % 3600) / 60),
            s: diff % 60,
            urgent: diff < 600,
            critical: diff < 60,
        };
    };

    const [t, setT] = useState(calc);

    useEffect(() => {
        if (!target) return;
        setT(calc());
        const id = setInterval(() => setT(calc()), 1000);
        return () => clearInterval(id);
    }, [target]);

    return t;
}

/* ─────────────────────────────────────────────
   TIMER CHIP
───────────────────────────────────────────── */
function TimerChip({ endTime, countdownEnd, auctionType }) {
    const target = auctionType === "short" ? countdownEnd : endTime;
    const t = useCountdown(target);

    if (!t) return null;

    const pad = (n) => String(n).padStart(2, "0");
    const str =
        t.d > 0 ? `${t.d}d ${pad(t.h)}h ${pad(t.m)}m` : `${pad(t.h)}:${pad(t.m)}:${pad(t.s)}`;

    return (
        <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-bold tabular-nums
            ${
                t.critical
                    ? "bg-red-600 text-white"
                    : t.urgent
                      ? "bg-orange-500 text-white"
                      : "bg-slate-900/70 text-white backdrop-blur-md"
            }`}
        >
            {t.critical ? (
                <Flame size={11} className="fill-white text-white" />
            ) : (
                <Clock size={11} strokeWidth={2.5} />
            )}
            {str}
        </div>
    );
}

/* ─────────────────────────────────────────────
   MEDIA
───────────────────────────────────────────── */
function MediaRenderer({ media, title }) {
    const [err, setErr] = useState(false);
    const [type, setType] = useState(null);

    const src = (() => {
        if (!media) return null;
        if (Array.isArray(media[0])) return media[0][0] ?? null;
        if (Array.isArray(media)) return media[0] ?? null;
        return media;
    })();

    useEffect(() => {
        if (!src) return;
        const ext = src.split("?")[0].split(".").pop().toLowerCase();
        setType(["mp4", "webm", "ogg", "mov"].includes(ext) ? "video" : "image");
    }, [src]);

    if (!src || err || !type) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 gap-2">
                <Gavel size={28} className="text-slate-300" />
                <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
                    No Preview
                </span>
            </div>
        );
    }

    if (type === "video") {
        return (
            <>
                <video
                    src={src}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    autoPlay
                    onError={() => setErr(true)}
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        <Play size={14} className="fill-white text-white ml-0.5" />
                    </div>
                </div>
            </>
        );
    }

    return (
        <img
            src={src}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            onError={() => setErr(true)}
        />
    );
}

/* ─────────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────────── */
function StatusBadge({ status, auctionType }) {
    const isShort = auctionType === "short";

    const base =
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wide border";

    const styles = {
        active: "bg-emerald-50 text-emerald-700 border-emerald-200",
        draft: "bg-slate-100 text-slate-600 border-slate-200",
        ended: "bg-slate-100 text-slate-500 border-slate-200",
        expired: "bg-red-50 text-red-700 border-red-200",
        cancelled: "bg-red-50 text-red-700 border-red-200",
        completed: "bg-blue-50 text-blue-700 border-blue-200",
        payment_pending: "bg-amber-50 text-amber-700 border-amber-200",
        failed: "bg-red-50 text-red-700 border-red-200",
    };

    const labels = {
        active: "Live",
        draft: "Upcoming",
        ended: "Ended",
        expired: "Expired",
        cancelled: "Cancelled",
        completed: "Completed",
        payment_pending: "Pending",
        failed: "Failed",
    };

    return (
        <div className={`${base} ${styles[status] || styles.draft}`}>
            {status === "active" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
            {labels[status] || "Unknown"}
            {isShort && status === "active" && (
                <span className="ml-1 text-[10px] font-medium text-amber-600 normal-case">
                    • fast
                </span>
            )}
        </div>
    );
}

/* ─────────────────────────────────────────────
   WATCHLIST BUTTON
───────────────────────────────────────────── */
function FavBtn({ auctionId, sellerId }) {
    const { User, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(false);
    const [on, setOn] = useState(false);

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
        <button
            onClick={toggle}
            disabled={loading}
            className={`
                w-8 h-8 rounded-full flex items-center justify-center
                border shadow transition-all duration-200 active:scale-90
                ${on ? "bg-red-500 border-red-400" : "bg-slate-900/50 border-white/20 backdrop-blur-sm"}
                ${loading ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:scale-110"}
            `}
        >
            <Heart
                size={13}
                strokeWidth={2}
                className={on ? "fill-white text-white" : "text-white"}
            />
        </button>
    );
}

/* ─────────────────────────────────────────────
   MAIN CARD
───────────────────────────────────────────── */
export default function AuctionCard({ auction }) {
    const navigate = useNavigate();

    const {
        _id,
        name,
        description,
        startPrice = 0,
        currentHighestBid = 0,
        bidCount = 0,
        status = "draft",
        auctionType = "long",
        category,
        media,
        sellerId,
        endTime,
        countdownEnd,
    } = auction ?? {};

    const title = name || "Untitled Auction";
    const price = currentHighestBid > 0 ? currentHighestBid : startPrice;
    const hasBids = currentHighestBid > 0;
    const isLive = status === "active";
    const showActiveBidding = isLive && hasBids;

    return (
        <article
            onClick={() => navigate(`/auction/${_id}`)}
            className="
                group relative w-full min-w-0 bg-white
                rounded-xl overflow-hidden border border-slate-200
                cursor-pointer select-none
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-md
            "
        >
            {/* MEDIA */}
            <div className="relative aspect-[4/3] sm:aspect-video overflow-hidden bg-slate-100">
                <MediaRenderer media={media} title={title} />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

                {/* TOP */}
                <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                    <StatusBadge status={status} auctionType={auctionType} />
                    <FavBtn auctionId={_id} sellerId={sellerId} />
                </div>

                {/* TIMER */}
                <div className="absolute bottom-2 right-2 z-10">
                    {isLive && (
                        <TimerChip
                            endTime={endTime}
                            countdownEnd={countdownEnd}
                            auctionType={auctionType}
                        />
                    )}
                </div>
            </div>

            {/* BODY */}
            <div className="p-3 sm:px-4 sm:pt-3 sm:pb-4 flex flex-col gap-2">
                {/* TITLE */}
                <h3 className="text-[13px] sm:text-[15px] font-semibold text-slate-900 leading-snug line-clamp-1">
                    {title}
                </h3>

                {/* DESCRIPTION */}
                {description && (
                    <p className="text-[11px] sm:text-[13px] text-slate-500 leading-relaxed line-clamp-2">
                        {description}
                    </p>
                )}

                <div className="h-px w-full bg-slate-200" />

                {/* PRICE ROW — full width, no truncation */}
                <div className="flex flex-col gap-1.5">
                    {/* Label + active indicator */}
                    <div className="flex items-center justify-between">
                        <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            {hasBids ? "Current Bid" : "Starting Bid"}
                        </span>

                        {showActiveBidding && (
                            <div className="flex items-center gap-1">
                                <TrendingUp size={10} className="text-emerald-500" />
                                <span className="text-[10px] text-emerald-600 font-medium">
                                    Active
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Price — takes full width, never truncates */}
                    <div className="flex items-baseline gap-1">
                        <span className="text-[13px] font-semibold text-slate-500">₹</span>
                        <span className="text-[20px] sm:text-[22px] font-bold text-slate-900 tracking-tight">
                            {price.toLocaleString("en-IN")}
                        </span>
                    </div>
                </div>

                {/* META ROW — bids + category side by side, no clipping */}
                {(bidCount > 0 || category?.name) && (
                    <div className="flex items-center gap-2 flex-wrap">
                        {bidCount > 0 && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 border border-blue-200 shrink-0">
                                <Users size={11} className="text-blue-600" />
                                <span className="text-[10px] sm:text-[12px] font-bold text-blue-700">
                                    {bidCount} {bidCount === 1 ? "bid" : "bids"}
                                </span>
                            </div>
                        )}

                        {category?.name && (
                            <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 border border-slate-200 min-w-0">
                                <Tag size={10} className="text-orange-500 shrink-0" />
                                {/* No truncate — wraps naturally if needed */}
                                <span className="text-[10px] sm:text-[12px] font-medium text-orange-500 capitalize break-words">
                                    {category.name.replace(/_/g, " ")}
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}
