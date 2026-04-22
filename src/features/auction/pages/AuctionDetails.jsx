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
                setLoading(true);

                const data = await auctionAPI.getById(id);

                setAuction(data);

                if (User?._id && data?.sellerId === User._id) {
                    setCanBid(false);
                } else {
                    setCanBid(true);
                }
            } catch (error) {
                setAuction(null);
            } finally {
                setLoading(false);
            }
        };

        fetchAuction();
    }, [id, User]);

    /* ---------------- Loading ---------------- */
    if (loading) {
        return (
            <section className="bg-[#F8F8FF] min-h-screen py-24">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-bold text-slate-900">Loading Auction...</h2>

                    <p className="mt-4 text-slate-500">Please wait while we fetch the listing.</p>
                </div>
            </section>
        );
    }

    /* ---------------- Not Found ---------------- */
    if (!auction) {
        return (
            <section className="bg-[#F8F8FF] min-h-screen py-24">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-5xl font-bold text-slate-900">Auction Not Found</h2>

                    <p className="mt-4 text-slate-500 text-lg">
                        This listing may have ended or does not exist.
                    </p>

                    <button
                        onClick={() => navigate("/explore")}
                        className="mt-8 px-8 h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                    >
                        Browse Auctions
                    </button>
                </div>
            </section>
        );
    }

    /* ---------------- Data ---------------- */
    const images = auction?.media?.length > 0 ? auction.media : ["/placeholder.jpg"];

    const currentImage = images[activeThumb] || images[0];

    const currentBid =
        auction?.currentHighestBid > 0 ? auction.currentHighestBid : auction?.startPrice || 0;

    const status = auction?.status || "draft";

    const endTime = auction?.endedTime || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString();

    const statusConfig = {
        active: {
            label: "Live Auction",
            bg: "bg-blue-600",
            dot: true,
        },
        ended: {
            label: "Ended",
            bg: "bg-slate-600",
            dot: false,
        },
        expired: {
            label: "Expired",
            bg: "bg-red-500",
            dot: false,
        },
        draft: {
            label: "Upcoming",
            bg: "bg-orange-500",
            dot: false,
        },
    };

    const config = statusConfig[status] || statusConfig.draft;

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
                        className="hover:text-blue-600 transition"
                    >
                        Home
                    </button>

                    <span>›</span>

                    <button
                        onClick={() => navigate("/explore")}
                        className="hover:text-blue-600 transition"
                    >
                        Auctions
                    </button>

                    <span>›</span>

                    <span className="text-slate-700 font-medium truncate max-w-[220px]">
                        {auction.name}
                    </span>
                </motion.div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-10 items-start">
                    {/* LEFT */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="space-y-5 lg:sticky lg:top-24"
                    >
                        {/* Hero Image */}
                        <motion.div
                            variants={itemVariant}
                            className="relative rounded-[32px] overflow-hidden bg-white border border-slate-200 shadow-sm group"
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImage}
                                    src={currentImage}
                                    alt={auction.name}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.35 }}
                                    className="w-full h-[520px] object-cover group-hover:scale-[1.02] transition duration-700"
                                />
                            </AnimatePresence>

                            {/* Status */}
                            <div className="absolute top-5 left-5">
                                <span
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[11px] tracking-widest font-bold text-white ${config.bg}`}
                                >
                                    {config.dot && (
                                        <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                    )}

                                    {config.label.toUpperCase()}
                                </span>
                            </div>

                            {/* Watchlist */}
                            <button
                                onClick={() => setWatched(!watched)}
                                className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 border border-slate-200 flex items-center justify-center shadow"
                            >
                                <span
                                    className={`text-lg ${
                                        watched ? "text-red-500" : "text-slate-400"
                                    }`}
                                >
                                    {watched ? "♥" : "♡"}
                                </span>
                            </button>

                            {/* Bid Count */}
                            <div className="absolute bottom-5 right-5 bg-white/90 px-4 py-2 rounded-full border border-slate-200 shadow">
                                <span className="text-xs font-bold text-slate-700">
                                    {auction.bidCount || 0} bids
                                </span>
                            </div>
                        </motion.div>

                        {/* Thumbnails */}
                        <motion.div variants={itemVariant} className="grid grid-cols-4 gap-3">
                            {images.slice(0, 4).map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveThumb(index)}
                                    className={`rounded-2xl overflow-hidden h-20 border-2 ${
                                        activeThumb === index
                                            ? "border-blue-600"
                                            : "border-slate-200"
                                    }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            variants={itemVariant}
                            className="rounded-[24px] bg-white border border-slate-200 p-7 shadow-sm"
                        >
                            <h3 className="text-lg font-bold text-slate-900 mb-4">
                                About this listing
                            </h3>

                            <p className="text-sm leading-7 text-slate-500">
                                {auction.description ||
                                    "Premium verified auction listing on Auctify marketplace."}
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="space-y-5"
                    >
                        {/* Title */}
                        <motion.div variants={itemVariant}>
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
                                {auction.category || "General"}
                            </span>

                            <h1 className="mt-4 text-[2rem] font-extrabold text-slate-900 leading-tight">
                                {auction.name}
                            </h1>

                            <p className="mt-3 text-sm text-slate-500 leading-6">
                                Secure bidding, verified seller, real-time auction activity.
                            </p>
                        </motion.div>

                        {/* Countdown */}
                        {status === "active" && (
                            <motion.div variants={itemVariant}>
                                <p className="text-xs uppercase tracking-[2px] text-slate-400 font-semibold mb-3">
                                    Auction ends in
                                </p>

                                <Countdown endTime={endTime} />
                            </motion.div>
                        )}

                        {/* Bid Panel */}
                        <motion.div variants={itemVariant}>
                            <BidPanel
                                canBid={canBid}
                                currentBid={currentBid}
                                bidCount={auction.bidCount}
                                status={status}
                                auctionId={auction._id}
                            />
                        </motion.div>

                        {/* Seller */}
                        <motion.div variants={itemVariant}>
                            <SellerCard sellerName={auction.sellerName} />
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            variants={itemVariant}
                            className="grid grid-cols-2 md:grid-cols-3 gap-3"
                        >
                            {[
                                [
                                    "Start Price",
                                    `₹${(auction.startPrice || 0).toLocaleString("en-IN")}`,
                                ],
                                ["Auction ID", `#${auction._id}`],
                                ["Status", status],
                                ["Min Step", "₹500"],
                                ["Condition", auction.condition || "Excellent"],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="bg-white border border-slate-200 rounded-2xl p-4 text-center"
                                >
                                    <p className="text-[10px] uppercase tracking-[2px] text-slate-400 font-semibold">
                                        {label}
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-slate-900 truncate">
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Bid History */}
                        <motion.div variants={itemVariant}>
                            <BidHistory auctionId={id} />
                        </motion.div>
                    </motion.div>
                </div>

                {/* Related */}
                <div className="mt-20">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[2px] text-blue-500 mb-1">
                                More Listings
                            </p>

                            <h3 className="text-2xl font-extrabold text-slate-900">
                                Similar Auctions
                            </h3>
                        </div>

                        <button
                            onClick={() => navigate("/explore")}
                            className="px-5 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 text-sm font-bold hover:bg-blue-50 transition"
                        >
                            View All
                        </button>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {/* Add related cards later */}
                    </div>
                </div>
            </div>
        </section>
    );
}
