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
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { getCurrentTime } from "@/shared/utils/timeSync";

/* ─────────────────────────────────────────────
   COUNTDOWN
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

        const id = setInterval(() => {
            setT(calc());
        }, 1000);

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
            className={`
                flex items-center gap-1.5
                px-2 py-1 rounded-lg
                text-[11px] font-bold
                backdrop-blur-md
                ${
                    t.critical
                        ? "bg-red-600 text-white"
                        : t.urgent
                          ? "bg-orange-500 text-white"
                          : "bg-black/65 text-white"
                }
            `}
        >
            {t.critical ? <Flame size={10} className="fill-white" /> : <Clock size={10} />}

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
            <div
                className="
                    w-full h-full
                    flex items-center justify-center
                    bg-slate-100
                "
            >
                <Gavel size={28} className="text-slate-300" />
            </div>
        );
    }

    if (type === "video") {
        return (
            <>
                <video
                    src={src}
                    className="
                        w-full h-full object-cover
                    "
                    muted
                    loop
                    autoPlay
                    playsInline
                    onError={() => setErr(true)}
                />

                <div
                    className="
                        absolute inset-0
                        flex items-center justify-center
                    "
                >
                    <div
                        className="
                            w-9 h-9 rounded-full
                            bg-black/40
                            flex items-center justify-center
                        "
                    >
                        <Play
                            size={14}
                            className="
                                fill-white text-white ml-0.5
                            "
                        />
                    </div>
                </div>
            </>
        );
    }

    return (
        <img
            src={src}
            alt={title}
            className="
                w-full h-full object-cover
                transition-transform duration-500
                group-hover:scale-105
            "
            onError={() => setErr(true)}
        />
    );
}

/* ─────────────────────────────────────────────
   STATUS
───────────────────────────────────────────── */
function StatusBadge({ status, auctionType }) {
    const base =
        "inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold uppercase border";

    const styles = {
        active: "bg-emerald-50 text-emerald-700 border-emerald-200",
        ended: "bg-slate-100 text-slate-500 border-slate-200",
        draft: "bg-slate-100 text-slate-600 border-slate-200",
    };

    return (
        <div className={`${base} ${styles[status] || styles.draft}`}>
            {status === "active" && (
                <span
                    className="
                        w-1.5 h-1.5 rounded-full
                        bg-emerald-500
                    "
                />
            )}

            {status}
        </div>
    );
}

/* ─────────────────────────────────────────────
   REMOVE BUTTON
───────────────────────────────────────────── */
function RemoveBtn({ onRemove }) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onRemove();
            }}
            className="
                w-9 h-9 rounded-full
                bg-red-500
                flex items-center justify-center
                shadow-md
                transition-all duration-200
                hover:scale-110
                active:scale-90
            "
        >
            <Heart
                size={14}
                className="
                    fill-white text-white
                "
            />
        </button>
    );
}

