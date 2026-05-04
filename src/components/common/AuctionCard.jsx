import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Clock, Gavel, Flame, TrendingUp, Tag, Users, Play, Zap } from "lucide-react";

import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { showError } from "@/shared/utils/toast";
import { useAuth } from "@/hooks/useAuth.js";

/* ─────────────────────────────────────────────
   COUNTDOWN HOOK
───────────────────────────────────────────── */
function useCountdown(target) {
    const calc = () => {
        if (!target) return null;
        const diff = Math.max(0, Math.floor((new Date(target) - Date.now()) / 1000));
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
const STATUS_MAP = {
    active: { label: "Live", bg: "bg-emerald-500", pulse: true },
    draft: { label: "Upcoming", bg: "bg-slate-900/60 backdrop-blur-sm", pulse: false },
    ended: { label: "Ended", bg: "bg-slate-900/60 backdrop-blur-sm", pulse: false },
    payment_pending: { label: "Pending", bg: "bg-amber-500", pulse: false },
    completed: { label: "Completed", bg: "bg-emerald-600", pulse: false },
    cancelled: { label: "Cancelled", bg: "bg-red-500", pulse: false },
    expired: { label: "Expired", bg: "bg-slate-900/60 backdrop-blur-sm", pulse: false },
    failed: { label: "Failed", bg: "bg-red-600", pulse: false },
};

function StatusBadge({ status }) {
    const c = STATUS_MAP[status] ?? STATUS_MAP.draft;
    return (
        <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-white text-[11px] font-bold tracking-widest uppercase ${c.bg}`}
        >
            {c.pulse && (
                <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
                </span>
            )}
            {c.label}
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

    // "Active bidding" only when auction is live AND has actual bids
    const showActiveBidding = isLive && hasBids;

    return (
        <article
            onClick={() => navigate(`/auction/${_id}`)}
            className="
                group relative w-full bg-white
                rounded-2xl overflow-hidden border border-slate-100
                cursor-pointer select-none shadow-sm
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/80
            "
        >
            {/* ── MEDIA ── */}
            <div className="relative aspect-video overflow-hidden bg-slate-100">
                <MediaRenderer media={media} title={title} />

                {/* Gradient — stronger at bottom for chip legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/10 pointer-events-none" />

                {/* TOP ROW */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <div className="flex items-center gap-1.5">
                        <StatusBadge status={status} />
                        {/* Flash icon only for short auctions, no text */}
                        {auctionType === "short" && (
                            <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shadow-md">
                                <Zap size={13} className="fill-white text-white" />
                            </div>
                        )}
                    </div>
                    <FavBtn auctionId={_id} sellerId={sellerId} />
                </div>

                {/* BOTTOM ROW — timer right, category right */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
                    {/* left: intentionally empty — keeps image open */}
                    <div />

                    {/* right: timer stacked above category */}
                    <div className="flex flex-col items-end gap-1.5">
                        {isLive && (
                            <TimerChip
                                endTime={endTime}
                                countdownEnd={countdownEnd}
                                auctionType={auctionType}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* ── BODY ── */}
            <div className="px-4 pt-3 pb-4 flex flex-col gap-2">
                {/* Title — full width */}
                <h3 className="text-[15px] font-bold text-slate-900 leading-snug line-clamp-1 tracking-tight">
                    {title}
                </h3>

                {/* Description — full width */}
                {description && (
                    <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">
                        {description}
                    </p>
                )}

                <div className="h-px w-full bg-slate-100 " />

                {/* Price row — label, price, bid count on same line */}
                <div className="flex items-center justify-between gap-3 ">
                    {/* Left: label + price + active bidding */}
                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {hasBids ? "Current Bid" : "Starting Bid"}
                        </span>
                        <div className="flex items-baseline gap-0.5 mt-0.5">
                            <span className="text-[13px] font-extrabold text-orange-500 leading-none">
                                ₹
                            </span>
                            <span className="text-[22px] font-black text-slate-900 tracking-tight leading-none">
                                {price.toLocaleString("en-IN")}
                            </span>
                        </div>
                        {/* Only show when live + has bids */}
                        {showActiveBidding && (
                            <div className="flex items-center gap-1 mt-1">
                                <TrendingUp size={11} className="text-emerald-500 flex-shrink-0" />
                                <span className="text-[11px] text-emerald-600 font-semibold">
                                    Active bidding
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Right: bid count + category */}
                    {bidCount > 0 && (
                        <div className="flex flex-col items-end gap-1.5">
                            {/* Bid Count */}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 border border-blue-100">
                                <Users size={16} strokeWidth={2} className="text-blue-600" />
                                <span className="text-[12px] font-extrabold text-blue-700">
                                    {bidCount}
                                </span>
                                <span className="text-[12px] text-blue-500 font-semibold">
                                    {bidCount === 1 ? "bid" : "bids"}
                                </span>
                            </div>

                            {/* Category BELOW bid count */}
                            {category && (
                                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-50 border border-purple-100">
                                    <Tag size={12} strokeWidth={2.5} className="text-purple-600" />
                                    <span className="text-[12px] font-semibold text-purple-700 capitalize">
                                        {category.replace(/_/g, " ")}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}
