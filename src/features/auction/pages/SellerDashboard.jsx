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
    ArrowUpRight,
    Check,
    AlertCircle,
} from "lucide-react";
import { showError, showSuccess } from "@/shared/utils/toast.js";
import { api } from "@/shared/services/axios";

const FILTERS = [
    { key: "all", label: "All", icon: ShoppingBag },
    { key: "confirmed", label: "Confirmed", icon: BadgeCheck },
    { key: "delivered", label: "Delivered", icon: Truck },
];

const STATUS_CONFIG = {
    confirmed: { label: "Confirmed", dot: "#3b82f6", bg: "#eff6ff", text: "#1d4ed8" },
    delivered: { label: "Delivered", dot: "#10b981", bg: "#ecfdf5", text: "#065f46" },
    pending: { label: "Pending", dot: "#f59e0b", bg: "#fffbeb", text: "#92400e" },
    default: { label: "Unknown", dot: "#94a3b8", bg: "#f8fafc", text: "#475569" },
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

// Resolves the first usable image URL from any media shape:
// string | string[] | string[][] | any nesting
function resolveMediaSrc(media) {
    if (!media) return null;
    const flat = [media].flat(Infinity).filter((v) => typeof v === "string" && v.trim());
    return flat[0] ?? null;
}

function Skeleton({ className = "" }) {
    return (
        <div
            className={`animate-pulse rounded-lg bg-stone-100 ${className}`}
            style={{ animationDuration: "1.4s" }}
        />
    );
}

function OrderSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-stone-100 p-4 sm:p-5 flex gap-3 sm:gap-4">
            <Skeleton className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl shrink-0" />
            <div className="flex-1 space-y-3">
                <div className="flex justify-between">
                    <Skeleton className="h-4 sm:h-5 w-32 sm:w-48" />
                    <Skeleton className="h-5 sm:h-6 w-16 sm:w-20 rounded-full" />
                </div>
                <Skeleton className="h-3 w-24" />
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-1">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="space-y-1">
                            <Skeleton className="h-2.5 w-10 sm:w-12" />
                            <Skeleton className="h-3.5 sm:h-4 w-14 sm:w-16" />
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 pt-1">
                    <Skeleton className="h-7 sm:h-8 w-20 sm:w-24 rounded-xl" />
                    <Skeleton className="h-7 sm:h-8 w-20 sm:w-24 rounded-xl" />
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, icon: Icon, accent, delay, loading }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl border border-stone-100 p-3 sm:p-5 flex items-center gap-2.5 sm:gap-4"
            style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.04)" }}
        >
            <div
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: accent + "18" }}
            >
                <Icon size={15} style={{ color: accent }} />
            </div>
            <div className="min-w-0">
                <p className="text-[9px] sm:text-[11px] font-semibold uppercase tracking-widest text-stone-400 truncate">
                    {label}
                </p>
                {loading ? (
                    <Skeleton className="h-6 sm:h-7 w-8 mt-1" />
                ) : (
                    <p className="text-[22px] sm:text-[28px] font-black text-stone-900 leading-none mt-0.5">
                        {value}
                    </p>
                )}
            </div>
        </motion.div>
    );
}

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-stone-400 font-bold flex items-center gap-1">
                <Icon size={9} className="text-stone-300" />
                {label}
            </span>
            <span className="text-[11px] sm:text-[13px] font-semibold text-stone-700 truncate">
                {value || "—"}
            </span>
        </div>
    );
}

function AuctionThumbnail({ media, name, delivered }) {
    const [imgSrc, setImgSrc] = useState(() => resolveMediaSrc(media));
    const [errored, setErrored] = useState(false);

    // re-resolve if media prop changes
    useEffect(() => {
        setImgSrc(resolveMediaSrc(media));
        setErrored(false);
    }, [media]);

    return (
        <div className="relative shrink-0">
            {imgSrc && !errored ? (
                <img
                    src={imgSrc}
                    alt={name}
                    className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl object-cover"
                    style={{ border: "1px solid #f5f5f4" }}
                    onError={() => setErrored(true)}
                />
            ) : (
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl bg-stone-100 flex items-center justify-center">
                    <Package size={22} className="text-stone-300" />
                </div>
            )}
            {delivered && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                    <Check size={10} className="text-white" strokeWidth={3} />
                </div>
            )}
        </div>
    );
}

