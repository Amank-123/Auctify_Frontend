import { useEffect, useState, useRef } from "react";
import { api } from "@/shared/services/axios.js";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints.js";
import { showError, showSuccess } from "@/shared/utils/toast.js";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

/* ─── tiny helpers ─── */
const fmtINR = (n) => (n ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

const STATUS = {
    active: {
        label: "● Live",
        cls: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
    },
    draft: {
        label: "◌ Draft",
        cls: "bg-zinc-700/60     text-zinc-400   border border-zinc-600/30",
    },
    ended: {
        label: "✕ Ended",
        cls: "bg-orange-500/10  text-orange-400 border border-orange-500/20",
    },
    expired: {
        label: "⚠ Expired",
        cls: "bg-amber-500/10   text-amber-400  border border-amber-500/20",
    },
};

/* ─── animated counter ─── */
function Counter({ to, duration = 900 }) {
    const [val, setVal] = useState(0);
    useEffect(() => {
        let start = null;
        const step = (ts) => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / duration, 1);
            setVal(Math.floor(p * to));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [to, duration]);
    return <span>{val}</span>;
}

/* ─── magnetic button ─── */
function MagButton({ children, className, onClick, disabled }) {
    const ref = useRef(null);
    const x = useMotionValue(0),
        y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 200, damping: 18 });
    const sy = useSpring(y, { stiffness: 200, damping: 18 });

    const onMove = (e) => {
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.25);
    };
    const onLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.button
            ref={ref}
            style={{ x: sx, y: sy }}
            onMouseMove={onMove}
            onMouseLeave={onLeave}
            whileTap={{ scale: 0.93 }}
            onClick={onClick}
            disabled={disabled}
            className={className}
        >
            {children}
        </motion.button>
    );
}

/* ─── glowing stat card ─── */
function StatCard({ label, value, accent, delay }) {
    const [hov, setHov] = useState(false);
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 120 }}
            onHoverStart={() => setHov(true)}
            onHoverEnd={() => setHov(false)}
            className="relative overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 p-6 cursor-default"
        >
            {/* glow blob */}
            <motion.div
                animate={{ opacity: hov ? 0.4 : 0.15, scale: hov ? 1.2 : 1 }}
                transition={{ duration: 0.4 }}
                className={`absolute -top-6 -right-6 w-28 h-28 rounded-full blur-2xl ${accent}`}
            />
            <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500 mb-4">
                {label}
            </p>
            <p className="text-5xl font-black text-white tabular-nums">
                <Counter to={value} />
            </p>
        </motion.div>
    );
}

