import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

import { stagger, itemVariant } from "../constants/auctionVariants";
import { SellerCard } from "../components/SellerCard";
import { BidPanel } from "../components/BidPanel";
import { BidHistory } from "../components/BidHistory";
import { auctionAPI, bidAPI } from "../auctionAPI";

import {
    ChevronLeft,
    ChevronRight,
    Check,
    Copy,
    ShoppingBag,
    MessageCircle,
    CheckCircle2,
    Trophy,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import AuctionCard from "../../../components/common/AuctionCard";
import { apiHandler } from "../../../shared/utils/apiHandler";
import socket from "../../../shared/services/socket";
import { api } from "../../../shared/services/axios";

export default function AuctionDetails() {
    const { User } = useAuth();

    const { id } = useParams();

    const navigate = useNavigate();

    const [activeThumb, setActiveThumb] = useState(0);

    const [auction, setAuction] = useState(null);

    const [relatedAuctions, setRelatedAuctions] = useState([]);

    const [bids, setBids] = useState([]);

    const [canBid, setCanBid] = useState(true);

    const [loading, setLoading] = useState(true);

    const [bidsLoading, setBidsLoading] = useState(true);

    const [copied, setCopied] = useState(false);

    const [winnerOrder, setWinnerOrder] = useState(null);

    const userId = User?._id;

    /* ─────────────────────────────────────────────
       COPY LINK
    ───────────────────────────────────────────── */

    const handleCopy = async () => {
        const url = `${window.location.origin}/auction/${auction._id}`;

        await navigator.clipboard.writeText(url);

        setCopied(true);

        setTimeout(() => setCopied(false), 1500);
    };

    /* ─────────────────────────────────────────────
       FETCH AUCTION
    ───────────────────────────────────────────── */

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

    /* ─────────────────────────────────────────────
       FETCH BIDS
    ───────────────────────────────────────────── */

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
    }, [id, auction?.status]);

    /* ─────────────────────────────────────────────
       SOCKET
    ───────────────────────────────────────────── */

    useEffect(() => {
        if (!auction) return;

        socket.connect();

        socket.emit("join_auction", auction._id);

        const handler = (data) => {
            if (!data?.type || !data?.payload) return;

            if (data.type === "BID_CREATED") {
                const incoming = data.payload;

                setAuction(incoming.auctionId);

                setBids((prev) => {
                    return [incoming, ...prev].sort((a, b) => b.amount - a.amount);
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

    /* ─────────────────────────────────────────────
       RELATED AUCTIONS
    ───────────────────────────────────────────── */

    useEffect(() => {
        if (!auction?.category) return;

        const fetchRelated = async () => {
            try {
                const data = await auctionAPI.getAll({
                    category: auction.category,
                    page: 1,
                    limit: 5,
                    sortBy: "createdAt",
                });

                setRelatedAuctions(data);
            } catch (error) {
                setRelatedAuctions([]);
            }
        };

        fetchRelated();
    }, [auction?.category]);

    /* ─────────────────────────────────────────────
       CHECK WINNER
    ───────────────────────────────────────────── */

    const isWinner =
        User?._id && auction?.winnerId && auction?.winnerId?.toString() === User?._id?.toString();

    /* ─────────────────────────────────────────────
       FETCH ORDER IF WINNER
    ───────────────────────────────────────────── */

    useEffect(() => {
        if (!auction?._id || !isWinner) return;

        const fetchWinnerOrder = async () => {
            try {
                const { data } = await api.get("/api/order/my");

                const order = data?.data?.find((o) => o.auctionId?._id === auction?._id);

                if (order) {
                    setWinnerOrder(order);
                }
            } catch (err) {
                console.log(err);
            }
        };

        fetchWinnerOrder();
    }, [auction?._id, isWinner]);

    /* ─────────────────────────────────────────────
       LOADING
    ───────────────────────────────────────────── */

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

    /* ─────────────────────────────────────────────
       NOT FOUND
    ───────────────────────────────────────────── */

    if (!auction) {
        return (
            <section className="min-h-screen flex items-center justify-center">
                <p className="text-[#4B5563] text-[15px]">Auction not found</p>
            </section>
        );
    }

    const images = auction?.media?.[0]?.length > 0 ? auction.media[0] : ["/placeholder.jpg"];

    const currentImage = images[activeThumb] || images[0];

    const currentBid =
        auction?.currentHighestBid > 0 ? auction.currentHighestBid : auction?.startPrice || 0;

    const status = auction?.status || "draft";

    const endTime = auction?.endTime || auction?.countdownEnd;

    const startTime = auction?.startTime;

    const statusConfig = {
        active: {
            label: "Live Auction",
            bg: "bg-[#C2410C]",
            dot: true,
        },

        ended: {
            label: "Auction Ended",
            bg: "bg-[#16A34A]",
            dot: false,
        },

        expired: {
            label: "Expired",
            bg: "bg-[#DC2626]",
            dot: false,
        },

        draft: {
            label: "Not Started",
            bg: "bg-[#F59E0B]",
            dot: false,
        },
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
        <section className="bg-[#F8F8FF] min-h-screen pb-14">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-8">
                <div className="grid lg:grid-cols-[1fr_1fr_360px] gap-6 items-start">
                    {/* LEFT */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        <motion.div
                            variants={itemVariant}
                            className="
                                relative rounded-2xl overflow-hidden
                                bg-white border border-[#E5E7EB]
                                shadow-sm
                            "
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

                            <div className="absolute top-4 left-4">
                                <span
                                    className={`
                                        inline-flex items-center gap-1.5
                                        text-xs px-3.5 py-1.5 rounded-full
                                        tracking-wider font-bold text-white
                                        ${config.bg}
                                    `}
                                >
                                    {config.dot && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                    )}

                                    {status === "ended" && <Check size={14} />}

                                    {config.label.toUpperCase()}
                                </span>
                            </div>
                        </motion.div>

                        {/* THUMBNAILS */}
                        <motion.div variants={itemVariant} className="flex gap-2">
                            <button
                                onClick={() => setActiveThumb((t) => Math.max(0, t - 1))}
                                className="
                                    w-9 h-20 flex items-center justify-center
                                    rounded-lg border border-[#E5E7EB]
                                    bg-white
                                "
                            >
                                <ChevronLeft size={18} />
                            </button>

                            <div className="flex gap-2 flex-1 overflow-hidden">
                                {images.slice(0, 5).map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveThumb(index)}
                                        className={`
                                            rounded-xl overflow-hidden h-20 flex-1 border-2
                                            ${
                                                activeThumb === index
                                                    ? "border-[#2563EB]"
                                                    : "border-transparent"
                                            }
                                        `}
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
                                className="
                                    w-9 h-20 flex items-center justify-center
                                    rounded-lg border border-[#E5E7EB]
                                    bg-white
                                "
                            >
                                <ChevronRight size={18} />
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* MIDDLE */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        <motion.div variants={itemVariant} className="px-4">
                            <h1 className="text-4xl font-extrabold text-[#1F2937]">
                                {auction?.name}
                            </h1>
                        </motion.div>
                        {/* BID PANEL */}
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
                        {/* WINNER CARD */}
                        {status === "ended" && isWinner && winnerOrder && (
                            <motion.div
                                variants={itemVariant}
                                className="rounded-xl border border-emerald-200 bg-emerald-50 p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2
                                                size={16}
                                                className="text-emerald-600 shrink-0"
                                            />
                                            <p className="text-sm font-semibold text-emerald-700 tracking-tight">
                                                Auction Won
                                            </p>
                                        </div>

                                        <p className="mt-1.5 text-sm text-emerald-600/80 leading-relaxed">
                                            You placed the winning bid. Your order has been created
                                            and is ready to view.
                                        </p>

                                        <div className="mt-4 flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    navigate(`/orders/${winnerOrder._id}`)
                                                }
                                                className="
                            h-9 px-4 rounded-lg
                            bg-emerald-600 hover:bg-emerald-700
                            text-white text-sm font-medium
                            transition-colors flex items-center gap-1.5
                        "
                                            >
                                                <ShoppingBag size={14} />
                                                View Order
                                            </button>

                                            <button
                                                onClick={() => navigate(`/auction/room`)}
                                                className="
                            h-9 px-4 rounded-lg
                            border border-emerald-200 bg-white
                            text-emerald-700 text-sm font-medium
                            hover:bg-emerald-50
                            transition-colors flex items-center gap-1.5
                        "
                                            >
                                                <MessageCircle size={14} />
                                                Contact Seller
                                            </button>
                                        </div>
                                    </div>

                                    <div className="shrink-0 w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                                        <Trophy size={18} className="text-emerald-600" />
                                    </div>
                                </div>
                            </motion.div>
                        )}{" "}
                        {/* SELLER */}
                        <motion.div variants={itemVariant}>
                            <SellerCard seller={auction.sellerId} />
                        </motion.div>
                    </motion.div>

                    {/* RIGHT */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        <motion.div variants={itemVariant}>
                            <BidHistory bids={bids} loading={bidsLoading} status={status} />
                        </motion.div>

                        {/* AUCTION INFO */}
                        <motion.div
                            variants={itemVariant}
                            className="
                                rounded-2xl bg-white
                                border border-[#E5E7EB]
                                p-6 shadow-sm
                            "
                        >
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="text-base font-semibold text-[#111827]">
                                    Auction Information
                                </h3>

                                <button
                                    onClick={handleCopy}
                                    className="
                                        flex items-center gap-1.5
                                        text-xs font-semibold
                                        text-[#2563EB]
                                    "
                                >
                                    {copied ? <Check size={14} /> : <Copy size={14} />}

                                    {copied ? "Copied" : "Copy Link"}
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-sm text-[#6B7280]">Auction ID</span>

                                    <span className="text-sm font-semibold">#{auction._id}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-[#6B7280]">Status</span>

                                    <span className="text-sm font-semibold">{status}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-sm text-[#6B7280]">Current Bid</span>

                                    <span className="text-sm font-semibold">
                                        ₹{currentBid.toLocaleString("en-IN")}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* RELATED */}
                {relatedAuctions.length > 1 && (
                    <div className="mt-16">
                        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {relatedAuctions.map((a) => {
                                if (a._id !== id) {
                                    return <AuctionCard key={a._id} auction={a} />;
                                }
                            })}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
