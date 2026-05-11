import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Package,
    Search,
    CheckCircle2,
    ShieldCheck,
    Plus,
    TrendingUp,
    ShoppingBag,
    Truck,
    X,
    Send,
    Eye,
    ChevronRight,
    Gavel,
    BadgeCheck,
    Clock,
    MapPin,
    CreditCard,
    Calendar,
    User2,
    DollarSign,
} from "lucide-react";

import { showError, showSuccess } from "@/shared/utils/toast.js";
import { api } from "@/shared/services/axios";

// ─── Constants ────────────────────────────────────────────────────────────────

const FILTERS = [
    { key: "all", label: "All Orders", icon: ShoppingBag },
    { key: "confirmed", label: "Confirmed", icon: BadgeCheck },
    { key: "delivered", label: "Delivered", icon: Truck },
];

const STATUS_STYLES = {
    confirmed: {
        bg: "bg-blue-50",
        text: "text-blue-700",
        border: "border-blue-200",
        dot: "bg-blue-500",
    },
    delivered: {
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
    },
    pending: {
        bg: "bg-amber-50",
        text: "text-amber-700",
        border: "border-amber-200",
        dot: "bg-amber-500",
    },
    default: {
        bg: "bg-slate-100",
        text: "text-slate-600",
        border: "border-slate-200",
        dot: "bg-slate-400",
    },
};

// ─── Variants ─────────────────────────────────────────────────────────────────

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};

const rowVariants = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 280, damping: 26 } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.18 } },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatusStyle(status) {
    return STATUS_STYLES[status] || STATUS_STYLES.default;
}

function fmt(val) {
    return val ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(val) : "N/A";
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, color, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 280, damping: 24 }}
            className="bg-white rounded-2xl border border-slate-200 p-5 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all duration-200"
        >
            <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}
            >
                <Icon size={20} className="text-white" />
            </div>
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                    {label}
                </p>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: delay + 0.15 }}
                    className="text-3xl font-extrabold text-slate-900 mt-0.5 leading-none"
                >
                    {value}
                </motion.p>
            </div>
        </motion.div>
    );
}