/* ─────────────────────────────────────────────
   CARD
───────────────────────────────────────────── */
function WatchlistCard({ item, onRemove }) {
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
        endTime,
        countdownEnd,
    } = item ?? {};

    const title = name || "Untitled";

    const price =
        currentHighestBid > 0 ? currentHighestBid : currentBid > 0 ? currentBid : startPrice;

    const hasBids = currentHighestBid > 0 || currentBid > 0;

    const isLive = status === "active";

    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.95,
            }}
            animate={{
                opacity: 1,
                scale: 1,
            }}
            exit={{
                opacity: 0,
                scale: 0.8,
            }}
            transition={{
                duration: 0.18,
            }}
            className="w-full"
        >
            <div
                onClick={() => navigate(`/auction/${_id}`)}
                className="
                    group bg-white
                    rounded-2xl overflow-hidden
                    border border-slate-200
                    shadow-sm
                    hover:shadow-md
                    transition-all duration-300
                    cursor-pointer
                    h-full
                    flex flex-col
                "
            >
                {/* IMAGE */}
                <div
                    className="
                        relative
                        aspect-[16/10]
                        overflow-hidden
                        bg-slate-100
                        shrink-0
                    "
                >
                    <MediaRenderer media={media} title={title} />

                    <div
                        className="
                            absolute inset-0
                            bg-gradient-to-t
                            from-black/40
                            via-transparent
                            to-transparent
                        "
                    />

                    <div
                        className="
                            absolute top-3 left-3 right-3
                            flex items-center justify-between
                        "
                    >
                        <StatusBadge status={status} auctionType={auctionType} />

                        <RemoveBtn onRemove={() => onRemove(_id)} />
                    </div>

                    {isLive && (
                        <div
                            className="
                                absolute bottom-3 right-3
                            "
                        >
                            <TimerChip
                                endTime={endTime}
                                countdownEnd={countdownEnd}
                                auctionType={auctionType}
                            />
                        </div>
                    )}
                </div>

                {/* BODY */}
                <div
                    className="
                        p-3 sm:p-4
                        flex flex-col
                        flex-1
                    "
                >
                    <h3
                        className="
                            text-[14px] sm:text-[15px]
                            font-bold
                            text-slate-900
                            line-clamp-1
                        "
                    >
                        {title}
                    </h3>

                    {description && (
                        <p
                            className="
                                mt-1
                                text-[12px]
                                text-slate-500
                                line-clamp-2
                                min-h-[32px]
                            "
                        >
                            {description}
                        </p>
                    )}

                    <div
                        className="
                            h-px bg-slate-200
                            my-3
                        "
                    />

                    {/* PRICE */}
                    <div className="mt-auto">
                        <span
                            className="
                                text-[10px]
                                uppercase
                                font-bold
                                text-slate-400
                            "
                        >
                            {hasBids ? "Current Bid" : "Starting Bid"}
                        </span>

                        <div
                            className="
                                flex items-baseline
                                gap-1 mt-1
                            "
                        >
                            <span
                                className="
                                    text-[14px]
                                    font-bold
                                "
                            >
                                ₹
                            </span>

                            <span
                                className="
                                    text-[22px]
                                    font-extrabold
                                    text-slate-900
                                    leading-none
                                "
                            >
                                {price.toLocaleString("en-IN")}
                            </span>
                        </div>

                        {/* FOOTER */}
                        <div
                            className="
                                flex items-center
                                justify-between
                                mt-3
                                gap-2
                            "
                        >
                            {bidCount > 0 ? (
                                <div
                                    className="
                                        flex items-center
                                        gap-1.5
                                        px-2.5 py-1.5
                                        rounded-lg
                                        bg-blue-50
                                        border border-blue-200
                                        text-blue-700
                                        text-[12px]
                                        font-bold
                                    "
                                >
                                    <Users size={12} />
                                    {bidCount} {bidCount === 1 ? "bid" : "bids"}
                                </div>
                            ) : (
                                <div />
                            )}

                            {category?.name && (
                                <div
                                    className="
                                        flex items-center
                                        gap-1
                                        text-orange-500
                                        text-[11px]
                                        font-semibold
                                    "
                                >
                                    <Tag size={11} />

                                    {category.name.replace(/_/g, " ")}
                                </div>
                            )}
                        </div>

                        {isLive && (
                            <div
                                className="
                                    flex items-center
                                    gap-1 mt-2
                                    text-emerald-600
                                    text-[11px]
                                    font-semibold
                                "
                            >
                                <TrendingUp size={11} />
                                Active bidding
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/* ─────────────────────────────────────────────
   MAIN
───────────────────────────────────────────── */
export default function Watchlist() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const [items, setItems] = useState([]);

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const fetchWatchlist = async () => {
        try {
            setLoading(true);

            const res = await api.get(API_ENDPOINTS.User.FETCH_WATCHLIST);

            setItems(res?.data?.data || []);
        } catch (e) {
            //console.error(e);
            setItems([]);
        } finally {
            setLoading(false);
        }
    };

    /* REMOVE */
    const removeWatchlist = async (id) => {
        const previousItems = items;

        // instant remove
        setItems((prev) => prev.filter((item) => item._id !== id));

        try {
            await api.post(API_ENDPOINTS.User.TOGGLE_WATCHLIST(id));
        } catch (e) {
            //console.error(e);

            // rollback
            setItems(previousItems);
        }
    };

    return (
        <div
            className="
                min-h-screen
                bg-[#EEF2F8]
                px-4 sm:px-6 lg:px-10
                py-8
            "
        >
            <div className="max-w-[1400px] mx-auto">
                {/* HEADER */}
                <div
                    className="
                        flex flex-col
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        gap-4
                        mb-8
                    "
                >
                    <div>
                        <h1
                            className="
                                text-3xl
                                font-extrabold
                                text-slate-900
                            "
                        >
                            Your{" "}
                            <span
                                className="
                                    text-blue-600
                                "
                            >
                                Watchlist
                            </span>
                        </h1>

                        <p
                            className="
                                text-slate-500
                                mt-1
                            "
                        >
                            Auctions you're tracking
                        </p>
                    </div>

                    {!loading && items.length > 0 && (
                        <div
                            className="
                                    inline-flex
                                    items-center gap-2
                                    bg-orange-500
                                    text-white
                                    px-4 py-2
                                    rounded-full
                                    font-bold
                                    text-sm
                                    w-fit
                                "
                        >
                            <Sparkles size={13} />
                            {items.length} {items.length === 1 ? "Item" : "Items"} Saved
                        </div>
                    )}
                </div>

                {/* LOADING */}
                {loading ? (
                    <div
                        className="
                            flex items-center
                            justify-center
                            py-32
                        "
                    >
                        <Loader2
                            size={32}
                            className="
                                animate-spin
                                text-blue-600
                            "
                        />
                    </div>
                ) : items.length === 0 ? (
                    /* EMPTY */
                    <div
                        className="
                            bg-white
                            rounded-3xl
                            border border-slate-200
                            p-16
                            text-center
                        "
                    >
                        <div
                            className="
                                w-20 h-20
                                rounded-full
                                bg-blue-50
                                flex items-center
                                justify-center
                                mx-auto
                            "
                        >
                            <Heart
                                size={34}
                                className="
                                    text-blue-400
                                "
                            />
                        </div>

                        <h2
                            className="
                                mt-6
                                text-2xl
                                font-extrabold
                            "
                        >
                            Nothing saved yet
                        </h2>

                        <p
                            className="
                                mt-3
                                text-slate-500
                            "
                        >
                            Save auctions to your watchlist.
                        </p>

                        <button
                            onClick={() => navigate("/categories")}
                            className="
                                mt-7
                                inline-flex
                                items-center gap-2
                                bg-blue-600
                                text-white
                                px-6 py-3
                                rounded-xl
                                font-semibold
                            "
                        >
                            Explore Auctions
                            <ArrowRight size={16} />
                        </button>
                    </div>
                ) : (
                    <>
                        {/* GRID */}
                        <div
                            className="
                                grid
                                grid-cols-2
                                sm:grid-cols-2
                                md:grid-cols-3
                                lg:grid-cols-4
                                xl:grid-cols-5
                                gap-4 sm:gap-5
                                items-start
                            "
                        >
                            <AnimatePresence initial={false}>
                                {items.map((item) => (
                                    <WatchlistCard
                                        key={item._id}
                                        item={item}
                                        onRemove={removeWatchlist}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* FOOTER */}
                        <div
                            className="
                                flex justify-center
                                mt-10
                            "
                        >
                            <button
                                onClick={() => navigate("/category")}
                                className="
                                    inline-flex
                                    items-center gap-2
                                    text-blue-600
                                    hover:text-blue-700
                                    font-semibold
                                "
                            >
                                <Sparkles size={14} />
                                Discover more auctions
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
