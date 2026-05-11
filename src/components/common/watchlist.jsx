import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Heart,
    Clock,
    Gavel,
    Flame,
    TrendingUp,
    Tag,
    Users,
    Play,
    Loader2,
    ArrowRight,
    Sparkles,
    Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { getCurrentTime } from "@/shared/utils/timeSync";

/* ─────────────────────────────────────────────
   COUNTDOWN HOOK  (identical to AuctionCard)
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
   TIMER CHIP  (identical to AuctionCard)
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
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-bold tabular-nums ${
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
   MEDIA RENDERER  (identical to AuctionCard)
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
   STATUS BADGE  (identical to AuctionCard)
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
   REMOVE BUTTON  (replaces FavBtn — already saved)
───────────────────────────────────────────── */
function RemoveBtn({ onRemove, loading }) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onRemove();
            }}
            disabled={loading}
            className={`
                w-8 h-8 rounded-full flex items-center justify-center
                border shadow transition-all duration-200 active:scale-90
                bg-red-500 border-red-400
                ${loading ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:scale-110 hover:bg-red-600"}
            `}
        >
            <Heart size={13} strokeWidth={2} className="fill-white text-white" />
        </button>
    );
}

/* ─────────────────────────────────────────────
   WATCHLIST CARD  (AuctionCard layout, watchlist data)
───────────────────────────────────────────── */
function WatchlistCard({ item, onRemove, isRemoving }) {
    const navigate = useNavigate();

    const {
        _id,
        name,
        description,
        startPrice = 0,
        currentHighestBid = 0,
        currentBid = 0,
        bidCount = 0,
        status = "draft",
        auctionType = "long",
        category,
        media,
        sellerId,
        endTime,
        countdownEnd,
    } = item ?? {};

    const title = name || "Untitled Auction";
    const price =
        currentHighestBid > 0 ? currentHighestBid : currentBid > 0 ? currentBid : startPrice;
    const hasBids = currentHighestBid > 0 || currentBid > 0;
    const isLive = status === "active";
    const showActive = isLive && hasBids;

    return (
        <motion.article
            layout
            variants={{
                hidden: { opacity: 0, y: 20, scale: 0.97 },
                show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 300, damping: 28 },
                },
                exit: {
                    opacity: 0,
                    scale: 0.93,
                    y: -8,
                    transition: { duration: 0.2, ease: "easeIn" },
                },
            }}
            animate={isRemoving ? { opacity: 0.3, scale: 0.96 } : {}}
            onClick={() => navigate(`/auction/${_id}`)}
            className="
                group relative w-full bg-white
                rounded-xl overflow-hidden border border-slate-200
                cursor-pointer select-none
                transition-all duration-300 ease-out
                hover:-translate-y-1 hover:shadow-md
            "
        >
            {/* MEDIA */}
            <div className="relative aspect-video overflow-hidden bg-slate-100">
                <MediaRenderer media={media} title={title} />

                {/* gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent pointer-events-none" />

                {/* TOP ROW: status badge + remove btn */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                    <StatusBadge status={status} auctionType={auctionType} />
                    <RemoveBtn onRemove={() => onRemove(_id)} loading={isRemoving} />
                </div>

                {/* TIMER — bottom right */}
                <div className="absolute bottom-3 right-3 z-10">
                    {isLive && (
                        <TimerChip
                            endTime={endTime}
                            countdownEnd={countdownEnd}
                            auctionType={auctionType}
                        />
                    )}
                </div>
            </div>

            {/* BODY — exactly matching AuctionCard */}
            <div className="px-4 pt-3 pb-4 flex flex-col gap-2">
                {/* TITLE */}
                <h3 className="text-[15px] font-semibold text-slate-900 leading-snug line-clamp-1">
                    {title}
                </h3>

                {/* DESCRIPTION */}
                {description && (
                    <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-2">
                        {description}
                    </p>
                )}

                <div className="h-px w-full bg-slate-200" />

                {/* PRICE + META */}
                <div className="flex items-center justify-between gap-3">
                    {/* LEFT — price */}
                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            {hasBids ? "Current Bid" : "Starting Bid"}
                        </span>
                        <div className="flex items-baseline gap-1 mt-0.5">
                            <span className="text-[13px] font-semibold text-slate-500">₹</span>
                            <span className="text-[22px] font-bold text-slate-900 tracking-tight">
                                {price.toLocaleString("en-IN")}
                            </span>
                        </div>
                        {showActive && (
                            <div className="flex items-center gap-1 mt-1">
                                <TrendingUp size={11} className="text-emerald-500" />
                                <span className="text-[11px] text-emerald-600 font-medium">
                                    Active bidding
                                </span>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — bid count + category */}
                    <div className="flex flex-col items-end gap-1.5">
                        {bidCount > 0 && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 border border-blue-200">
                                <Users size={14} className="text-blue-600" />
                                <span className="text-[12px] font-bold text-blue-700">
                                    {bidCount}
                                </span>
                                <span className="text-[12px] text-blue-600 font-medium">
                                    {bidCount === 1 ? "bid" : "bids"}
                                </span>
                            </div>
                        )}

                        {category?.name && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">
                                <Tag size={12} className="text-orange-500" />
                                <span className="text-[12px] font-medium text-orange-500 capitalize">
                                    {category.name.replace(/_/g, " ")}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.article>
    );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function Watchlist() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [items, setItems] = useState([]);
    const [removingId, setRemovingId] = useState(null);

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            setLoading(true);
            const res = await api.get(API_ENDPOINTS.User.FETCH_WATCHLIST);
            setItems(res?.data?.data || []);
        } catch (e) {
            console.error(e);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    const removeWatchlist = async (id) => {
        try {
            setRemovingId(id);
            await api.post(API_ENDPOINTS.User.TOGGLE_WATCHLIST(id));
            setTimeout(() => {
                setItems((prev) => prev.filter((i) => i._id !== id));
                setRemovingId(null);
            }, 240);
        } catch (e) {
            console.error(e);
            setRemovingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#EEF2F8] px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
            <div className="max-w-screen-xl mx-auto">
                {/* ── HEADER ── */}
                <motion.div
                    initial={{ opacity: 0, y: -16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.42, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-7"
                >
                    <div className="flex items-center gap-3">
                        <div className="relative shrink-0">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md shadow-blue-600/30">
                                <Heart size={19} className="text-white fill-white" />
                            </div>
                            {!loading && items.length > 0 && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                                    <span className="relative inline-flex h-3 w-3 rounded-full bg-orange-500 border-2 border-white" />
                                </span>
                            )}
                        </div>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                                Your{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                                    Watchlist
                                </span>
                            </h1>
                            <p className="text-slate-400 text-xs mt-0.5 font-medium">
                                Auctions you're tracking
                            </p>
                        </div>
                    </div>

                    <AnimatePresence>
                        {!loading && items.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.78 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.78 }}
                                transition={{
                                    delay: 0.28,
                                    type: "spring",
                                    stiffness: 320,
                                    damping: 22,
                                }}
                                className="self-start sm:self-auto inline-flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow shadow-orange-400/30"
                            >
                                <Sparkles size={12} />
                                {items.length} {items.length === 1 ? "Item" : "Items"} Saved
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* divider */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                    className="h-px bg-gradient-to-r from-blue-200/60 via-slate-200 to-orange-200/60 mb-7 origin-left"
                />

                {/* ── LOADING ── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-36 gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/30">
                            <Loader2 className="animate-spin text-white" size={26} />
                        </div>
                        <p className="text-slate-400 text-sm font-medium animate-pulse">
                            Fetching your watchlist…
                        </p>
                    </div>
                ) : items.length === 0 ? (
                    /* ── EMPTY ── */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.36 }}
                        className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 sm:p-20 text-center"
                    >
                        <motion.div
                            initial={{ scale: 0, rotate: -12 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.1, type: "spring", stiffness: 270, damping: 20 }}
                            className="w-20 h-20 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center mx-auto"
                        >
                            <Heart size={32} className="text-blue-400" />
                        </motion.div>
                        <h3 className="text-2xl font-extrabold text-slate-800 mt-5">
                            Nothing saved yet
                        </h3>
                        <p className="text-slate-400 mt-2 text-sm max-w-xs mx-auto leading-relaxed">
                            Tap the heart on any auction to save it here and never miss a bid.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.04, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate("/categories")}
                            className="mt-7 inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/35 transition-shadow text-sm"
                        >
                            Explore Auctions <ArrowRight size={14} />
                        </motion.button>
                    </motion.div>
                ) : (
                    /* ── GRID — same columns as auction listing ── */
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5"
                    >
                        <AnimatePresence mode="popLayout">
                            {items.map((item) => (
                                <WatchlistCard
                                    key={item._id}
                                    item={item}
                                    onRemove={removeWatchlist}
                                    isRemoving={removingId === item._id}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* bottom nudge */}
                {!loading && items.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55 }}
                        className="flex justify-center mt-8"
                    >
                        <button
                            onClick={() => navigate("/category")}
                            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline underline-offset-2 transition-colors"
                        >
                            <Sparkles size={13} />
                            Discover more auctions
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