function OrderCard({ order, onSendOTP, onVerify }) {
    const [expanded, setExpanded] = useState(false);
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const s = getStatus(order.orderStatus);
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
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-2xl border border-stone-100 overflow-hidden"
            style={{ boxShadow: "0 1px 4px 0 rgba(0,0,0,0.04)" }}
        >
            {delivered && (
                <div
                    className="h-0.5 w-full"
                    style={{ background: "linear-gradient(90deg,#10b981,#34d399)" }}
                />
            )}

            <div className="flex gap-3 sm:gap-4 p-4 sm:p-5">
                <AuctionThumbnail
                    media={order?.auctionId?.media}
                    name={order?.auctionId?.name}
                    delivered={delivered}
                />

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-[13px] sm:text-[15px] font-bold text-stone-900 leading-snug line-clamp-1">
                                {order?.auctionId?.name || "Untitled Auction"}
                            </h2>
                            <p className="text-[11px] text-stone-400 mt-0.5 flex items-center gap-1">
                                <User2 size={9} />
                                {buyerName}
                            </p>
                        </div>
                        <span
                            className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-[11px] font-semibold shrink-0"
                            style={{ background: s.bg, color: s.text }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ background: s.dot }}
                            />
                            {s.label}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-2.5 sm:gap-x-4 sm:gap-y-3 mt-3 sm:mt-4">
                        <InfoRow
                            icon={DollarSign}
                            label="Final Price"
                            value={`₹${fmt(order.finalPrice)}`}
                        />
                        <InfoRow icon={CreditCard} label="Payment" value={order.paymentStatus} />
                        <InfoRow icon={MapPin} label="City" value={order?.shippingAddress?.city} />
                        <InfoRow
                            icon={Calendar}
                            label="Order Date"
                            value={fmtDate(order.createdAt)}
                        />
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 flex-wrap">
                        {canSendOTP && (
                            <button
                                onClick={handleSendOTP}
                                disabled={sending || sent}
                                className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] font-semibold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                                style={{
                                    background: sent ? "#ecfdf5" : "#1e40af",
                                    color: sent ? "#065f46" : "#fff",
                                    border: sent ? "1px solid #a7f3d0" : "1px solid transparent",
                                }}
                            >
                                {sending ? (
                                    <>
                                        <Loader2 size={11} className="animate-spin" />
                                        Sending…
                                    </>
                                ) : sent ? (
                                    <>
                                        <Check size={11} strokeWidth={2.5} />
                                        OTP Sent
                                    </>
                                ) : (
                                    <>
                                        <Send size={11} />
                                        Send OTP
                                    </>
                                )}
                            </button>
                        )}

                        {!delivered && (
                            <button
                                onClick={() => onVerify(order._id)}
                                className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] font-semibold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl transition-all duration-200"
                                style={{
                                    background: "#f0fdf4",
                                    color: "#15803d",
                                    border: "1px solid #bbf7d0",
                                }}
                            >
                                <ShieldCheck size={11} />
                                Verify OTP
                            </button>
                        )}

                        {delivered && (
                            <span
                                className="inline-flex items-center gap-1.5 text-[11px] sm:text-[12px] font-semibold px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl"
                                style={{
                                    background: "#ecfdf5",
                                    color: "#065f46",
                                    border: "1px solid #a7f3d0",
                                }}
                            >
                                <CheckCircle2 size={11} />
                                Delivered
                            </span>
                        )}

                        <button
                            onClick={() => setExpanded((p) => !p)}
                            className="ml-auto inline-flex items-center gap-1 text-[11px] sm:text-[12px] text-stone-400 hover:text-stone-700 font-medium transition-colors"
                        >
                            <Eye size={11} />
                            {expanded ? "Less" : "Details"}
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
            </div>

            <AnimatePresence initial={false}>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div
                            className="mx-4 sm:mx-5 mb-4 sm:mb-5 pt-3 sm:pt-4 border-t grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
                            style={{ borderColor: "#f5f5f4" }}
                        >
                            <InfoRow
                                icon={Calendar}
                                label="Auction Ends"
                                value={fmtDate(order?.auctionId?.endTime)}
                            />
                            <InfoRow
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
                            <InfoRow
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

