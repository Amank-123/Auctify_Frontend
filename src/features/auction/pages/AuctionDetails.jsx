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
    ShoppingBag,
    MessageCircle,
    CheckCircle2,
    Trophy,
    Tag,
    Activity,
    IndianRupee,
    AlignLeft,
    Info,
    Share2,
} from "lucide-react";

import { useAuth } from "../../../hooks/useAuth";
import AuctionCard from "../../../components/common/AuctionCard";
import { apiHandler } from "../../../shared/utils/apiHandler";
import socket from "../../../shared/services/socket";
import { api } from "../../../shared/services/axios";
import { TrustingApp } from "../../../components/common/TrustingApp";
import PremiumFAQSection from "../../../components/common/AuctionFAQCard";
import { usePageTitle } from "../../../shared/utils/usePageTitle";

/* ─── tiny helpers ─────────────────────────────────────────────────── */

const statusConfig = {
    active: { label: "Live", bg: "bg-rose-600", dot: true },
    ended: { label: "Ended", bg: "bg-emerald-600", dot: false },
    expired: { label: "Expired", bg: "bg-red-500", dot: false },
    draft: { label: "Not Started", bg: "bg-amber-500", dot: false },
};

function StatusBadge({ status }) {
    const cfg = statusConfig[status] ?? statusConfig.draft;

    return (
        <span
            className={`
                inline-flex items-center gap-1.5
                text-[10px] tracking-widest font-bold uppercase
                text-white px-3 py-1.5 rounded-full
                ${cfg.bg}
            `}
        >
            {cfg.dot && <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-pulse" />}
            {status === "ended" && <Check size={11} />}
            {cfg.label}
        </span>
    );
}

function DetailRow({
    icon: Icon,
    label,
    value,
    iconBg,
    iconColor,
    valueColor,
    valueBg,
    mono = false,
}) {
    return (
        <div
            className="
                flex flex-col sm:flex-row sm:items-center sm:justify-between
                gap-2 sm:gap-3
                px-3 py-3
                rounded-2xl
                border border-transparent
                hover:border-[#E5E7EB]
                hover:bg-white
                transition-all duration-200
            "
        >
            <span className="flex items-center gap-2.5 min-w-0">
                <span
                    className={`
                        w-8 h-8 rounded-xl
                        flex items-center justify-center
                        shrink-0
                        ${iconBg}
                    `}
                >
                    <Icon size={14} className={iconColor} />
                </span>

                <span className="text-[13px] font-medium text-[#6B7280]">{label}</span>
            </span>

            <span
                className={`
                    inline-flex w-full sm:w-auto sm:max-w-[58%]
                    px-3 py-1.5
                    rounded-xl
                    border
                    text-[12px]
                    font-bold
                    break-words
                    ${valueColor}
                    ${valueBg}
                    ${mono ? "font-mono" : ""}
                `}
            >
                {value}
            </span>
        </div>
    );
}

/* ─── main component ───────────────────────────────────────────────── */

export default function AuctionDetails() {
    const { User } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();

    const [activeThumb, setActiveThumb] = useState(0);
    const [auction, setAuction] = useState(null);

    usePageTitle(`Auctify | ${auction?.name || "Auction"}`);

    const [relatedAuctions, setRelatedAuctions] = useState([]);
    const [bids, setBids] = useState([]);
    const [canBid, setCanBid] = useState(true);
    const [loading, setLoading] = useState(true);
    const [bidsLoading, setBidsLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [winnerOrder, setWinnerOrder] = useState(null);
    const [activeTab, setActiveTab] = useState("description");

    const userId = User?._id;

    /* ── copy link ──────────────────────────────────────────────────── */

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(`${window.location.origin}/auction/${auction._id}`);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            setCopied(false);
        }
    };

    /* ── fetch auction ──────────────────────────────────────────────── */

    useEffect(() => {
        if (!id) return;

        (async () => {
            try {
                setLoading(true);
                const data = await apiHandler(() => auctionAPI.getById(id));
                setAuction(data);
                setCanBid(!(userId && data?.sellerId?._id === userId));
            } catch {
                setAuction(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [id, userId]);

    /* ── fetch bids ─────────────────────────────────────────────────── */

    useEffect(() => {
        if (!id) return;

        if (auction?.status === "draft") {
            setBids([]);
            setBidsLoading(false);
            return;
        }

        (async () => {
            try {
                setBidsLoading(true);
                const data = await bidAPI.getByAuction(id);
                const sorted = [...data].sort((a, b) => b.amount - a.amount);
                setBids(sorted);
            } catch {
                setBids([]);
            } finally {
                setBidsLoading(false);
            }
        })();
    }, [id, auction?.status]);

    /* ── socket ─────────────────────────────────────────────────────── */

    useEffect(() => {
        if (!auction?._id) return;

        socket.connect();
        socket.emit("join_auction", auction._id);

        const handler = (data) => {
            if (!data?.type || !data?.payload) return;

            if (data.type === "BID_CREATED") {
                const incoming = data.payload;

                setAuction(incoming.auctionId);

                setBids((prev) => [incoming, ...prev].sort((a, b) => b.amount - a.amount));
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

    /* ── related auctions ───────────────────────────────────────────── */

    const _categoryName =
        auction?.category && typeof auction.category === "object" ? auction.category.name : null;

    useEffect(() => {
        if (!_categoryName) return;

        (async () => {
            try {
                const data = await auctionAPI.getAll({
                    category: _categoryName,
                    page: 1,
                    limit: 10,
                    sortBy: "createdAt",
                });

                const list = Array.isArray(data) ? data : (data?.auctions ?? data?.data ?? []);
                setRelatedAuctions(list);
            } catch {
                setRelatedAuctions([]);
            }
        })();
    }, [_categoryName]);

    /* ── winner order ───────────────────────────────────────────────── */

    const isWinner =
        User?._id && auction?.winnerId && auction.winnerId.toString() === User._id.toString();

    useEffect(() => {
        if (!auction?._id || !isWinner) return;

        (async () => {
            try {
                const { data } = await api.get("/api/order/my");
                const order = data?.data?.find((o) => o.auctionId?._id === auction._id);
                if (order) setWinnerOrder(order);
            } catch (err) {
                console.error(err);
            }
        })();
    }, [auction?._id, isWinner]);

    /* ── loading / not found ─────────────────────────────────────────── */

    if (loading) {
        return (
            <section className="bg-[#F8F8FF] min-h-screen flex items-center justify-center px-4">
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-[#6B7280] text-sm font-medium">Loading auction…</p>
                </div>
            </section>
        );
    }

    if (!auction) {
        return (
            <section className="min-h-screen flex items-center justify-center px-4">
                <p className="text-[#6B7280] text-[15px]">Auction not found.</p>
            </section>
        );
    }

    /* ── derived values ──────────────────────────────────────────────── */

    const images = auction?.media?.[0]?.length > 0 ? auction.media[0] : ["/placeholder.jpg"];
    const currentImg = images[activeThumb] ?? images[0];

    const currentBid =
        auction.currentHighestBid > 0 ? auction.currentHighestBid : (auction.startPrice ?? 0);

    const status = auction.status ?? "draft";
    const endTime = auction.endTime ?? auction.countdownEnd;
    const startTime = auction.startTime;

    const filteredRelated = relatedAuctions.filter((a) => String(a._id) !== String(id)).slice(0, 5);

    /* ── render ──────────────────────────────────────────────────────── */

    return (
        <section className="bg-[#F4F5F9] min-h-screen pb-16 sm:pb-20">
            <div className="max-w-[1560px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 lg:py-10">
                <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,0.95fr)_340px] gap-4 sm:gap-5 items-start">
                    {/* LEFT COLUMN */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="space-y-3 sm:space-y-4 min-w-0"
                    >
                        {/* main image */}
                        <motion.div
                            variants={itemVariant}
                            className="relative rounded-2xl overflow-hidden bg-white border border-[#E5E7EB] shadow-sm"
                        >
                            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] xl:aspect-auto xl:h-[520px]">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentImg}
                                        src={currentImg}
                                        alt={auction.name}
                                        initial={{ opacity: 0, scale: 1.02 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.98 }}
                                        transition={{ duration: 0.25 }}
                                        className="absolute inset-0 w-full h-full object-cover"
                                    />
                                </AnimatePresence>
                            </div>

                            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3 sm:p-4">
                                <StatusBadge status={status} />
                                {images.length > 1 && (
                                    <span className="bg-black/50 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                                        {activeThumb + 1} / {images.length}
                                    </span>
                                )}
                            </div>
                        </motion.div>

                        {/* thumbnails */}
                        {images.length > 1 && (
                            <motion.div
                                variants={itemVariant}
                                className="flex items-stretch gap-2 overflow-x-auto pb-1 -mx-1 px-1 xl:overflow-visible xl:px-0 xl:mx-0"
                            >
                                <button
                                    onClick={() => setActiveThumb((t) => Math.max(0, t - 1))}
                                    disabled={activeThumb === 0}
                                    className="w-10 sm:w-11 h-16 sm:h-[72px] flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white disabled:opacity-30 hover:bg-[#F3F4F6] transition-colors shrink-0"
                                >
                                    <ChevronLeft size={17} />
                                </button>

                                <div className="flex gap-2 min-w-0 flex-1">
                                    {images.slice(0, 5).map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveThumb(i)}
                                            className={`
                                                rounded-xl overflow-hidden h-16 sm:h-[72px]
                                                min-w-[72px] flex-1
                                                border-2 transition-all
                                                ${
                                                    i === activeThumb
                                                        ? "border-[#2563EB] shadow-md shadow-blue-100"
                                                        : "border-transparent hover:border-[#D1D5DB]"
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
                                    disabled={activeThumb === images.length - 1}
                                    className="w-10 sm:w-11 h-16 sm:h-[72px] flex items-center justify-center rounded-xl border border-[#E5E7EB] bg-white disabled:opacity-30 hover:bg-[#F3F4F6] transition-colors shrink-0"
                                >
                                    <ChevronRight size={17} />
                                </button>
                            </motion.div>
                        )}

                        {/* description / details tabs */}
                        <motion.div
                            variants={itemVariant}
                            className="rounded-2xl bg-white border border-[#E5E7EB] shadow-sm overflow-hidden"
                        >
                            <div className="flex bg-[#F9FAFB] border-b border-[#E5E7EB] p-1 gap-1">
                                {[
                                    {
                                        key: "description",
                                        label: "Description",
                                        icon: AlignLeft,
                                    },
                                    { key: "details", label: "Details", icon: Info },
                                ].map(({ key, label, icon: Icon }) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={`
                                            flex items-center justify-center gap-2 flex-1
                                            py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold
                                            transition-all duration-200
                                            ${
                                                activeTab === key
                                                    ? "bg-white text-[#1D4ED8] shadow-sm border border-[#E5E7EB]"
                                                    : "text-[#9CA3AF] hover:text-[#6B7280]"
                                            }
                                        `}
                                    >
                                        <Icon size={14} />
                                        <span className="truncate">{label}</span>
                                    </button>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {activeTab === "description" ? (
                                    <motion.div
                                        key="desc"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.15 }}
                                        className="p-4 sm:p-5"
                                    >
                                        {auction.description ? (
                                            <p className="text-[13.5px] text-[#374151] leading-[1.75] whitespace-pre-line">
                                                {auction.description}
                                            </p>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-6 gap-2 text-center">
                                                <AlignLeft size={20} className="text-[#D1D5DB]" />
                                                <p className="text-sm text-[#9CA3AF]">
                                                    No description provided.
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -6 }}
                                        transition={{ duration: 0.15 }}
                                        className="p-3 sm:p-4 space-y-2"
                                    >
                                        <DetailRow
                                            icon={Activity}
                                            label="Status"
                                            value={status.charAt(0).toUpperCase() + status.slice(1)}
                                            iconBg={
                                                status === "active"
                                                    ? "bg-emerald-100"
                                                    : status === "ended"
                                                      ? "bg-blue-100"
                                                      : status === "expired"
                                                        ? "bg-red-100"
                                                        : "bg-amber-100"
                                            }
                                            iconColor={
                                                status === "active"
                                                    ? "text-emerald-600"
                                                    : status === "ended"
                                                      ? "text-blue-600"
                                                      : status === "expired"
                                                        ? "text-red-600"
                                                        : "text-amber-600"
                                            }
                                            valueColor={
                                                status === "active"
                                                    ? "text-emerald-700"
                                                    : status === "ended"
                                                      ? "text-blue-700"
                                                      : status === "expired"
                                                        ? "text-red-700"
                                                        : "text-amber-700"
                                            }
                                            valueBg={
                                                status === "active"
                                                    ? "bg-emerald-50 border-emerald-100"
                                                    : status === "ended"
                                                      ? "bg-blue-50 border-blue-100"
                                                      : status === "expired"
                                                        ? "bg-red-50 border-red-100"
                                                        : "bg-amber-50 border-amber-100"
                                            }
                                        />

                                        <DetailRow
                                            icon={IndianRupee}
                                            label="Starting Price"
                                            value={`₹${(auction.startPrice ?? 0).toLocaleString(
                                                "en-IN",
                                            )}`}
                                            iconBg="bg-emerald-100"
                                            iconColor="text-emerald-600"
                                            valueColor="text-emerald-700"
                                            valueBg="bg-emerald-50 border-emerald-100"
                                        />

                                        <DetailRow
                                            icon={IndianRupee}
                                            label="Current Bid"
                                            value={`₹${currentBid.toLocaleString("en-IN")}`}
                                            iconBg="bg-blue-100"
                                            iconColor="text-blue-600"
                                            valueColor="text-blue-700"
                                            valueBg="bg-blue-50 border-blue-100"
                                        />

                                        <DetailRow
                                            icon={Tag}
                                            label="Total Bids"
                                            value={`${auction.bidCount ?? bids.length} bid${
                                                (auction.bidCount ?? bids.length) !== 1 ? "s" : ""
                                            }`}
                                            iconBg="bg-violet-100"
                                            iconColor="text-violet-600"
                                            valueColor="text-violet-700"
                                            valueBg="bg-violet-50 border-violet-100"
                                        />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </motion.div>

                    {/* MIDDLE COLUMN */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="space-y-3 sm:space-y-4 min-w-0"
                    >
                        <motion.div
                            variants={itemVariant}
                            className="rounded-2xl bg-white border border-[#E5E7EB] shadow-sm overflow-hidden"
                        >
                            <div className="px-4 sm:px-5 pt-4 sm:pt-5 pb-4 border-b border-[#F3F4F6]">
                                {_categoryName && (
                                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#1D4ED8] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-widest mb-2">
                                        <Tag size={9} />
                                        {_categoryName}
                                    </span>
                                )}
                                <h1 className="text-[22px] sm:text-[26px] lg:text-[28px] font-extrabold text-[#111827] leading-tight tracking-tight break-words">
                                    {auction.name}
                                </h1>
                            </div>

                            <div className="border-b border-[#F3F4F6] [&>*]:shadow-none [&>*]:border-0 [&>*]:rounded-none [&>*]:bg-transparent">
                                <BidPanel
                                    canBid={canBid}
                                    currentBid={currentBid}
                                    bidCount={auction.bidCount}
                                    status={status}
                                    auctionId={auction._id}
                                    sellerId={auction.sellerId?._id}
                                    endTime={endTime}
                                    startTime={startTime}
                                    highestBidder={bids[0]}
                                    navigate={navigate}
                                    flat={true}
                                />
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariant}>
                            <SellerCard seller={auction.sellerId} />
                        </motion.div>
                    </motion.div>

                    {/* RIGHT COLUMN */}
                    <motion.div
                        variants={stagger}
                        initial="hidden"
                        animate="show"
                        className="space-y-4 sm:space-y-5 min-w-0"
                    >
                        <motion.div variants={itemVariant}>
                            <BidHistory bids={bids} loading={bidsLoading} status={status} />
                        </motion.div>

                        <motion.div
                            variants={itemVariant}
                            className="rounded-2xl bg-white border border-[#E5E7EB] p-4 shadow-sm flex items-center justify-between gap-3"
                        >
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-[#111827]">
                                    Share Listing
                                </p>
                                <p className="text-xs text-[#9CA3AF] truncate mt-0.5">
                                    {`${window.location.origin}/auction/${auction._id}`}
                                </p>
                            </div>
                            <button
                                onClick={handleCopy}
                                className={`
                                    shrink-0 flex items-center gap-1.5
                                    h-8 px-3.5 rounded-lg text-xs font-semibold
                                    transition-colors
                                    ${
                                        copied
                                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                            : "bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]"
                                    }
                                `}
                            >
                                {copied ? <Check size={13} /> : <Share2 size={13} />}
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </motion.div>
                        {status === "ended" && isWinner && winnerOrder && (
                            <motion.div
                                variants={itemVariant}
                                className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-4 sm:p-5"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <CheckCircle2
                                                size={15}
                                                className="text-emerald-600 shrink-0"
                                            />
                                            <p className="text-sm font-bold text-emerald-700 tracking-tight">
                                                You Won This Auction!
                                            </p>
                                        </div>
                                        <p className="text-xs text-emerald-600/80 leading-relaxed">
                                            Your winning bid has been placed. View your order or
                                            reach out to the seller.
                                        </p>
                                    </div>
                                    <div className="shrink-0 w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                                        <Trophy size={18} className="text-emerald-600" />
                                    </div>
                                </div>
                                <div className="mt-3.5 flex flex-row items-center gap-2 ">
                                    <button
                                        onClick={() => navigate(`/orders/${winnerOrder._id}`)}
                                        className="h-8 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                                    >
                                        <ShoppingBag size={13} />
                                        View Order
                                    </button>
                                    <button
                                        onClick={() => navigate("/chats")}
                                        className="h-8 px-4 rounded-lg border border-emerald-200 bg-white text-emerald-700 text-xs font-semibold hover:bg-emerald-50 transition-colors flex items-center gap-1.5"
                                    >
                                        <MessageCircle size={13} />
                                        Contact Seller
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* related auctions */}
                {filteredRelated.length > 0 && (
                    <div className="mt-12 sm:mt-16">
                        <h2 className="text-lg sm:text-xl font-bold text-[#111827] mb-4 sm:mb-5">
                            Similar Auctions
                        </h2>
                        <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                            {filteredRelated.map((a) => (
                                <AuctionCard key={a._id} auction={a} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <TrustingApp />
            <PremiumFAQSection />
        </section>
    );
}
