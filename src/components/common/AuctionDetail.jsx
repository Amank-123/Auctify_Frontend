import { useParams, useNavigate } from "react-router-dom";
import { mockAuctions } from "@/features/home/pages/homePage.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

/* ─── Variants ───────────────────────────────────── */
const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 28 },
    show: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", damping: 22, stiffness: 160, delay },
    },
});

const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", damping: 20, stiffness: 160 } },
};

/* ─── Countdown ──────────────────────────────────── */
function Countdown({ endTime }) {
    const getTime = () => {
        const diff = Math.max(0, Math.floor((new Date(endTime) - new Date()) / 1000));
        return {
            h: String(Math.floor(diff / 3600)).padStart(2, "0"),
            m: String(Math.floor((diff % 3600) / 60)).padStart(2, "0"),
            s: String(diff % 60).padStart(2, "0"),
        };
    };
    const [time, setTime] = useState(getTime());
    useEffect(() => {
        const id = setInterval(() => setTime(getTime()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="grid grid-cols-3 gap-3">
            {[
                [time.h, "Hours"],
                [time.m, "Minutes"],
                [time.s, "Seconds"],
            ].map(([value, label]) => (
                <div
                    key={label}
                    className="relative rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 p-4 text-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/5 rounded-2xl" />
                    <p className="relative text-3xl font-black text-white tabular-nums tracking-tight">
                        {value}
                    </p>
                    <p className="relative text-[10px] uppercase tracking-[2px] text-blue-200 mt-1 font-semibold">
                        {label}
                    </p>
                </div>
            ))}
        </div>
    );
}

/* ─── Bid History ────────────────────────────────── */
function BidHistory({ price }) {
    const rows = [
        {
            name: "Rahul M.",
            initials: "RM",
            amount: price + 500,
            time: "Just now",
            color: "bg-blue-100 text-blue-700",
        },
        {
            name: "Aman K.",
            initials: "AK",
            amount: price,
            time: "2 min ago",
            color: "bg-slate-100 text-slate-600",
        },
        {
            name: "Priya S.",
            initials: "PS",
            amount: price - 500,
            time: "6 min ago",
            color: "bg-slate-100 text-slate-600",
        },
        {
            name: "Vikram D.",
            initials: "VD",
            amount: price - 1500,
            time: "11 min ago",
            color: "bg-slate-100 text-slate-600",
        },
    ];

    return (
        <div className="rounded-[24px] bg-white border border-slate-200/80 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-slate-900">Bid History</h3>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {rows.length} bids
                </span>
            </div>

            <div className="space-y-1">
                {rows.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className={`flex items-center justify-between py-3 ${
                            i !== rows.length - 1 ? "border-b border-slate-100" : ""
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${item.color}`}
                            >
                                {item.initials}
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                                <p className="text-xs text-slate-400">{item.time}</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <p
                                className={`text-sm font-bold ${i === 0 ? "text-blue-600" : "text-slate-700"}`}
                            >
                                ₹{item.amount.toLocaleString("en-IN")}
                            </p>
                            {i === 0 && (
                                <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    Highest
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function RelatedCard({ item, onClick }) {
    return (
        <motion.button
            variants={itemVariant}
            whileHover={{ y: -4 }}
            onClick={onClick}
            className="text-left rounded-[24px] overflow-hidden bg-white border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
        >
            <div className="overflow-hidden h-44">
                <img
                    src={item.media?.[0]}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
            </div>
            <div className="p-4">
                <p className="text-xs font-semibold uppercase tracking-[1.5px] text-blue-500 mb-1.5">
                    {item.category ?? "Auction"}
                </p>
                <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug mb-3">
                    {item.name}
                </h4>
                <div className="flex items-center justify-between">
                    <p className="text-blue-600 font-extrabold text-base">
                        ₹{(item.currentHighestBid || item.startPrice).toLocaleString("en-IN")}
                    </p>
                    <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                            item.status === "active"
                                ? "bg-green-50 text-green-600"
                                : "bg-slate-100 text-slate-500"
                        }`}
                    >
                        {item.status === "active" ? "Live" : "Ended"}
                    </span>
                </div>
            </div>
        </motion.button>
    );
}

export default function AuctionDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const auction = mockAuctions.find((item) => String(item._id) === String(id));

    const [activeThumb, setActiveThumb] = useState(0);
    const [watched, setWatched] = useState(false);
    const [bidAmount, setBidAmount] = useState("");
    const [bidMsg, setBidMsg] = useState(null);
    const [bidSuccess, setBidSuccess] = useState(false);

    if (!auction) {
        return (
            <section className="max-w-7xl mx-auto px-6 py-32 text-center">
                <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
                    <h2 className="text-5xl font-bold text-slate-900">Auction Not Found</h2>
                    <p className="mt-4 text-slate-500 text-lg">
                        This listing may have ended or does not exist.
                    </p>
                </motion.div>
            </section>
        );
    }

    const images = auction?.media?.length ? auction.media : ["/placeholder.jpg"];
    const currentImage = images[activeThumb] ?? images[0];
    const currentBid =
        auction?.currentHighestBid > 0 ? auction.currentHighestBid : auction?.startPrice || 0;
    const status = auction?.status || "draft";
    const endTime = auction?.endedTime || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();
    const related = mockAuctions.filter((i) => i._id !== auction._id).slice(0, 4);

    function handleBid() {
        const val = parseFloat(String(bidAmount).replace(/,/g, ""));
        const min = currentBid + 500;
        if (!val || val < min) {
            setBidMsg(`Minimum bid is ₹${min.toLocaleString("en-IN")}`);
            setBidSuccess(false);
            setTimeout(() => setBidMsg(null), 2800);
            return;
        }
        setBidMsg(`Bid of ₹${val.toLocaleString("en-IN")} placed successfully!`);
        setBidSuccess(true);
        setBidAmount("");
        setTimeout(() => setBidMsg(null), 3000);
    }

    const statusCfg = {
        active: { label: "Live Auction", bg: "bg-blue-600", dot: true },
        ended: { label: "Ended", bg: "bg-slate-600", dot: false },
        draft: { label: "Upcoming", bg: "bg-orange-500", dot: false },
    };
    const {
        label: statusLabel,
        bg: statusBg,
        dot: statusDot,
    } = statusCfg[status] ?? statusCfg.draft;

    return (
        <section className="bg-[#F8F8FF] min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Breadcrumb */}
                <motion.div
                    variants={fadeUp(0)}
                    initial="hidden"
                    animate="show"
                    className="flex items-center gap-2 text-sm text-slate-400 mb-8"
                >
                    <button
                        onClick={() => navigate("/")}
                        className="hover:text-blue-600 transition-colors"
                    >
                        Home
                    </button>
                    <span className="text-slate-300">›</span>
                    <button
                        onClick={() => navigate("/explore")}
                        className="hover:text-blue-600 transition-colors"
                    >
                        Auctions
                    </button>
                    <span className="text-slate-300">›</span>
                    <span className="text-slate-700 font-medium truncate max-w-[220px]">
                        {auction.name}
                    </span>
                </motion.div>

                {/* Main grid */}
                <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-start">
                    {/* ── LEFT ── */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="lg:sticky lg:top-24 space-y-5"
                    >
                        {/* Hero image */}
                        <motion.div
                            variants={itemVariant}
                            className="relative rounded-[32px] overflow-hidden bg-white border border-slate-200 shadow-sm group"
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImage}
                                    src={currentImage}
                                    alt={auction.name}
                                    initial={{ opacity: 0, scale: 1.04 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.38 }}
                                    className="w-full h-[520px] object-cover group-hover:scale-[1.02] transition-transform duration-700"
                                />
                            </AnimatePresence>

                            {/* Status badge */}
                            <div className="absolute top-5 left-5">
                                <motion.span
                                    initial={{ scale: 0.7, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ type: "spring", damping: 18, delay: 0.2 }}
                                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-widest text-white ${statusBg}`}
                                >
                                    {statusDot && (
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
                                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
                                        </span>
                                    )}
                                    {statusLabel.toUpperCase()}
                                </motion.span>
                            </div>

                            {/* Wishlist */}
                            <motion.button
                                whileHover={{ scale: 1.12 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setWatched((w) => !w)}
                                className="absolute top-5 right-5 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center border border-slate-200 shadow-sm"
                            >
                                <motion.span
                                    animate={{ scale: watched ? [1, 1.45, 1] : 1 }}
                                    transition={{ duration: 0.3 }}
                                    className={`text-lg leading-none select-none ${
                                        watched ? "text-red-500" : "text-slate-400"
                                    }`}
                                >
                                    {watched ? "♥" : "♡"}
                                </motion.span>
                            </motion.button>

                            {/* Bid count pill */}
                            <div className="absolute bottom-5 right-5">
                                <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200 shadow-sm">
                                    <span className="text-xs font-bold text-slate-700">
                                        {auction.bidCount || 0} bids
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Thumbnails */}
                        <motion.div variants={itemVariant} className="grid grid-cols-4 gap-3">
                            {images.slice(0, 4).map((img, i) => (
                                <motion.button
                                    key={i}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.96 }}
                                    onClick={() => setActiveThumb(i)}
                                    className={`rounded-2xl overflow-hidden border-2 h-20 w-full transition-colors duration-200 ${
                                        activeThumb === i
                                            ? "border-blue-600 shadow-md shadow-blue-100"
                                            : "border-slate-200 hover:border-blue-300"
                                    }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </motion.button>
                            ))}
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            variants={itemVariant}
                            className="rounded-[24px] bg-white border border-slate-200/80 p-7 shadow-sm"
                        >
                            <h3 className="text-base font-bold text-slate-900 mb-4">
                                About this listing
                            </h3>
                            <p className="text-slate-500 text-sm leading-7">
                                {auction.description ||
                                    "Premium verified auction listing on Auctify marketplace with secure bidding, transparent pricing and trusted sellers."}
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* ── RIGHT ── */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="space-y-5"
                    >
                        {/* Title block */}
                        <motion.div variants={itemVariant}>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {[auction.category ?? "General", "Verified", "Pan India"].map(
                                    (tag) => (
                                        <span
                                            key={tag}
                                            className="text-[11px] font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100"
                                        >
                                            {tag}
                                        </span>
                                    ),
                                )}
                            </div>
                            <h1 className="text-[2rem] font-extrabold text-slate-900 leading-tight tracking-tight">
                                {auction.name}
                            </h1>
                            <p className="mt-3 text-slate-500 text-sm leading-6">
                                Secure bidding, verified seller, real-time auction activity.
                            </p>
                        </motion.div>

                        {/* Countdown */}
                        {status === "active" && (
                            <motion.div variants={itemVariant}>
                                <p className="text-[11px] uppercase tracking-[2px] text-slate-400 font-semibold mb-3">
                                    Auction ends in
                                </p>
                                <Countdown endTime={endTime} />
                            </motion.div>
                        )}

                        {/* Price + bid card */}
                        <motion.div
                            variants={itemVariant}
                            className="rounded-[28px] bg-white border border-slate-200/80 p-7 shadow-sm"
                        >
                            {/* Price row */}
                            <div className="flex items-start justify-between mb-5">
                                <div>
                                    <p className="text-[10px] uppercase tracking-[2.5px] text-slate-400 font-bold mb-2">
                                        Current Highest Bid
                                    </p>
                                    <h2 className="text-4xl font-black text-slate-900 tabular-nums">
                                        ₹{currentBid.toLocaleString("en-IN")}
                                    </h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] uppercase tracking-[2.5px] text-slate-400 font-bold mb-2">
                                        Total Bids
                                    </p>
                                    <h3 className="text-3xl font-black text-slate-900">
                                        {auction.bidCount || 0}
                                    </h3>
                                </div>
                            </div>

                            {/* Reserve bar */}
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1.5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "72%" }}
                                    transition={{ duration: 0.9, ease: "easeOut", delay: 0.4 }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                                />
                            </div>
                            <p className="text-xs text-slate-400 font-medium mb-6">
                                72% of reserve met
                            </p>

                            {/* Bid input */}
                            {status === "active" && (
                                <div className="space-y-3">
                                    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-[1.5px]">
                                        Your bid amount
                                    </label>
                                    <div className="flex gap-3">
                                        <div className="relative flex-1">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                                                ₹
                                            </span>
                                            <input
                                                type="number"
                                                value={bidAmount}
                                                onChange={(e) => setBidAmount(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleBid()}
                                                placeholder={String(currentBid + 500)}
                                                className="w-full pl-8 pr-4 h-12 rounded-2xl border border-slate-200 bg-slate-50 text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition placeholder:text-slate-300"
                                            />
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.96 }}
                                            onClick={handleBid}
                                            className="px-6 h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-sm shadow-lg shadow-blue-200 transition flex-shrink-0"
                                        >
                                            Place Bid
                                        </motion.button>
                                    </div>

                                    {/* Feedback message */}
                                    <AnimatePresence>
                                        {bidMsg && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -6 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                className={`text-xs font-semibold text-center py-2 px-4 rounded-xl ${
                                                    bidSuccess
                                                        ? "bg-green-50 text-green-600"
                                                        : "bg-red-50 text-red-500"
                                                }`}
                                            >
                                                {bidMsg}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>

                                    {/* Join live */}
                                    <motion.button
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => navigate(`/auction/live/${auction._id}`)}
                                        className="w-full h-12 rounded-2xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-sm transition flex items-center justify-center gap-2"
                                    >
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-60" />
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
                                        </span>
                                        Join Live Auction
                                    </motion.button>
                                </div>
                            )}

                            {status !== "active" && (
                                <button className="w-full h-12 rounded-2xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-900 transition">
                                    View Auction
                                </button>
                            )}
                        </motion.div>

                        {/* Seller card */}
                        <motion.div
                            variants={itemVariant}
                            className="rounded-[24px] bg-white border border-slate-200/80 p-5 shadow-sm flex items-center gap-4"
                        >
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center text-white font-extrabold text-base flex-shrink-0">
                                {(auction.sellerName ?? "A")
                                    .split(" ")
                                    .map((w) => w[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[10px] uppercase tracking-[2px] text-slate-400 font-semibold">
                                    Seller
                                </p>
                                <h3 className="text-sm font-bold text-slate-900 mt-0.5 truncate">
                                    {auction.sellerName || "Auctify Verified Seller"}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    ⭐ 4.9 · 312 auctions · Verified
                                </p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition flex-shrink-0"
                            >
                                View Profile
                            </motion.button>
                        </motion.div>

                        {/* Stat chips */}
                        <motion.div variants={stagger} className="grid grid-cols-3 gap-3">
                            {[
                                [
                                    "Start Price",
                                    `₹${(auction.startPrice ?? 0).toLocaleString("en-IN")}`,
                                ],
                                ["Auction ID", `#${auction._id}`],
                                ["Status", status.charAt(0).toUpperCase() + status.slice(1)],
                                ["Min Step", "₹500"],
                                ["Condition", auction.condition ?? "Excellent"],
                                ["Delivery", "Pan India"],
                            ].map(([label, value]) => (
                                <motion.div
                                    key={label}
                                    variants={itemVariant}
                                    className="bg-white border border-slate-100 rounded-2xl p-4 text-center hover:border-blue-200 transition-colors"
                                >
                                    <p className="text-[10px] uppercase tracking-[2px] text-slate-400 font-semibold">
                                        {label}
                                    </p>
                                    <p className="mt-1.5 text-xs font-bold text-slate-900 truncate">
                                        {value}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* Bid history */}
                        <motion.div variants={itemVariant}>
                            <BidHistory price={currentBid} />
                        </motion.div>
                    </motion.div>
                </div>

                {/* ── Related Auctions ── */}
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-60px" }}
                    className="mt-20"
                >
                    <motion.div
                        variants={itemVariant}
                        className="flex items-center justify-between mb-8"
                    >
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[2px] text-blue-500 mb-1">
                                More listings
                            </p>
                            <h3 className="text-2xl font-extrabold text-slate-900">
                                Similar Auctions
                            </h3>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => navigate("/explore")}
                            className="px-5 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 text-sm font-bold hover:bg-blue-50 transition"
                        >
                            View All
                        </motion.button>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {related.map((item) => (
                            <RelatedCard
                                key={item._id}
                                item={item}
                                onClick={() => navigate(`/auction/${item._id}`)}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