function InfoPill({ icon: Icon, label, value }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold flex items-center gap-1">
                <Icon size={9} className="text-slate-300" />
                {label}
            </span>
            <span className="text-[13px] font-bold text-slate-800 capitalize truncate">
                {value || "N/A"}
            </span>
        </div>
    );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order, onSendOTP, onVerify }) {
    const [expanded, setExpanded] = useState(false);
    const s = getStatusStyle(order.orderStatus);
    const delivered = order.orderStatus === "delivered";
    const canSendOTP = order.paymentStatus === "completed" && !delivered;

    const buyerName =
        `${order?.buyerId?.firstName || ""} ${order?.buyerId?.lastName || ""}`.trim() || "N/A";

    return (
        <motion.div
            variants={rowVariants}
            layout
            className="bg-white rounded-2xl border border-slate-200 hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50/80 transition-all duration-300 overflow-hidden"
        >
            {/* ── MAIN ROW ── */}
            <div className="flex gap-0 sm:gap-4 p-4 sm:p-5">
                {/* Image */}
                <div className="relative shrink-0 hidden sm:block">
                    <img
                        src={order?.auctionId?.media?.[0]}
                        alt={order?.auctionId?.name}
                        className="w-24 h-24 md:w-28 md:h-28 rounded-xl object-cover border border-slate-100"
                        onError={(e) => {
                            e.target.style.display = "none";
                        }}
                    />
                    {delivered && (
                        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                            <CheckCircle2 size={12} className="text-white fill-white" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Top: title + status */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="min-w-0">
                            <h2 className="text-[16px] md:text-[18px] font-extrabold text-slate-900 leading-snug truncate">
                                {order?.auctionId?.name || "Untitled Auction"}
                            </h2>
                            <p className="text-[12px] text-slate-400 mt-0.5 flex items-center gap-1">
                                <User2 size={11} />
                                {buyerName}
                            </p>
                        </div>

                        {/* Status badge */}
                        <div
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${s.bg} ${s.text} ${s.border} shrink-0`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </div>
                    </div>

                    {/* Mid: key info pills */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                        <InfoPill
                            icon={DollarSign}
                            label="Final Price"
                            value={`₹${fmt(order.finalPrice)}`}
                        />
                        <InfoPill icon={CreditCard} label="Payment" value={order.paymentStatus} />
                        <InfoPill icon={MapPin} label="City" value={order?.shippingAddress?.city} />
                        <InfoPill
                            icon={Calendar}
                            label="Order Date"
                            value={new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        />
                    </div>

                    {/* Bottom: actions */}
                    <div className="flex items-center gap-2.5 mt-4 flex-wrap">
                        {canSendOTP && (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => onSendOTP(order._id)}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-[12px] font-bold px-4 py-2 rounded-xl shadow shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30 transition-shadow"
                            >
                                <Send size={12} />
                                Send OTP
                            </motion.button>
                        )}

                        {!delivered && (
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => onVerify(order._id)}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[12px] font-bold px-4 py-2 rounded-xl shadow shadow-emerald-500/20 hover:shadow-md hover:shadow-emerald-500/30 transition-shadow"
                            >
                                <ShieldCheck size={12} />
                                Verify OTP
                            </motion.button>
                        )}

                        {delivered && (
                            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12px] font-bold px-4 py-2 rounded-xl">
                                <CheckCircle2 size={12} />
                                Delivered
                            </div>
                        )}

                        {/* Expand toggle */}
                        <button
                            onClick={() => setExpanded((p) => !p)}
                            className="ml-auto inline-flex items-center gap-1.5 text-[12px] text-slate-400 hover:text-slate-700 font-semibold transition-colors"
                        >
                            <Eye size={13} />
                            {expanded ? "Less" : "Details"}
                            <motion.span
                                animate={{ rotate: expanded ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronRight size={13} />
                            </motion.span>
                        </button>
                    </div>
                </div>
            </div>

            {/* ── EXPANDED DETAILS ── */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-slate-100 mx-5 mb-5 pt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <InfoPill
                                icon={Calendar}
                                label="Auction Ends"
                                value={
                                    order?.auctionId?.endTime
                                        ? new Date(order.auctionId.endTime).toLocaleDateString(
                                              "en-IN",
                                              { day: "numeric", month: "short", year: "numeric" },
                                          )
                                        : "N/A"
                                }
                            />
                            <InfoPill
                                icon={MapPin}
                                label="Full Address"
                                value={[
                                    order?.shippingAddress?.street,
                                    order?.shippingAddress?.city,
                                    order?.shippingAddress?.state,
                                ]
                                    .filter(Boolean)
                                    .join(", ")}
                            />
                            <InfoPill
                                icon={Gavel}
                                label="Order ID"
                                value={order._id?.slice(-8)?.toUpperCase()}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── OTP Modal ────────────────────────────────────────────────────────────────

function OTPModal({ orderId, otp, setOtp, onVerify, onClose }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                transition={{ type: "spring", stiffness: 320, damping: 28 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-7 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                    <X size={15} className="text-slate-500" />
                </button>

                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-5">
                    <ShieldCheck size={26} className="text-white" />
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
                    Verify Delivery OTP
                </h2>
                <p className="text-slate-400 text-sm mt-1.5 mb-6">
                    Enter the OTP shared by the buyer to confirm delivery.
                </p>

                {/* OTP Input */}
                <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    className="w-full rounded-2xl border-2 border-slate-200 focus:border-blue-400 focus:outline-none px-4 py-3.5 text-lg font-bold text-slate-900 tracking-[0.25em] text-center transition-colors"
                />

                {/* Actions */}
                <div className="flex gap-3 mt-5">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={onVerify}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-shadow"
                    >
                        Confirm Delivery
                    </motion.button>
                    <button
                        onClick={onClose}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-2xl font-bold text-sm transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SellerDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [otpModal, setOtpModal] = useState(null);
    const [otp, setOtp] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/api/order/seller");
            setOrders(data.data);
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to load seller orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const sendOTP = async (id) => {
        try {
            await api.patch(`/api/order/send-otp/${id}`);
            showSuccess("OTP sent successfully");
            fetchOrders();
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to send OTP");
        }
    };

    const verifyOTP = async () => {
        try {
            await api.patch(`/api/order/verify-otp/${otpModal}`, { otp });
            showSuccess("Order delivered successfully");
            setOtpModal(null);
            setOtp("");
            fetchOrders();
        } catch (err) {
            showError(err?.response?.data?.message || "Invalid OTP");
        }
    };

    const filtered = orders
        .filter((o) => filter === "all" || o.orderStatus === filter)
        .filter(
            (o) =>
                o?.auctionId?.name?.toLowerCase().includes(search.toLowerCase()) ||
                o?.buyerId?.firstName?.toLowerCase().includes(search.toLowerCase()),
        );

    const stats = {
        total: orders.length,
        confirmed: orders.filter((o) => o.orderStatus === "confirmed").length,
        delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    };

    return (
        <div className="min-h-screen bg-[#F0F4FA] px-4 sm:px-6 lg:px-10 py-8 sm:py-10">
            {/* Background orbs */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-blue-600/5 blur-3xl" />
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-orange-500/5 blur-3xl" />
            </div>

            <div className="max-w-5xl mx-auto">
                {/* ── HEADER ── */}
                <motion.div
                    initial={{ opacity: 0, y: -18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
                            <ShoppingBag size={22} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                                Seller{" "}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-500">
                                    Orders
                                </span>
                            </h1>
                            <p className="text-slate-400 text-xs mt-0.5 font-medium">
                                Manage payments, delivery & OTP verification
                            </p>
                        </div>
                    </div>

                    <Link to="/auction/create">
                        <motion.div
                            whileHover={{ scale: 1.04, y: -1 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 transition-shadow cursor-pointer"
                        >
                            <Plus size={16} />
                            Create Auction
                        </motion.div>
                    </Link>
                </motion.div>

                {/* Divider */}
                <motion.div
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                    className="h-px bg-gradient-to-r from-blue-200/60 via-slate-200 to-orange-200/60 mb-7 origin-left"
                />

                {/* ── STATS ── */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
                    <StatCard
                        label="Total Orders"
                        value={stats.total}
                        icon={ShoppingBag}
                        color="bg-gradient-to-br from-blue-500 to-blue-600"
                        delay={0.1}
                    />
                    <StatCard
                        label="Confirmed"
                        value={stats.confirmed}
                        icon={BadgeCheck}
                        color="bg-gradient-to-br from-orange-500 to-orange-600"
                        delay={0.18}
                    />
                    <StatCard
                        label="Delivered"
                        value={stats.delivered}
                        icon={Truck}
                        color="bg-gradient-to-br from-emerald-500 to-emerald-600"
                        delay={0.26}
                    />
                </div>

                {/* ── SEARCH + FILTERS ── */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.32, duration: 0.38 }}
                    className="flex flex-col sm:flex-row gap-3 mb-6"
                >
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search
                            size={15}
                            className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-300 pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder="Search by auction or buyer name…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border border-slate-200 focus:border-blue-400 focus:outline-none rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 transition-colors shadow-sm"
                        />
                    </div>

                    {/* Filter tabs */}
                    <div className="flex gap-1.5 bg-white border border-slate-200 p-1.5 rounded-xl shadow-sm shrink-0">
                        {FILTERS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[12px] font-bold transition-all duration-200 ${
                                    filter === key
                                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-600/20"
                                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                                }`}
                            >
                                <Icon size={12} />
                                {label}
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* ── LIST ── */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-36 gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-600/30">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            >
                                <TrendingUp size={24} className="text-white" />
                            </motion.div>
                        </div>
                        <p className="text-slate-400 text-sm font-medium animate-pulse">
                            Loading orders…
                        </p>
                    </div>
                ) : filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl border border-slate-200 p-20 text-center shadow-sm"
                    >
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Package size={28} className="text-slate-300" />
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-700">No Orders Found</h3>
                        <p className="text-slate-400 text-sm mt-1">
                            {search
                                ? "Try a different search term."
                                : "Orders will appear here once buyers win your auctions."}
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col gap-4"
                    >
                        <AnimatePresence mode="popLayout">
                            {filtered.map((order) => (
                                <OrderCard
                                    key={order._id}
                                    order={order}
                                    onSendOTP={sendOTP}
                                    onVerify={(id) => setOtpModal(id)}
                                />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </div>

            {/* ── OTP MODAL ── */}
            <AnimatePresence>
                {otpModal && (
                    <OTPModal
                        orderId={otpModal}
                        otp={otp}
                        setOtp={setOtp}
                        onVerify={verifyOTP}
                        onClose={() => {
                            setOtpModal(null);
                            setOtp("");
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