/* ─── auction row card ─── */
function AuctionCard({ auction, index, onStart, onEnd }) {
    const [expanded, setExpanded] = useState(false);
    const cfg = STATUS[auction.status] || STATUS.draft;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: index * 0.04, type: "spring", stiffness: 130 }}
            whileHover={{ y: -2 }}
            className="group relative bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-2xl overflow-hidden transition-colors duration-300"
        >
            {/* left accent stripe */}
            <motion.div
                className={`absolute left-0 top-0 bottom-0 w-1 ${
                    auction.status === "active"
                        ? "bg-emerald-500"
                        : auction.status === "draft"
                          ? "bg-zinc-600"
                          : "bg-orange-500"
                }`}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ delay: index * 0.04 + 0.15 }}
                style={{ originY: 0 }}
            />

            <div className="flex gap-5 p-5 pl-6">
                {/* thumbnail */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-zinc-800"
                >
                    <img
                        src={
                            auction.media?.[0] ||
                            "https://via.placeholder.com/200/1a1a1a/444?text=IMG"
                        }
                        alt={auction.name}
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                {/* body */}
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="font-bold text-lg text-white truncate">{auction.name}</h3>
                        <span
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full tracking-wide ${cfg.cls}`}
                        >
                            {cfg.label}
                        </span>
                    </div>

                    <motion.p
                        className="text-zinc-500 text-sm leading-relaxed line-clamp-2 mb-4 cursor-pointer"
                        onClick={() => setExpanded(!expanded)}
                        animate={{ WebkitLineClamp: expanded ? "unset" : 2 }}
                    >
                        {auction.description}
                    </motion.p>

                    <div className="flex gap-8 text-sm">
                        {[
                            {
                                lbl: "Starting",
                                val: fmtINR(auction.startPrice),
                                color: "text-zinc-300",
                            },
                            {
                                lbl: "Highest Bid",
                                val: fmtINR(auction.currentHighestBid),
                                color: "text-emerald-400 font-bold",
                            },
                            {
                                lbl: "Bids",
                                val: auction.bidCount ?? 0,
                                color: "text-orange-400 font-bold",
                            },
                        ].map(({ lbl, val, color }) => (
                            <div key={lbl}>
                                <span className="block text-[10px] uppercase tracking-widest text-zinc-600 mb-0.5">
                                    {lbl}
                                </span>
                                <span className={`${color} text-sm`}>{val}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* actions */}
                <div className="flex flex-col gap-2 w-36 flex-shrink-0 justify-center">
                    <Link
                        to={`/auction/${auction._id}`}
                        className="text-center text-xs font-semibold py-2.5 px-4 rounded-xl border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white transition-all duration-200"
                    >
                        View Details
                    </Link>

                    {auction.status === "draft" && (
                        <MagButton
                            onClick={() => onStart(auction._id)}
                            className="text-xs font-bold py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black transition-colors duration-200"
                        >
                            🚀 Go Live
                        </MagButton>
                    )}

                    {auction.status === "active" && (
                        <MagButton
                            onClick={() => onEnd(auction._id)}
                            className="text-xs font-bold py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-400 text-white transition-colors duration-200"
                        >
                            End Auction
                        </MagButton>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/* ─── skeleton loader ─── */
function Skeleton() {
    return (
        <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex gap-5 animate-pulse"
                >
                    <div className="w-20 h-20 rounded-xl bg-zinc-800 flex-shrink-0" />
                    <div className="flex-1 space-y-3 py-1">
                        <div className="h-4 bg-zinc-800 rounded w-1/3" />
                        <div className="h-3 bg-zinc-800 rounded w-2/3" />
                        <div className="h-3 bg-zinc-800 rounded w-1/4" />
                    </div>
                </div>
            ))}
        </div>
    );
}

/* ═══════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════ */
export default function SellerDashboard() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [navHov, setNavHov] = useState(null);

    const fetchAuctions = async () => {
        try {
            setLoading(true);
            const res = await api.get(API_ENDPOINTS.Auction.GET_BY_SELLER);
            setAuctions(res.data.data || []);
        } catch {
            showError("Failed to load your auctions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctions();
    }, []);

    const handleStart = async (id) => {
        try {
            await api.patch(API_ENDPOINTS.Auction.START(id));
            showSuccess("Auction is now live 🚀");
            fetchAuctions();
        } catch (err) {
            showError(err.response?.data?.message || "Failed to start auction");
        }
    };

    const handleEnd = async (id) => {
        try {
            await api.patch(API_ENDPOINTS.Auction.END(id));
            showSuccess("Auction ended successfully");
            fetchAuctions();
        } catch (err) {
            showError(err.response?.data?.message || "Failed to end auction");
        }
    };

    const filtered = auctions
        .filter((a) => filter === "all" || a.status === filter)
        .filter(
            (a) =>
                a.name.toLowerCase().includes(search.toLowerCase()) ||
                a.description?.toLowerCase().includes(search.toLowerCase()),
        );

    const stats = {
        total: auctions.length,
        live: auctions.filter((a) => a.status === "active").length,
        draft: auctions.filter((a) => a.status === "draft").length,
        ended: auctions.filter((a) => ["ended", "expired"].includes(a.status)).length,
    };

    const NAV = [
        { label: "Dashboard", icon: "▦" },
        { label: "My Auctions", icon: "⊟", active: true },
        { label: "Bids & Orders", icon: "⤢" },
        { label: "Analytics", icon: "⌇" },
        { label: "Settings", icon: "⚙" },
    ];

    const FILTERS = [
        { key: "all", label: "All" },
        { key: "active", label: "Live" },
        { key: "draft", label: "Draft" },
        { key: "ended", label: "Ended" },
    ];

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        h1, h2, h3, .display { font-family: 'Syne', sans-serif; }
        ::-webkit-scrollbar { width: 4px; } 
        ::-webkit-scrollbar-track { background: #111; }
        ::-webkit-scrollbar-thumb { background: #333; border-radius: 9999px; }

        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0.5); }
          70%  { box-shadow: 0 0 0 8px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
        .live-dot { animation: pulse-ring 1.8s ease-out infinite; }

        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer-border {
          background: linear-gradient(90deg, #27272a 25%, #3f3f46 50%, #27272a 75%);
          background-size: 200% 100%;
          animation: shimmer 2s infinite;
        }
      `}</style>

            <div className="min-h-screen bg-black text-white flex">
                {/* ── Sidebar ── */}
                <motion.aside
                    initial={{ x: -80, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 120 }}
                    className="w-60 bg-zinc-950 border-r border-zinc-800/60 h-screen fixed flex flex-col z-10"
                >
                    {/* logo */}
                    <div className="px-6 pt-8 pb-6 border-b border-zinc-800/50">
                        <div className="flex items-center gap-3">
                            <motion.div
                                whileHover={{ rotate: [0, -10, 10, 0] }}
                                transition={{ duration: 0.4 }}
                                className="w-9 h-9 bg-gradient-to-br from-orange-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20"
                            >
                                <span className="text-white font-black text-base display">A</span>
                            </motion.div>
                            <div>
                                <div className="font-black text-white text-lg leading-none display">
                                    AuctionHub
                                </div>
                                <div className="text-[10px] text-zinc-500 tracking-widest uppercase mt-0.5">
                                    Seller Portal
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* nav */}
                    <nav className="flex-1 px-4 py-6 space-y-1">
                        {NAV.map((item, i) => (
                            <motion.div
                                key={item.label}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * i + 0.1 }}
                                onHoverStart={() => setNavHov(item.label)}
                                onHoverEnd={() => setNavHov(null)}
                                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium cursor-pointer transition-colors duration-200 ${
                                    item.active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                                }`}
                            >
                                {item.active && (
                                    <motion.div
                                        layoutId="nav-active"
                                        className="absolute inset-0 bg-white/5 rounded-xl border border-zinc-700/50"
                                    />
                                )}
                                {navHov === item.label && !item.active && (
                                    <motion.div
                                        layoutId="nav-hover"
                                        className="absolute inset-0 bg-white/[0.03] rounded-xl"
                                    />
                                )}
                                <span className="text-base z-10">{item.icon}</span>
                                <span className="z-10">{item.label}</span>
                                {item.label === "My Auctions" && stats.live > 0 && (
                                    <span className="ml-auto z-10 text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded-full font-bold">
                                        {stats.live}
                                    </span>
                                )}
                            </motion.div>
                        ))}
                    </nav>

                    {/* bottom cta */}
                    <div className="p-4 border-t border-zinc-800/50">
                        <div className="bg-gradient-to-br from-orange-500/10 to-rose-600/10 border border-orange-500/20 rounded-xl p-4">
                            <p className="text-xs text-zinc-400 mb-2">Ready to sell more?</p>
                            <Link
                                to="/auction/create"
                                className="block w-full text-center text-xs font-bold py-2 bg-gradient-to-r from-orange-500 to-rose-500 rounded-lg text-white hover:opacity-90 transition-opacity"
                            >
                                + New Auction
                            </Link>
                        </div>
                    </div>
                </motion.aside>

                {/* ── Main ── */}
                <main className="flex-1 ml-60 min-h-screen">
                    <div className="max-w-6xl mx-auto px-8 py-10">
                        {/* header */}
                        <div className="flex items-start justify-between mb-10">
                            <motion.div
                                initial={{ opacity: 0, y: -16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 120 }}
                            >
                                <h1 className="text-4xl font-black display text-white leading-none">
                                    My Auctions
                                </h1>
                                <p className="text-zinc-500 text-sm mt-2">
                                    {new Date().toLocaleDateString("en-IN", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                    })}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <Link
                                    to="/auction/create"
                                    className="group flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-zinc-100 transition-colors duration-200 shadow-xl shadow-white/5"
                                >
                                    <motion.span
                                        animate={{ rotate: [0, 90, 0] }}
                                        transition={{ duration: 0.5, delay: 0.6 }}
                                        className="text-lg leading-none"
                                    >
                                        +
                                    </motion.span>
                                    Create Auction
                                </Link>
                            </motion.div>
                        </div>

                        {/* stats */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                            {[
                                { label: "Total", value: stats.total, accent: "bg-violet-500" },
                                { label: "Live Now", value: stats.live, accent: "bg-emerald-500" },
                                { label: "Drafts", value: stats.draft, accent: "bg-zinc-500" },
                                { label: "Completed", value: stats.ended, accent: "bg-orange-500" },
                            ].map((s, i) => (
                                <StatCard key={s.label} {...s} delay={0.08 * i + 0.15} />
                            ))}
                        </div>

                        {/* live alert */}
                        <AnimatePresence>
                            {stats.live > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl px-5 py-3.5">
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0 live-dot" />
                                        <p className="text-emerald-400 text-sm font-medium">
                                            <span className="font-bold">
                                                {stats.live} auction{stats.live > 1 ? "s" : ""}
                                            </span>{" "}
                                            actively receiving bids right now
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* search + filter */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.35 }}
                            className="flex flex-col sm:flex-row gap-3 mb-7"
                        >
                            <div className="relative flex-1">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                                    ⌕
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search auctions…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-600 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-600 outline-none transition-colors duration-200"
                                />
                            </div>

                            <div className="flex gap-1.5 bg-zinc-900 border border-zinc-800 rounded-xl p-1">
                                {FILTERS.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setFilter(key)}
                                        className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                                            filter === key
                                                ? "text-white"
                                                : "text-zinc-500 hover:text-zinc-300"
                                        }`}
                                    >
                                        {filter === key && (
                                            <motion.div
                                                layoutId="filter-pill"
                                                className="absolute inset-0 bg-zinc-700 rounded-lg"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 280,
                                                    damping: 26,
                                                }}
                                            />
                                        )}
                                        <span className="relative z-10">{label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* list */}
                        {loading ? (
                            <Skeleton />
                        ) : filtered.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-zinc-900 border border-zinc-800 rounded-2xl py-20 text-center"
                            >
                                <div className="text-5xl mb-4">🔍</div>
                                <p className="text-zinc-400 font-medium mb-2">No auctions found</p>
                                <p className="text-zinc-600 text-sm mb-6">
                                    Try adjusting your search or filter
                                </p>
                                <Link
                                    to="/auction/create"
                                    className="text-orange-400 text-sm font-semibold hover:text-orange-300 transition-colors"
                                >
                                    + Create a new auction
                                </Link>
                            </motion.div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                <div className="space-y-3">
                                    {filtered.map((auction, i) => (
                                        <AuctionCard
                                            key={auction._id}
                                            auction={auction}
                                            index={i}
                                            onStart={handleStart}
                                            onEnd={handleEnd}
                                        />
                                    ))}
                                </div>
                            </AnimatePresence>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
