import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { stagger, itemVariant } from "../constants/auctionVariants";
import { SellerCard } from "../components/SellerCard";
import { BidPanel } from "../components/BidPanel";
import { BidHistory } from "../components/BidHistory";
import { auctionAPI, bidAPI } from "../auctionAPI";
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, Check, Info, Copy } from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import AuctionCard from "../../../components/common/AuctionCard";
import { apiHandler } from "../../../shared/utils/apiHandler";
import socket from "../../../shared/services/socket";

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

    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const url = `${window.location.origin}/auction/${auction._id}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    // Use stable primitive (string) as dep — avoids refetch on every User object re-creation
    const userId = User?._id;

    // Fetch main auction
    useEffect(() => {
        if (!id) return;
        const fetchAuction = async () => {
            try {
                setLoading(true);
                const data = await apiHandler(() => auctionAPI.getById(id));
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
        if (auction?.status === "draft") return setBids([]);
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
    }, [id, auction]);

    useEffect(() => {
        if (!auction) return;

        socket.connect();
        socket.emit("join_auction", auction._id);

        const handler = (data) => {
            if (!data?.type || !data?.payload) return;

            if (data.type === "BID_CREATED") {
                const incoming = data.payload;

                const normalizedBid = {
                    ...incoming.highestBidId,
                    _id: incoming.highestBidId._id ?? `temp-${Date.now()}`,
                    amount: incoming.highestBidId.amount ?? 0,
                    createdAt: incoming.createdAt ?? new Date().toISOString(),
                    userId:
                        incoming.highestBidId.userId &&
                        typeof incoming.highestBidId.userId === "object"
                            ? incoming.highestBidId.userId
                            : {
                                  _id: String(incoming.highestBidId.userId ?? ""),
                                  username: null,
                                  profile: null,
                              },
                };

                setAuction(incoming);

                setBids((prev) => {
                    const exists = prev.some((b) => b._id === normalizedBid._id);
                    if (exists) return prev;
                    return [normalizedBid, ...prev].sort((a, b) => b.amount - a.amount);
                });
            }

            if (data.type === "AUCTION_ENDED") {
                setAuction(data.payload);
            }

            if (data.type === "AUCTION_STARTED") {
                setAuction(data.payload);
            }
        };

        socket.on("event", handler);

        return () => {
            socket.emit("leave_auction", auction._id);
            socket.off("event", handler);
            socket.disconnect();
        };
    }, [auction?._id]);

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
                    <h2 className="text-4xl font-bold text-[#1F2937]">Loading Auction...</h2>
                    <p className="mt-4 text-[#4B5563]">Please wait while we fetch the listing.</p>
                </div>
            </section>
        );
    }

    /* ── Not found ── */
    if (!auction) {
        return (
            <section className="min-h-screen flex items-center justify-center">
                <p className="text-[#4B5563] text-[15px]">Auction not found</p>
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
        active: { label: "Live Auction", bg: "bg-[#C2410C]", dot: true },
        ended: { label: "Auction Ended", bg: "bg-[#16A34A]", dot: false },
        expired: { label: "Expired", bg: "bg-[#DC2626]", dot: false },
        draft: { label: "Not Started", bg: "bg-[#F59E0B]", dot: false },
    };
    const config = statusConfig[status] || statusConfig.draft;

    const bottomBarMsg =
        status === "active"
            ? "You are participating in a live auction. Please read the terms and conditions before placing a bid."
            : status === "ended"
              ? "This auction has ended. Thank you for participating!"
              : "You will be able to place bids once the auction starts.";
    console.log("Auction from Auction Details page: ", auction);
    return (
        // pb-14 so the fixed bottom bar never overlaps content
        <section className="bg-[#F8F8FF] min-h-screen pb-14">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
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
                            className="relative rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-sm"
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
                                    className="w-full h-[420px] object-cover"
                                />
                            </AnimatePresence>

                            {/* Status badge */}
                            <div className="absolute top-4 left-4">
                                <span
                                    className={`inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full  tracking-wider font-bold text-white ${config.bg}`}
                                >
                                    {config.dot && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    )}
                                    {status === "ended" && <Check size={14} />}
                                    {config.label.toUpperCase()}
                                </span>
                            </div>

                            {/* Watchlist heart */}
                            {/* <button
                                onClick={() => setWatched((w) => !w)}
                                className="absolute top-4 right-4 w-9 h-9 rounded-full transition-transform bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm hover:scale-105 transition"
                            >
                                <span
                                    className={`text-[15px] ${watched ? "text-red-500" : "text-[#4B5563]"}`}
                                >
                                    <Heart
                                        size={18}
                                        className={
                                            watched ? "text-red-500 fill-red-500" : "text-[#4B5563]"
                                        }
                                    />
                                </span>
                            </button> */}
                        </motion.div>

                        {/* Thumbnails */}
                        <motion.div variants={itemVariant} className="flex gap-2">
                            <button
                                onClick={() => setActiveThumb((t) => Math.max(0, t - 1))}
                                className="w-9 h-20 flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5563] hover:text-slate-700 transition flex-shrink-0"
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <div className="flex gap-2 flex-1 overflow-hidden">
                                {images.slice(0, 5).map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveThumb(index)}
                                        className={`rounded-xl overflow-hidden h-20 flex-1 border-2 transition ${
                                            activeThumb === index
                                                ? "border-[#2563EB]"
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
                                className="w-9 h-20 flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#4B5563] hover:text-slate-700 transition flex-shrink-0"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </motion.div>

                        {/* About */}
                        <motion.div
                            variants={itemVariant}
                            className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm"
                        >
                            <h3 className="text-lg font-bold text-[#1F2937] mb-3">
                                About this listing
                            </h3>
                            <p className="text-[15px] leading-7 text-[#4B5563]">
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
                        <motion.div variants={itemVariant} className="px-4">
                            <span className="inline-block px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]  text-[15px] font-semibold border ">
                                {auction.category || "General"}
                            </span>
                            <h1 className="mt-3 text-4xl font-extrabold text-[#1F2937] leading-snug">
                                {auction?.name}
                            </h1>
                            {/* <p className="mt-1 text-sm text-[#9CA3AF] font-medium">Live Auction</p> */}
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
                            <BidHistory bids={bids} loading={bidsLoading} status={status} />
                        </motion.div>

                        {/* Auction Information */}
                        <motion.div
                            variants={itemVariant}
                            className="rounded-2xl bg-white border border-[#E5E7EB] p-6 shadow-sm"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-base font-semibold text-[#111827]">
                                    Auction Information
                                </h3>

                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 text-xs font-semibold text-[#2563EB] hover:underline"
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? "Copied" : "Copy Link"}
                                </button>
                            </div>

                            {/* Content */}
                            <div className="space-y-3">
                                {[
                                    ["Auction ID", `#${auction._id}`],

                                    [
                                        "Auction Type",
                                        auction.auctionType !== "long"
                                            ? "Instant Auction"
                                            : "Long Auction",
                                    ],

                                    [
                                        "Start Time",
                                        startTime
                                            ? new Date(startTime).toLocaleString("en-IN", {
                                                  day: "numeric",
                                                  month: "short",
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
                                                            month: "short",
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
                                              : status === "expired"
                                                ? "Expired"
                                                : "Not Started",
                                    ],
                                ].map(([label, value]) => {
                                    const isStatus = label === "Status";
                                    const isType = label === "Auction Type";

                                    return (
                                        <div
                                            key={label}
                                            className="flex items-center justify-between"
                                        >
                                            <span className="text-sm text-[#6B7280]">{label}</span>

                                            <span
                                                className={`text-sm font-semibold ${
                                                    isStatus
                                                        ? status === "active"
                                                            ? "text-[#C2410C] bg-[#FFF7ED] px-2.5 py-0.5 rounded-full"
                                                            : status === "ended"
                                                              ? "text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full"
                                                              : "text-[#F59E0B] bg-[#FFFBEB] px-2.5 py-0.5 rounded-full"
                                                        : isType
                                                          ? auction.auctionType === "instant"
                                                              ? "text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full"
                                                              : "text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full"
                                                          : "text-[#111827]"
                                                }`}
                                            >
                                                {value}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Related Auctions */}
                {relatedAuctions.length > 0 && (
                    <div className="mt-16">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[2px] text-blue-500 mb-1">
                                    More Listings
                                </p>
                                <h3 className="text-xl font-extrabold text-[#1F2937]">
                                    Similar Auctions
                                </h3>
                            </div>
                            <button
                                onClick={() => navigate(`/category/${auction.category}`)}
                                className="px-5 py-2.5 text-[15px] rounded-xl border-2  font-bold border-[#2563EB] text-[#2563EB] hover:bg-[#EFF6FF] transition"
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
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-6 py-4 flex items-center justify-between z-10">
                <div className="flex items-center gap-2 text-[15px] text-[#4B5563]">
                    <span className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-[15px] font-bold flex-shrink-0">
                        <Info size={14} />
                    </span>
                    {bottomBarMsg}
                </div>
                {status === "active" && (
                    <button className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1 flex-shrink-0">
                        View Terms & Conditions
                    </button>
                )}
            </div>
        </section>
    );
}
