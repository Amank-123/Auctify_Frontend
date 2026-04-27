import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { fadeUp, stagger, itemVariant } from "../constants/auctionVariants";
import { Countdown } from "../components/Countdown";
import { RelatedCard } from "../components/RelatedCard";
import { SellerCard } from "../components/SellerCard";
import { BidPanel } from "../components/BidPanel";
import { BidHistory } from "../components/BidHistory";
import { auctionAPI } from "../auctionAPI";
import { mockAuctions } from "../../home/pages/homePage";
import { useAuth } from "../../../hooks/useAuth";

export default function AuctionDetails() {
    const { User } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeThumb, setActiveThumb] = useState(0);
    const [watched, setWatched] = useState(false);
    const [auction, setAuction] = useState(null);
    const [canBid, setCanBid] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                const data = await auctionAPI.getById(id);
                setAuction(data);
<<<<<<< Updated upstream
                if (data.sellerId === User._id) {
=======

                if (User?._id && data?.sellerId._id === User._id) {
>>>>>>> Stashed changes
                    setCanBid(false);
                }
            } catch (err) {
                setAuction(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAuction();
    }, [id]);

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

    /* ---------------- Data ---------------- */
    const images = auction?.media?.[0]?.length > 0 ? auction.media?.[0] : ["/placeholder.jpg"];

    const currentImage = images[activeThumb] || images[0];

    const currentBid =
        auction?.currentHighestBid > 0 ? auction.currentHighestBid : auction?.startPrice || 0;
    const status = auction?.status || "draft";

    const endTime = auction?.endTime || auction?.countdownEnd;
<<<<<<< Updated upstream
=======

    // const endTime = auction?.endTime || auction?.countdownEnd;
>>>>>>> Stashed changes

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
                                    className={`text-lg leading-none select-none ${watched ? "text-red-500" : "text-slate-400"}`}
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
                                {[auction.category ?? "General"].map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[11px] font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100"
                                    >
                                        {tag}
                                    </span>
                                ))}
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

                        {/* Bid panel */}
                        <motion.div variants={itemVariant}>
                            <BidPanel
                                canBid={canBid}
                                currentBid={currentBid}
                                bidCount={auction.bidCount}
                                status={status}
                                auctionId={auction._id}
                            />
                        </motion.div>

                        {/* Seller card */}
                        <motion.div variants={itemVariant}>
                            <SellerCard sellerName={auction.sellerName} />
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
                            <BidHistory auctionId={id} />
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
