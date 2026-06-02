import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
    Package,
    Search,
    CheckCircle2,
    ShieldCheck,
    Plus,
    ShoppingBag,
    Truck,
    X,
    Send,
    Eye,
    ChevronRight,
    Gavel,
    BadgeCheck,
    MapPin,
    CreditCard,
    Calendar,
    User2,
    DollarSign,
    Loader2,
    Check,
    AlertCircle,
} from "lucide-react";
import { showError, showSuccess } from "@/shared/utils/toast.js";
import { api } from "@/shared/services/axios";

// ─── Config ───────────────────────────────────────────────────────────────────

const ORDER_FILTERS = [
    { key: "all", label: "All", icon: ShoppingBag },
    { key: "confirmed", label: "Confirmed", icon: BadgeCheck },
    { key: "delivered", label: "Delivered", icon: Truck },
];

const AUCTION_FILTERS = [
    { key: "all", label: "All", icon: ShoppingBag },
    { key: "draft", label: "Draft", icon: Package },
    { key: "live", label: "Live", icon: Gavel },
    { key: "ended", label: "Ended", icon: CheckCircle2 },
];

const STATUS_CONFIG = {
    confirmed: { label: "Confirmed", dot: "#3b82f6", bg: "#dbeafe", text: "#1d4ed8" },
    delivered: { label: "Delivered", dot: "#10b981", bg: "#d1fae5", text: "#065f46" },
    pending: { label: "Pending", dot: "#f59e0b", bg: "#fef3c7", text: "#92400e" },
    default: { label: "Unknown", dot: "#94a3b8", bg: "#f1f5f9", text: "#475569" },
};

const getStatus = (s) => STATUS_CONFIG[s] || STATUS_CONFIG.pending;
const fmt = (v) =>
    v != null ? new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(v) : "—";
const fmtDate = (d) =>
    d
        ? new Date(d).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "—";

function resolveMediaSrc(media) {
    if (!media) return null;
    const flat = [media].flat(Infinity).filter((v) => typeof v === "string" && v.trim());
    return flat[0] ?? null;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Sk({ className = "" }) {
    return <div className={`animate-pulse rounded-lg bg-stone-100 ${className}`} />;
}

function OrderSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-stone-100 p-4 space-y-3">
            <div className="flex gap-3">
                <Sk className="w-14 h-14 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2 pt-0.5">
                    <Sk className="h-4 w-3/4" />
                    <Sk className="h-3 w-1/3" />
                    <Sk className="h-5 w-20 rounded-full" />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, i) => (
                    <Sk key={i} className="h-10 rounded-xl" />
                ))}
            </div>
        </div>
    );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, icon: Icon, bg, iconColor, loading }) {
    return (
        <div
            className="bg-white rounded-2xl border border-stone-100 p-3.5 flex flex-col gap-2.5"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
        >
            <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: bg }}
            >
                <Icon size={15} style={{ color: iconColor }} />
            </div>
            <div>
                {loading ? (
                    <Sk className="h-6 w-8 mb-1" />
                ) : (
                    <p className="text-2xl font-black text-stone-900 leading-none">{value}</p>
                )}
                <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 mt-1">
                    {label}
                </p>
            </div>
        </div>
    );
}

// ─── Pill badge ───────────────────────────────────────────────────────────────