function OTPModal({ orderId, otp, setOtp, onVerify, onClose }) {
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
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-3 sm:px-4 pb-4 sm:pb-0"
            style={{ background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
            onClick={onClose}
        >
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 28 }}
                className="w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 relative"
                style={{ boxShadow: "0 24px 64px -12px rgba(0,0,0,0.18)" }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center transition-colors"
                >
                    <X size={13} className="text-stone-500" />
                </button>

                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                        <ShieldCheck size={18} className="text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-[15px] sm:text-[16px] font-bold text-stone-900">
                            Verify Delivery OTP
                        </h2>
                        <p className="text-[11px] sm:text-[12px] text-stone-400">
                            Enter the OTP shared by the buyer
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="• • • • • •"
                        value={otp}
                        onChange={(e) => {
                            setOtp(e.target.value);
                            setError("");
                        }}
                        maxLength={6}
                        autoFocus
                        className="w-full rounded-xl border px-4 py-3 sm:py-3.5 text-xl font-bold text-stone-900 tracking-[0.35em] text-center transition-colors focus:outline-none"
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
                        className="w-full py-3 sm:py-3.5 rounded-xl font-bold text-[13px] text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-70"
                        style={{ background: verifying ? "#6ee7b7" : "#059669" }}
                    >
                        {verifying ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                Verifying…
                            </>
                        ) : (
                            <>
                                <Check size={14} strokeWidth={2.5} />
                                Confirm Delivery
                            </>
                        )}
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full py-2.5 sm:py-3 rounded-xl text-[13px] font-medium text-stone-500 hover:text-stone-700 hover:bg-stone-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function SellerDashboard() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [otpModal, setOtpModal] = useState(null);
    const [otp, setOtp] = useState("");

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/api/order/seller");
            setOrders(data.data);
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

    const stats = {
        total: orders.length,
        confirmed: orders.filter((o) => o.orderStatus === "confirmed").length,
        delivered: orders.filter((o) => o.orderStatus === "delivered").length,
    };

    return (
        <div
            className="min-h-screen px-3 sm:px-6 lg:px-10 py-6 sm:py-8 lg:py-10"
            style={{ background: "#f9f8f6" }}
        >
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="flex items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8"
                >
                    <div>
                        <h1 className="text-xl sm:text-2xl lg:text-[28px] font-black text-stone-900 tracking-tight">
                            Seller Orders
                        </h1>
                        <p className="text-[12px] sm:text-[13px] text-stone-400 mt-0.5 sm:mt-1">
                            Manage deliveries and OTP verification
                        </p>
                    </div>

                    <Link to="/auction/create">
                        <motion.span
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-[13px] font-semibold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all cursor-pointer whitespace-nowrap"
                            style={{ background: "#1c1917", color: "#fafaf9" }}
                        >
                            <Plus size={12} />
                            <span className="hidden xs:inline">Create Auction</span>
                            <span className="xs:hidden">New</span>
                            <ArrowUpRight size={11} className="opacity-50" />
                        </motion.span>
                    </Link>
                </motion.div>

                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-5 sm:mb-6">
                    <StatCard
                        label="Total"
                        value={stats.total}
                        icon={ShoppingBag}
                        accent="#3b82f6"
                        delay={0.05}
                        loading={loading}
                    />
                    <StatCard
                        label="Confirmed"
                        value={stats.confirmed}
                        icon={BadgeCheck}
                        accent="#f59e0b"
                        delay={0.1}
                        loading={loading}
                    />
                    <StatCard
                        label="Delivered"
                        value={stats.delivered}
                        icon={Truck}
                        accent="#10b981"
                        delay={0.15}
                        loading={loading}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row gap-2 sm:gap-2.5 mb-4 sm:mb-5"
                >
                    <div className="relative flex-1">
                        <Search
                            size={13}
                            className="absolute top-1/2 left-3 -translate-y-1/2 text-stone-300 pointer-events-none"
                        />
                        <input
                            type="text"
                            placeholder="Search auction or buyer…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white border rounded-xl pl-8 pr-4 py-2.5 text-[12px] sm:text-[13px] text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-300 transition-colors"
                            style={{
                                border: "1px solid #e7e5e4",
                                boxShadow: "0 1px 2px 0 rgba(0,0,0,0.03)",
                            }}
                        />
                    </div>

                    <div
                        className="flex gap-1 p-1 rounded-xl shrink-0 overflow-x-auto"
                        style={{ background: "#fff", border: "1px solid #e7e5e4" }}
                    >
                        {FILTERS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg text-[11px] sm:text-[12px] font-semibold transition-all duration-200 whitespace-nowrap"
                                style={
                                    filter === key
                                        ? { background: "#1c1917", color: "#fafaf9" }
                                        : { color: "#78716c" }
                                }
                            >
                                <Icon size={10} />
                                {label}
                            </button>
                        ))}
                    </div>
                </motion.div>

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
                            className="bg-white rounded-2xl border p-12 sm:p-20 text-center"
                            style={{ border: "1px solid #f5f5f4" }}
                        >
                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Package size={22} className="text-stone-300" />
                            </div>
                            <h3 className="text-[14px] sm:text-[16px] font-bold text-stone-700">
                                No orders found
                            </h3>
                            <p className="text-[12px] sm:text-[13px] text-stone-400 mt-1">
                                {search
                                    ? "Try a different search term."
                                    : "Orders appear here when buyers win your auctions."}
                            </p>
                        </motion.div>
                    ) : (
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
                    )}
                </div>
            </div>

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
