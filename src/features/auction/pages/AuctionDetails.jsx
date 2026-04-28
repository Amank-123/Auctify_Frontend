import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { stagger, itemVariant } from "../constants/auctionVariants";
import { SellerCard } from "../components/SellerCard";
import { BidPanel } from "../components/BidPanel";
import { BidHistory } from "../components/BidHistory";
import { auctionAPI, bidAPI } from "../auctionAPI";

import { useAuth } from "../../../hooks/useAuth";
import AuctionCard from "../../../components/common/AuctionCard";

export default function AuctionDetails() {
    const { User } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [activeThumb, setActiveThumb] = useState(0);
    const [watched, setWatched] = useState(false);
    const [auction, setAuction] = useState(null);
    const [relatedAuctions, setRelatedAuctions] = useState([]);
    const [bids, setBids] = useState([]);
    const [canBid, setCanBid] = useState(true);
    const [loading, setLoading] = useState(true);
    const [bidsLoading, setBidsLoading] = useState(true);

    // Use stable primitive (string) as dep — avoids refetch on every User object re-creation
    const userId = User?._id;

    // Fetch main auction
    useEffect(() => {
        if (!id) return;
        const fetchAuction = async () => {
            try {
                setLoading(true);
                const data = await auctionAPI.getById(id);
                setAuction(data);
                setCanBid(!(userId && data?.sellerId?._id === userId));
            } catch (error) {
                setAuction(null);
            } finally {
                setLoading(false);
            }
        };
        fetchAuction();
    }, [id, userId]);

    // Fetch bids — centralized here, passed down to BidHistory and BidPanel
    useEffect(() => {
        if (!id) return;
        const fetchBids = async () => {
            try {
                setBidsLoading(true);
                const data = await bidAPI.getByAuction(id);
                const sorted = [...data].sort((a, b) => b.amount - a.amount);
                setBids(sorted);
            } catch (err) {
                setBids([]);
            } finally {
                setBidsLoading(false);
            }
        };
        fetchBids();
    }, [id]);

    // Fetch related auctions — depend on category string only, NOT the whole auction object
    // (depending on the object causes infinite loops since every setState creates a new reference)
    const auctionCategory = auction?.category;
    useEffect(() => {
        if (!auctionCategory) return;
        const fetchRelated = async () => {
            try {
                const data = await auctionAPI.getAll({
                    category: auctionCategory,
                    page: 1,
                    limit: 4,
                    sortBy: "createdAt",
                });
                setRelatedAuctions(data);
            } catch (error) {
                setRelatedAuctions([]);
            }
        };
        fetchRelated();
    }, [auctionCategory]);

    /* ── Loading ── */
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

    /* ── Not found ── */
    if (!auction) {
        return (
            <section className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500 text-lg">Auction not found</p>
            </section>
        );
    }

    /* ── Derived data ── */
    const images = auction?.media?.[0]?.length > 0 ? auction.media[0] : ["/placeholder.jpg"];
    const currentImage = images[activeThumb] || images[0];
    const currentBid =
        auction?.currentHighestBid > 0 ? auction.currentHighestBid : auction?.startPrice || 0;
    const status = auction?.status || "draft";
    const endTime = auction?.endTime || auction?.countdownEnd;
    const startTime = auction?.startTime;

    const statusConfig = {
        active: { label: "Live Auction", bg: "bg-blue-600", dot: true },
        ended: { label: "Auction Ended", bg: "bg-green-600", dot: false },
        expired: { label: "Expired", bg: "bg-red-500", dot: false },
        draft: { label: "Not Started", bg: "bg-orange-500", dot: false },
    };
    const config = statusConfig[status] || statusConfig.draft;

    const bottomBarMsg =
        status === "active"
            ? "You are participating in a live auction. Please read the terms and conditions before placing a bid."
            : status === "ended"
              ? "This auction has ended. Thank you for participating!"
              : "You will be able to place bids once the auction starts.";

    return (
        // pb-14 so the fixed bottom bar never overlaps content
        <section className="bg-[#F8F8FF] min-h-screen pb-14">
            {/* Top nav */}
            <div className="bg-white border-b border-slate-200 px-6 py-4">
                <button
                    onClick={() => navigate("/explore")}
                    className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition"
                >
                    <span>←</span> Back to auctions
                </button>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8">
                <div className="grid lg:grid-cols-[1fr_1fr_360px] gap-6 items-start">
                    {/* ── LEFT: Image gallery + About ── */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        {/* Hero image */}
                        <motion.div
                            variants={itemVariant}
                            className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm"
                        >
                            <AnimatePresence mode="wait">
                                <motion.img
                                    key={currentImage}
                                    src={currentImage}
                                    alt={auction?.name}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-full h-[380px] object-cover"
                                />
                            </AnimatePresence>

                            {/* Status badge */}
                            <div className="absolute top-4 left-4">
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] tracking-wider font-bold text-white ${config.bg}`}
                                >
                                    {config.dot && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    )}
                                    {status === "ended" && <span>✓</span>}
                                    {config.label.toUpperCase()}
                                </span>
                            </div>

                            {/* Watchlist heart */}
                            <button
                                onClick={() => setWatched((w) => !w)}
                                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:scale-105 transition"
                            >
                                <span
                                    className={`text-base ${watched ? "text-red-500" : "text-slate-400"}`}
                                >
                                    {watched ? "♥" : "♡"}
                                </span>
                            </button>
                        </motion.div>

                        {/* Thumbnails */}
                        <motion.div variants={itemVariant} className="flex gap-2">
                            <button
                                onClick={() => setActiveThumb((t) => Math.max(0, t - 1))}
                                className="w-8 h-16 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 transition flex-shrink-0"
                            >
                                ‹
                            </button>

                            <div className="flex gap-2 flex-1 overflow-hidden">
                                {images.slice(0, 5).map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveThumb(index)}
                                        className={`rounded-xl overflow-hidden h-16 flex-1 border-2 transition ${
                                            activeThumb === index
                                                ? "border-blue-600"
                                                : "border-transparent"
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() =>
                                    setActiveThumb((t) => Math.min(images.length - 1, t + 1))
                                }
                                className="w-8 h-16 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-slate-700 transition flex-shrink-0"
                            >
                                ›
                            </button>
                        </motion.div>

                        {/* About */}
                        <motion.div
                            variants={itemVariant}
                            className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm"
                        >
                            <h3 className="text-base font-bold text-slate-900 mb-3">
                                About this listing
                            </h3>
                            <p className="text-sm leading-7 text-slate-500">
                                {auction.description ||
                                    "Premium verified auction listing on Auctify marketplace."}
                            </p>
                        </motion.div>
                    </motion.div>

                    {/* ── MIDDLE: Title + BidPanel + Seller ── */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        {/* Category + Title */}
                        <motion.div variants={itemVariant}>
                            <span className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
                                {auction.category || "General"}
                            </span>
                            <h1 className="mt-3 text-2xl font-extrabold text-slate-900 leading-snug">
                                {auction?.name}
                            </h1>
                            <p className="mt-1 text-xs text-slate-400 font-medium">Live Auction</p>
                        </motion.div>

                        {/* BidPanel — handles not-started / active / ended states internally */}
                        <motion.div variants={itemVariant}>
                            <BidPanel
                                canBid={canBid}
                                currentBid={currentBid}
                                bidCount={auction.bidCount}
                                status={status}
                                auctionId={auction._id}
                                endTime={endTime}
                                startTime={startTime}
                                highestBidder={bids[0]}
                                navigate={navigate}
                            />
                        </motion.div>

                        {/* Seller */}
                        <motion.div variants={itemVariant}>
                            <SellerCard seller={auction.sellerId} />
                        </motion.div>
                    </motion.div>

                    {/* ── RIGHT: Live Bids + Auction Info ── */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        {/* BidHistory — bids & setBids come from parent, socket lives inside */}
                        <motion.div variants={itemVariant}>
                            <BidHistory
                                auctionId={id}
                                bids={bids}
                                setBids={setBids}
                                loading={bidsLoading}
                                status={status}
                            />
                        </motion.div>

                        {/* Auction Information */}
                        <motion.div
                            variants={itemVariant}
                            className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"
                        >
                            <h3 className="text-sm font-bold text-slate-900 mb-4">
                                Auction Information
                            </h3>
                            <div className="space-y-3">
                                {[
                                    ["Auction ID", `#${auction._id?.slice(-16)}...`],
                                    ["Auction Type", "Live Auction"],
                                    [
                                        "Start Time",
                                        startTime
                                            ? new Date(startTime).toLocaleString("en-IN", {
                                                  day: "numeric",
                                                  month: "long",
                                                  year: "numeric",
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : "—",
                                    ],
                                    ...(status === "ended" || status === "expired"
                                        ? [
                                              [
                                                  "Ended On",
                                                  endTime
                                                      ? new Date(endTime).toLocaleString("en-IN", {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        })
                                                      : "—",
                                              ],
                                          ]
                                        : [
                                              [
                                                  "Starting Price",
                                                  `Rs.${(auction.startPrice || 0).toLocaleString("en-IN")}`,
                                              ],
                                          ]),
                                    [
                                        "Status",
                                        status === "active"
                                            ? "Active"
                                            : status === "ended"
                                              ? "Completed"
                                              : "Not Started",
                                    ],
                                ].map(([label, value]) => (
                                    <div key={label} className="flex items-center justify-between">
                                        <span className="text-xs text-slate-400">{label}</span>
                                        <span
                                            className={`text-xs font-semibold ${
                                                label === "Status"
                                                    ? status === "active"
                                                        ? "text-green-600 bg-green-50 px-2 py-0.5 rounded-full"
                                                        : status === "ended"
                                                          ? "text-green-700 bg-green-50 px-2 py-0.5 rounded-full"
                                                          : "text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full"
                                                    : label === "Auction Type"
                                                      ? "text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full"
                                                      : "text-slate-700"
                                            }`}
                                        >
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Related Auctions */}
                {relatedAuctions.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[2px] text-blue-500 mb-1">
                                    More Listings
                                </p>
                                <h3 className="text-xl font-extrabold text-slate-900">
                                    Similar Auctions
                                </h3>
                            </div>
                            <button
                                onClick={() => navigate("/explore")}
                                className="px-4 py-2 rounded-xl border-2 border-blue-600 text-blue-600 text-sm font-bold hover:bg-blue-50 transition"
                            >
                                View All
                            </button>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {relatedAuctions.map((a) => (
                                <AuctionCard key={a._id} auction={a} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed bottom info bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex items-center justify-between z-10">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                        i
                    </span>
                    {bottomBarMsg}
                </div>
                {status === "active" && (
                    <button className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1 flex-shrink-0">
                        View Terms & Conditions →
                    </button>
                )}
            </div>
        </section>
    );
}