function StatusPill({ status }) {
    const s = getStatus(status);
    return (
        <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0"
            style={{ background: s.bg, color: s.text }}
        >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
            {s.label}
        </span>
    );
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order, onSendOTP, onVerify }) {
    const [expanded, setExpanded] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const [imgSrc, setImgSrc] = useState(() => resolveMediaSrc(order?.auctionId?.media));
    const [imgErr, setImgErr] = useState(false);

    const delivered = order.orderStatus === "delivered";
    const canSendOTP = order.paymentStatus === "completed" && !delivered;

    const buyerName =
        `${order?.buyerId?.firstName || ""} ${order?.buyerId?.lastName || ""}`.trim() ||
        "Unknown buyer";

    const handleSendOTP = async () => {
        setSending(true);
        await onSendOTP(order._id);
        setSending(false);
        setSent(true);
        setTimeout(() => setSent(false), 3000);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl border border-stone-100 overflow-hidden"
            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
        >
            {/* Delivered stripe */}
            {delivered && (
                <div
                    className="h-1 w-full"
                    style={{ background: "linear-gradient(90deg,#10b981,#34d399)" }}
                />
            )}

            <div className="p-4">
                {/* ── Top row: image + title + status ── */}
                <div className="flex items-start gap-3">
                    {/* Thumbnail */}
                    <div className="relative shrink-0">
                        {imgSrc && !imgErr ? (
                            <img
                                src={imgSrc}
                                alt={order?.auctionId?.name}
                                className="w-14 h-14 rounded-xl object-cover border border-stone-100"
                                onError={() => setImgErr(true)}
                            />
                        ) : (
                            <div className="w-14 h-14 rounded-xl bg-stone-100 flex items-center justify-center">
                                <Package size={20} className="text-stone-300" />
                            </div>
                        )}
                        {delivered && (
                            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                                <Check size={9} className="text-white" strokeWidth={3} />
                            </div>
                        )}
                    </div>

                    {/* Title block */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <h2 className="text-[14px] font-bold text-stone-900 leading-snug line-clamp-2 flex-1">
                                {order?.auctionId?.name || "Untitled Auction"}
                            </h2>
                            <StatusPill status={order.orderStatus} />
                        </div>
                        <p className="text-[11px] text-stone-400 mt-1 flex items-center gap-1">
                            <User2 size={9} className="shrink-0" />
                            {buyerName}
                        </p>
                    </div>
                </div>

                {/* ── Info chips row ── */}
                <div className="grid grid-cols-3 gap-1.5 mt-3">
                    {[
                        { icon: DollarSign, label: "Price", value: `₹${fmt(order.finalPrice)}` },
                        { icon: CreditCard, label: "Payment", value: order.paymentStatus },
                        { icon: Calendar, label: "Date", value: fmtDate(order.createdAt) },
                    ].map(({ icon: Icon, label, value }) => (
                        <div key={label} className="bg-stone-50 rounded-lg px-2 py-1.5 min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400 flex items-center gap-0.5 mb-0.5">
                                <Icon size={8} className="shrink-0" />
                                {label}
                            </p>
                            <p className="text-[11px] font-semibold text-stone-800 truncate">
                                {value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ── Action buttons ── */}
                <div className="flex items-center gap-2 mt-3">
                    {canSendOTP && (
                        <button
                            onClick={handleSendOTP}
                            disabled={sending || sent}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 disabled:opacity-60"
                            style={{
                                background: sent ? "#ecfdf5" : "#1e40af",
                                color: sent ? "#065f46" : "#fff",
                                border: sent ? "1px solid #a7f3d0" : "none",
                            }}
                        >
                            {sending ? (
                                <>
                                    <Loader2 size={10} className="animate-spin" />
                                    Sending…
                                </>
                            ) : sent ? (
                                <>
                                    <Check size={10} strokeWidth={2.5} />
                                    OTP Sent
                                </>
                            ) : (
                                <>
                                    <Send size={10} />
                                    Send OTP
                                </>
                            )}
                        </button>
                    )}

                    {!delivered && (
                        <button
                            onClick={() => onVerify(order._id)}
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200"
                            style={{
                                background: "#f0fdf4",
                                color: "#15803d",
                                border: "1px solid #bbf7d0",
                            }}
                        >
                            <ShieldCheck size={10} />
                            Verify OTP
                        </button>
                    )}

                    {delivered && (
                        <span
                            className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg"
                            style={{
                                background: "#ecfdf5",
                                color: "#065f46",
                                border: "1px solid #a7f3d0",
                            }}
                        >
                            <CheckCircle2 size={10} />
                            Delivered
                        </span>
                    )}

                    {/* Details toggle */}
                    <button
                        onClick={() => setExpanded((p) => !p)}
                        className="ml-auto flex items-center gap-0.5 text-[11px] text-stone-400 hover:text-stone-700 font-medium transition-colors"
                    >
                        <Eye size={11} />
                        <motion.span
                            animate={{ rotate: expanded ? 90 : 0 }}
                            transition={{ duration: 0.18 }}
                            className="flex"
                        >
                            <ChevronRight size={11} />
                        </motion.span>
                    </button>
                </div>
            </div>

            {/* ── Expanded details ── */}
            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="mx-4 mb-4 pt-3 border-t border-stone-100 grid grid-cols-1 gap-2.5">
                            {[
                                {
                                    icon: Gavel,
                                    label: "Order ID",
                                    value: order._id?.slice(-8)?.toUpperCase(),
                                },
                                {
                                    icon: Calendar,
                                    label: "Auction Ends",
                                    value: fmtDate(order?.auctionId?.endTime),
                                },
                                {
                                    icon: MapPin,
                                    label: "Address",
                                    value: [
                                        order?.shippingAddress?.street,
                                        order?.shippingAddress?.city,
                                        order?.shippingAddress?.state,
                                    ]
                                        .filter(Boolean)
                                        .join(", "),
                                },
                            ].map(({ icon: Icon, label, value }) => (
                                <div key={label} className="flex items-start gap-2">
                                    <div className="w-6 h-6 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <Icon size={11} className="text-stone-400" />
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">
                                            {label}
                                        </p>
                                        <p className="text-[12px] font-semibold text-stone-700">
                                            {value || "—"}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── OTP Modal ────────────────────────────────────────────────────────────────

function OTPModal({ otp, setOtp, onVerify, onClose }) {
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState("");

    const handleVerify = async () => {
        if (otp.length < 4) {
            setError("Please enter the OTP.");
            return;
        }
        setError("");
        setVerifying(true);
        await onVerify();
        setVerifying(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center px-3 pb-4"
            style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="w-full max-w-sm bg-white rounded-3xl p-5 relative"
                style={{ boxShadow: "0 24px 64px -12px rgba(0,0,0,0.22)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Drag handle */}
                <div className="w-10 h-1 bg-stone-200 rounded-full mx-auto mb-4" />

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
                >
                    <X size={13} className="text-stone-500" />
                </button>

                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <ShieldCheck size={18} className="text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-[15px] font-bold text-stone-900">
                            Verify Delivery OTP
                        </h2>
                        <p className="text-[11px] text-stone-400">
                            Enter the OTP shared by the buyer
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="· · · · · ·"
                        value={otp}
                        onChange={(e) => {
                            setOtp(e.target.value);
                            setError("");
                        }}
                        maxLength={6}
                        autoFocus
                        className="w-full rounded-xl border px-4 py-3.5 text-2xl font-bold text-stone-900 tracking-[0.4em] text-center focus:outline-none transition-colors"
                        style={{
                            borderColor: error ? "#fca5a5" : "#e7e5e4",
                            background: error ? "#fff5f5" : "#fafaf9",
                        }}
                    />
                    <AnimatePresence>
                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-[12px] text-red-500 flex items-center gap-1.5"
                            >
                                <AlertCircle size={11} />
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>
                    <button
                        onClick={handleVerify}
                        disabled={verifying}
                        className="w-full py-3.5 rounded-xl font-bold text-[14px] text-white flex items-center justify-center gap-2 transition-all disabled:opacity-70"
                        style={{ background: verifying ? "#6ee7b7" : "#059669" }}
                    >
                        {verifying ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                Verifying…
                            </>
                        ) : (
                            <>
                                <Check size={15} strokeWidth={2.5} />
                                Confirm Delivery
                            </>
                        )}
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 rounded-xl text-[13px] font-medium text-stone-500 hover:bg-stone-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SellerDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [otpModal, setOtpModal] = useState(null);
    const [otp, setOtp] = useState("");
    const [activeTab, setActiveTab] = useState("auctions");
    const [auctions, setAuctions] = useState([]);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const [auctionRes, orderRes] = await Promise.all([
                api.get("/api/auction/seller"),
                api.get("/api/order/seller"),
            ]);

            setAuctions(auctionRes.data.data || []);
            setOrders(orderRes.data.data || []);
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to load orders");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const sendOTP = async (id) => {
        try {
            await api.patch(`/api/order/send-otp/${id}`);
            showSuccess("OTP sent to buyer");
            fetchOrders();
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to send OTP");
        }
    };

    const verifyOTP = async () => {
        try {
            await api.patch(`/api/order/verify-otp/${otpModal}`, { otp });
            showSuccess("Order marked as delivered");
            setOtpModal(null);
            setOtp("");
            fetchOrders();
        } catch (err) {
            showError(err?.response?.data?.message || "Invalid OTP");
            throw err;
        }
    };

    const filtered = orders
        .filter((o) => filter === "all" || o.orderStatus === filter)
        .filter(
            (o) =>
                o?.auctionId?.name?.toLowerCase().includes(search.toLowerCase()) ||
                o?.buyerId?.firstName?.toLowerCase().includes(search.toLowerCase()),
        );

    const stats =
        activeTab === "auctions"
            ? {
                  total: auctions.length,
                  confirmed: auctions.filter((a) => a.status === "live").length,
                  delivered: auctions.filter((a) => a.status === "ended").length,
              }
            : {
                  total: orders.length,
                  confirmed: orders.filter((o) => o.orderStatus === "confirmed").length,
                  delivered: orders.filter((o) => o.orderStatus === "delivered").length,
              };

    return (
        <div className="min-h-screen bg-[#F5F6FA] px-3.5 py-5 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
            <div className="max-w-2xl mx-auto lg:max-w-4xl">
                {/* ── Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-between gap-3 mb-5 sm:mb-7"
                >
                    <div>
                        <h1 className="text-[22px] sm:text-3xl font-black text-slate-900 tracking-tight">
                            Seller Dashboard
                        </h1>
                        <p className="text-[12px] sm:text-[13px] text-slate-500 mt-0.5">
                            {activeTab === "orders"
                                ? "Manage deliveries and OTP verification"
                                : "Manage all your auctions"}
                        </p>
                    </div>
                    <Link to="/auction/create">
                        <motion.span
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-1.5 text-[12px] sm:text-[13px] font-semibold px-3.5 sm:px-4 py-2.5 rounded-xl cursor-pointer whitespace-nowrap"
                            style={{
                                background: "#111827",
                                color: "#f8fafc",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                        >
                            <Plus size={13} />
                            <span className="hidden sm:inline">Create Auction</span>
                            <span className="sm:hidden">New</span>
                        </motion.span>
                    </Link>
                </motion.div>

                {/* ── Stats — full labels, no truncation ── */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5">
                    <StatCard
                        label="Total"
                        value={stats.total}
                        icon={ShoppingBag}
                        bg="#dbeafe"
                        iconColor="#2563eb"
                        loading={loading}
                    />
                    <StatCard
                        label="Confirmed"
                        value={stats.confirmed}
                        icon={BadgeCheck}
                        bg="#fee2e2"
                        iconColor="#dc2626"
                        loading={loading}
                    />
                    <StatCard
                        label="Delivered"
                        value={stats.delivered}
                        icon={Truck}
                        bg="#d1fae5"
                        iconColor="#059669"
                        loading={loading}
                    />
                </div>

                {/* ── Search bar ── */}

                <div className="relative mb-3">
                    <div className="flex gap-2 mb-4">
                        <button
                            onClick={() => setActiveTab("auctions")}
                            className={`px-4 py-2 rounded-xl ${
                                activeTab === "auctions"
                                    ? "bg-black text-white"
                                    : "bg-white text-slate-600"
                            }`}
                        >
                            My Auctions
                        </button>

                        <button
                            onClick={() => setActiveTab("orders")}
                            className={`px-4 py-2 rounded-xl ${
                                activeTab === "orders"
                                    ? "bg-black text-white"
                                    : "bg-white text-slate-600"
                            }`}
                        >
                            Orders
                        </button>
                    </div>
                    <Search
                        size={15}
                        className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                        type="text"
                        placeholder={
                            activeTab === "orders"
                                ? "Search auction or buyer..."
                                : "Search your auctions..."
                        }
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-400 transition-all"
                        style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}
                    />
                </div>

                {/* ── Filter tabs ── */}
                <div
                    className="flex gap-1 mb-5 p-1 bg-white rounded-xl border border-slate-100 w-fit"
                    style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
                >
                    {(activeTab === "orders" ? FILTERS : AUCTION_FILTERS).map(
                        ({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200 whitespace-nowrap"
                                style={
                                    filter === key
                                        ? {
                                              background: "#111827",
                                              color: "#f8fafc",
                                              boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                                          }
                                        : { color: "#64748b" }
                                }
                            >
                                <Icon size={10} />
                                {label}
                            </button>
                        ),
                    )}
                </div>

                {/* ── Order list ── */}
                <div className="flex flex-col gap-2.5 sm:gap-3">
                    {loading ? (
                        <>
                            <OrderSkeleton />
                            <OrderSkeleton />
                            <OrderSkeleton />
                        </>
                    ) : filtered.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-2xl border border-slate-100 p-12 text-center"
                            style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                        >
                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                                <Package size={22} className="text-slate-400" />
                            </div>
                            <h3 className="text-[15px] font-bold text-slate-800">
                                {activeTab === "orders" ? "No orders found" : "No auctions found"}
                            </h3>
                            <p className="text-[12px] text-slate-500 mt-1">
                                {search
                                    ? "Try a different search term."
                                    : "Orders appear here when buyers win your auctions."}
                            </p>
                        </motion.div>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {activeTab === "orders"
                                ? filtered.map((order) => (
                                      <OrderCard
                                          key={order._id}
                                          order={order}
                                          onSendOTP={sendOTP}
                                          onVerify={(id) => setOtpModal(id)}
                                      />
                                  ))
                                : auctions
                                      .filter((auction) => {
                                          const q = search.toLowerCase();

                                          const matchesSearch = (auction?.name || "")
                                              .toLowerCase()
                                              .includes(q);

                                          const matchesFilter =
                                              filter === "all" ? true : auction?.status === filter;

                                          return matchesSearch && matchesFilter;
                                      })
                                      .map((auction) => {
                                          const image =
                                              auction?.media?.[0]?.[0] ||
                                              auction?.media?.[0] ||
                                              null;

                                          const currentPrice =
                                              auction?.currentHighestBid > 0
                                                  ? auction.currentHighestBid
                                                  : auction?.startPrice || 0;

                                          return (
                                              <motion.div
                                                  key={auction._id}
                                                  layout
                                                  whileHover={{ y: -2 }}
                                                  className="bg-white rounded-2xl overflow-hidden border border-stone-100"
                                                  style={{
                                                      boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                                                  }}
                                              >
                                                  <div className="flex">
                                                      <div className="w-28 h-28 shrink-0">
                                                          {image ? (
                                                              <img
                                                                  src={image}
                                                                  alt={auction.name}
                                                                  className="w-full h-full object-cover"
                                                              />
                                                          ) : (
                                                              <div className="w-full h-full bg-stone-100 flex items-center justify-center">
                                                                  <Package
                                                                      size={22}
                                                                      className="text-stone-300"
                                                                  />
                                                              </div>
                                                          )}
                                                      </div>

                                                      <div className="flex-1 p-4">
                                                          <div className="flex justify-between items-start gap-2">
                                                              <h3 className="font-bold text-stone-900 line-clamp-2">
                                                                  {auction.name}
                                                              </h3>

                                                              <span
                                                                  className={`px-2 py-1 rounded-full text-[10px] font-bold
                                ${
                                    auction.status === "live"
                                        ? "bg-green-100 text-green-700"
                                        : auction.status === "draft"
                                          ? "bg-gray-100 text-gray-600"
                                          : "bg-red-100 text-red-600"
                                }`}
                                                              >
                                                                  {auction.status}
                                                              </span>
                                                          </div>

                                                          <p className="text-xs text-stone-500 mt-1 line-clamp-2">
                                                              {auction.description}
                                                          </p>

                                                          <div className="flex justify-between items-end mt-4">
                                                              <div>
                                                                  <p className="text-xs text-stone-400">
                                                                      Current Price
                                                                  </p>

                                                                  <p className="text-lg font-black text-blue-600">
                                                                      ₹{fmt(currentPrice)}
                                                                  </p>
                                                              </div>

                                                              <div className="text-right">
                                                                  <p className="text-xs text-stone-400">
                                                                      Bids
                                                                  </p>

                                                                  <p className="font-bold">
                                                                      {auction.bidCount || 0}
                                                                  </p>
                                                              </div>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </motion.div>
                                          );
                                      })}
                        </AnimatePresence>
                    )}
                </div>
            </div>

            {/* ── OTP Modal ── */}
            <AnimatePresence>
                {otpModal && (
                    <OTPModal
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
