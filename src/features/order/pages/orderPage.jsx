import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    CreditCard,
    MapPin,
    ShieldCheck,
    Loader2,
    XCircle,
    RefreshCcw,
    CheckCircle2,
    ArrowLeft,
    AlertCircle,
    Truck,
    ChevronRight,
    Package,
    KeyRound,
    Clock,
} from "lucide-react";
import { api } from "@/shared/services/axios";
import { showError, showSuccess } from "@/shared/utils/toast";

const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`;

const HIGH_VALUE_LIMIT = 100000;

const PAYMENT_STATUS = {
    pending: { label: "Pending", color: "#b45309" },
    completed: { label: "Payment Complete", color: "#15803d" },
    refunded: { label: "Refunded", color: "#6d28d9" },
    cancelled: { label: "Cancelled", color: "#dc2626" },
    awaiting_offline_payment: { label: "Awaiting Offline Payment", color: "#c2410c" },
};

const ORDER_STATUS = {
    pending: { label: "Order Placed", color: "#0369a1" },
    confirmed: { label: "Order Confirmed", color: "#0369a1" },
    shipped: { label: "Shipped", color: "#4f46e5" },
    delivered: { label: "Delivered", color: "#047857" },
    cancelled: { label: "Cancelled", color: "#dc2626" },
    awaiting_offline_payment: { label: "Awaiting Offline Payment", color: "#c2410c" },
};

const Dot = ({ color }) => (
    <span style={{ background: color }} className="inline-block h-2 w-2 rounded-full shrink-0" />
);
const Hr = () => <div className="border-t border-gray-100" />;

/* ─── 3-step milestone map ───────────────────────────────────────
   Step 0 → Order Placed   (always done once order exists)
   Step 1 → Payment Done   (paymentStatus === "completed")
   Step 2 → Delivered      (orderStatus  === "delivered")
──────────────────────────────────────────────────────────────── */
const MILESTONES = [
    { key: "placed", label: "Order Placed", icon: Package },
    { key: "paid", label: "Payment Done", icon: CreditCard },
    { key: "delivered", label: "Delivered", icon: Truck },
];

function getMilestoneIndex(order) {
    if (order?.orderStatus === "delivered") return 2;
    if (order?.paymentStatus === "completed") return 1;
    return 0; // order always placed
}

const Stepper = ({ order }) => {
    const activeIdx = getMilestoneIndex(order);
    const isCancelled = order?.orderStatus === "cancelled";

    return (
        <div className="px-5 py-6">
            {isCancelled ? (
                <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                    <XCircle size={16} className="shrink-0" />
                    This order has been cancelled.
                </div>
            ) : (
                <div className="relative flex items-start justify-between">
                    {/* connecting lines — drawn behind circles */}
                    <div className="absolute left-0 right-0 top-[14px] flex px-[14px]">
                        {MILESTONES.slice(0, -1).map((_, i) => (
                            <div key={i} className="flex-1 mx-1">
                                <div
                                    style={{
                                        background: i < activeIdx ? "#2874f0" : "#e5e7eb",
                                        height: 2,
                                        width: "100%",
                                        transition: "background 0.3s",
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    {MILESTONES.map((m, i) => {
                        const done = i <= activeIdx;
                        const active = i === activeIdx;
                        const Icon = m.icon;
                        return (
                            <div
                                key={m.key}
                                className="relative z-10 flex flex-col items-center gap-2"
                                style={{ flex: 1 }}
                            >
                                {/* circle */}
                                <div
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: "50%",
                                        background: done ? "#2874f0" : "#e5e7eb",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: active ? "0 0 0 3px #dbeafe" : "none",
                                        transition: "background 0.3s, box-shadow 0.3s",
                                    }}
                                >
                                    {done ? (
                                        <CheckCircle2 size={15} color="#fff" />
                                    ) : (
                                        <Icon size={13} color="#9ca3af" />
                                    )}
                                </div>
                                {/* label */}
                                <span
                                    style={{
                                        color: active ? "#2874f0" : done ? "#111827" : "#9ca3af",
                                        fontWeight: active || done ? 600 : 400,
                                    }}
                                    className="text-[11px] text-center leading-tight"
                                >
                                    {m.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

/* ─── OTP Delivery Modal ─────────────────────────────────────── */
const OtpModal = ({ onClose, onConfirm, loading }) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const refs = Array.from({ length: 6 }, () => null).map(() => {
        const r = { current: null };
        return r;
    });

    const handleChange = (val, i) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...otp];
        next[i] = val;
        setOtp(next);
        if (val && i < 5) refs[i + 1].current?.focus();
    };

    const handleKeyDown = (e, i) => {
        if (e.key === "Backspace" && !otp[i] && i > 0) refs[i - 1].current?.focus();
    };

    const handlePaste = (e) => {
        const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!text) return;
        e.preventDefault();
        const next = [...otp];
        text.split("").forEach((ch, i) => {
            next[i] = ch;
        });
        setOtp(next);
        refs[Math.min(text.length, 5)].current?.focus();
    };

    const value = otp.join("");

    return (
        /* backdrop */
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="w-full max-w-sm rounded-lg bg-white shadow-xl border border-gray-200">
                {/* header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div className="flex items-center gap-2">
                        <KeyRound size={16} className="text-[#2874f0]" />
                        <span className="text-sm font-bold text-gray-900">Confirm Delivery</span>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XCircle size={18} />
                    </button>
                </div>

                {/* body */}
                <div className="px-5 py-5">
                    <p className="text-sm text-gray-500 leading-relaxed">
                        Enter the <span className="font-semibold text-gray-800">6-digit OTP</span>{" "}
                        provided by the buyer to confirm delivery. This ensures the item was safely
                        received.
                    </p>

                    <div className="mt-5 flex justify-center gap-2" onPaste={handlePaste}>
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={(el) => {
                                    refs[i].current = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(e.target.value, i)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                className="h-12 w-10 rounded border border-gray-300 text-center text-lg font-bold text-gray-900 outline-none focus:border-[#2874f0] focus:ring-2 focus:ring-blue-100 transition-colors"
                            />
                        ))}
                    </div>

                    <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-gray-400">
                        <Clock size={11} />
                        OTP shared with buyer at time of delivery
                    </div>
                </div>

                {/* footer */}
                <div className="flex gap-3 border-t border-gray-100 px-5 py-4">
                    <button
                        onClick={onClose}
                        className="flex-1 rounded border border-gray-300 bg-white py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(value)}
                        disabled={value.length < 6 || loading}
                        className="flex flex-1 items-center justify-center gap-2 rounded bg-[#2874f0] py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" /> Verifying…
                            </>
                        ) : (
                            "Confirm Delivery"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

/* ════════════════════════════════════════════════════════════════ */
export default function OrderDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [otpOpen, setOtpOpen] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);

    useEffect(() => {
        if (id) fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/api/order/${id}`);
            setOrder(data?.data);
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to load order");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        try {
            setPaying(true);
            const { data } = await api.post("/api/payment", {
                orderId: order._id,
                paymentMethod: "upi",
            });
            const pd = data?.data;
            const razor = new window.Razorpay({
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: pd.razorOrder.amount,
                currency: "INR",
                name: "Auctify",
                description: "Secure auction payment",
                order_id: pd.razorOrder.id,
                handler: async (res) => {
                    try {
                        await api.post("/api/payment/verify", {
                            razorpay_order_id: res.razorpay_order_id,
                            razorpay_payment_id: res.razorpay_payment_id,
                            razorpay_signature: res.razorpay_signature,
                        });
                        showSuccess("Payment successful");
                        fetchOrder();
                    } catch (e) {
                        showError(e?.response?.data?.message || "Verification failed");
                    }
                },
                modal: { ondismiss: () => showError("Payment cancelled") },
                theme: { color: "#2874f0" },
            });
            razor.open();
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to initiate payment");
        } finally {
            setPaying(false);
        }
    };

    const handleOfflinePayment = async () => {
        try {
            setActionLoading(true);
            await api.patch(`/api/payment/offline-payment/${order._id}`);
            showSuccess("Offline payment request submitted");
            fetchOrder();
        } catch (err) {
            showError(err?.response?.data?.message || "Request failed");
        } finally {
            setActionLoading(false);
        }
    };

    const refundPayment = async () => {
        try {
            setActionLoading(true);
            const r = await api.get(`/api/payment/order/${order._id}`);
            const p = r?.data?.data;
            if (!p?._id) return showError("Payment not found");
            await api.patch(`/api/payment/refund/${p._id}`);
            showSuccess("Refund initiated");
            fetchOrder();
        } catch (err) {
            showError(err?.response?.data?.message || "Refund failed");
        } finally {
            setActionLoading(false);
        }
    };

    const cancelOrder = async () => {
        try {
            setActionLoading(true);
            await api.patch(`/api/order/cancel/${order._id}`);
            showSuccess("Order cancelled");
            fetchOrder();
        } catch (err) {
            showError(err?.response?.data?.message || "Cancel failed");
        } finally {
            setActionLoading(false);
        }
    };

    /* OTP delivery confirm — seller calls this with OTP from buyer */
    const confirmDelivery = async (otp) => {
        try {
            setOtpLoading(true);
            await api.patch(`/api/order/deliver/${order._id}`, { otp });
            showSuccess("Delivery confirmed successfully");
            setOtpOpen(false);
            fetchOrder();
        } catch (err) {
            showError(
                err?.response?.data?.message || "Invalid OTP or delivery confirmation failed",
            );
        } finally {
            setOtpLoading(false);
        }
    };

    /* ── guards ── */
    if (loading)
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f1f3f6]">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
        );
    if (!order)
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f1f3f6]">
                <p className="text-sm text-gray-400">Order not found</p>
            </div>
        );

    const auction = order?.auctionId;
    const buyer = order?.buyerId;
    const image = auction?.media?.[0]?.[0] || auction?.media?.[0] || "/placeholder.png";

    const isPaid = order?.paymentStatus === "completed";
    const isRefunded = order?.paymentStatus === "refunded";
    const isCancelled = order?.orderStatus === "cancelled";
    const isDelivered = order?.orderStatus === "delivered";
    const isShipped = order?.orderStatus === "shipped";
    const isHighValue = order?.finalPrice > HIGH_VALUE_LIMIT;
    const offlineRequested = order?.orderStatus === "awaiting_offline_payment";
    const paymentLocked = isPaid || isRefunded || isCancelled || isDelivered || offlineRequested;

    /* seller can confirm delivery if order is shipped AND payment is done */
    const canConfirmDelivery = isShipped && isPaid && !isDelivered;

    const pStatus = PAYMENT_STATUS[order?.paymentStatus] || {
        label: order?.paymentStatus,
        color: "#6b7280",
    };
    const oStatus = ORDER_STATUS[order?.orderStatus] || {
        label: order?.orderStatus,
        color: "#6b7280",
    };
    const orderId = order._id?.slice(-8).toUpperCase();

    return (
        <div
            className="min-h-screen bg-[#f1f3f6]"
            style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif", fontSize: 14 }}
        >
            {/* OTP Modal */}
            {otpOpen && (
                <OtpModal
                    onClose={() => setOtpOpen(false)}
                    onConfirm={confirmDelivery}
                    loading={otpLoading}
                />
            )}

            {/* ── HEADER ── */}
            <header className="sticky top-0 z-40 border-b border-gray-300 bg-white">
                <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:px-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1 text-sm font-medium text-[#2874f0] hover:underline"
                    >
                        <ArrowLeft size={14} />
                        My Orders
                    </button>
                    <ChevronRight size={13} className="text-gray-400" />
                    <span className="hidden text-sm text-gray-500 sm:inline">Order Details</span>
                    <span className="ml-auto font-mono text-xs text-gray-400">#{orderId}</span>
                </div>
            </header>

            {/* ── BODY ── */}
            <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_304px]">
                    {/* ══ LEFT ══ */}
                    <div className="space-y-3">
                        {/* ── Milestone Stepper card ── */}
                        <div className="bg-white border border-gray-200 rounded">
                            {/* card header */}
                            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                                <div className="flex items-center gap-2">
                                    <Dot color={oStatus.color} />
                                    <span
                                        style={{ color: oStatus.color }}
                                        className="text-sm font-bold"
                                    >
                                        {oStatus.label}
                                    </span>
                                </div>
                                {isDelivered && (
                                    <span className="inline-flex items-center gap-1.5 rounded border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                                        <CheckCircle2 size={12} /> Delivered
                                    </span>
                                )}
                            </div>

                            {/* stepper */}
                            <Stepper order={order} />

                            {/* Confirm Delivery button — visible to seller when shipped + paid */}
                            {canConfirmDelivery && (
                                <>
                                    <Hr />
                                    <div className="px-5 py-4">
                                        <div className="flex items-start gap-3 rounded border border-blue-100 bg-blue-50 px-4 py-3">
                                            <KeyRound
                                                size={15}
                                                className="mt-0.5 shrink-0 text-blue-600"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-blue-900">
                                                    Ready to confirm delivery?
                                                </p>
                                                <p className="mt-0.5 text-xs text-blue-700 leading-relaxed">
                                                    Ask the buyer for their delivery OTP and enter
                                                    it below to mark this order as delivered.
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setOtpOpen(true)}
                                                className="shrink-0 rounded bg-[#2874f0] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors"
                                            >
                                                Enter OTP
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Delivered confirmation strip */}
                            {isDelivered && (
                                <>
                                    <Hr />
                                    <div className="flex items-center gap-2 px-5 py-4 text-sm text-green-700">
                                        <CheckCircle2 size={14} className="shrink-0" />
                                        Delivery confirmed via buyer OTP. Order complete.
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ── Item card ── */}
                        <div className="bg-white border border-gray-200 rounded">
                            <div className="border-b border-gray-100 px-5 py-3">
                                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                    Item Ordered
                                </span>
                            </div>

                            <div className="flex gap-4 px-5 py-5">
                                <img
                                    src={image}
                                    alt={auction?.name}
                                    className="h-[88px] w-[88px] shrink-0 rounded border border-gray-200 object-cover"
                                />
                                <div className="flex min-w-0 flex-col justify-between py-0.5">
                                    <div>
                                        <p className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
                                            {auction?.name}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-400">Winning Bid</p>
                                    </div>
                                    <p className="text-lg font-bold text-gray-900">
                                        {fmt(order?.finalPrice)}
                                    </p>
                                </div>
                            </div>

                            {(!paymentLocked || isPaid) && (
                                <>
                                    <Hr />
                                    <div className="flex flex-wrap gap-3 px-5 py-3">
                                        {!paymentLocked && (
                                            <button
                                                onClick={cancelOrder}
                                                disabled={actionLoading}
                                                className="flex items-center gap-1.5 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <XCircle size={13} className="text-red-500" />
                                                Cancel Order
                                            </button>
                                        )}
                                        {isPaid && !isDelivered && (
                                            <button
                                                onClick={refundPayment}
                                                disabled={actionLoading}
                                                className="flex items-center gap-1.5 rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                <RefreshCcw size={13} className="text-indigo-500" />
                                                Request Refund
                                            </button>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* ── Price Details ── */}
                        <div className="bg-white border border-gray-200 rounded">
                            <div className="border-b border-gray-100 px-5 py-3">
                                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                    Price Details
                                </span>
                            </div>

                            <div className="space-y-3 px-5 py-4">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Winning Amount</span>
                                    <span className="text-gray-900">{fmt(order?.finalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Delivery Charges</span>
                                    <span className="font-medium text-green-600">FREE</span>
                                </div>
                                <Hr />
                                <div className="flex justify-between text-sm font-bold text-gray-900">
                                    <span>Total Payable</span>
                                    <span>{fmt(order?.finalPrice)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 pt-0.5">
                                    <Dot color={pStatus.color} />
                                    <span
                                        style={{ color: pStatus.color }}
                                        className="text-xs font-semibold"
                                    >
                                        {pStatus.label}
                                    </span>
                                </div>
                            </div>

                            {/* inline status messages */}
                            {(isPaid || isRefunded || offlineRequested) && (
                                <>
                                    <Hr />
                                    <div className="px-5 py-3">
                                        {isPaid && (
                                            <p className="flex items-center gap-2 text-sm text-green-700">
                                                <CheckCircle2 size={14} /> Payment successfully
                                                completed.
                                            </p>
                                        )}
                                        {isRefunded && (
                                            <p className="flex items-center gap-2 text-sm text-indigo-700">
                                                <RefreshCcw size={14} /> Refund has been processed
                                                to your account.
                                            </p>
                                        )}
                                        {offlineRequested && (
                                            <p className="flex items-start gap-2 text-sm text-orange-700">
                                                <ShieldCheck
                                                    size={14}
                                                    className="mt-0.5 shrink-0"
                                                />
                                                Offline payment requested. Our team will reach out
                                                with secure instructions.
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}

                            {/* pay actions */}
                            {!paymentLocked && (
                                <>
                                    <Hr />
                                    <div className="space-y-3 px-5 py-4">
                                        {isHighValue && (
                                            <div className="flex items-start gap-2 rounded border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-800">
                                                <AlertCircle
                                                    size={13}
                                                    className="mt-0.5 shrink-0"
                                                />
                                                UPI transactions above ₹1,00,000 may be declined by
                                                your bank. Consider requesting offline payment.
                                            </div>
                                        )}
                                        <div className="flex flex-col gap-3 sm:flex-row">
                                            <button
                                                onClick={handlePayment}
                                                disabled={paying || actionLoading}
                                                className="flex items-center justify-center gap-2 rounded bg-[#fb641b] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#e55d17] disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {paying ? (
                                                    <>
                                                        <Loader2 className="h-4 w-4 animate-spin" />{" "}
                                                        Processing…
                                                    </>
                                                ) : (
                                                    <>
                                                        <CreditCard size={14} /> Pay Now
                                                    </>
                                                )}
                                            </button>
                                            {isHighValue && (
                                                <button
                                                    onClick={handleOfflinePayment}
                                                    disabled={actionLoading}
                                                    className="flex items-center justify-center gap-2 rounded border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {actionLoading ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 animate-spin" />{" "}
                                                            Requesting…
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ShieldCheck size={14} /> Offline
                                                            Payment
                                                        </>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                        <p className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <ShieldCheck size={11} />
                                            100% Secure Payments · Powered by Razorpay
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* ══ RIGHT ══ */}
                    <div className="space-y-3">
                        {/* Delivery Address */}
                        <div className="bg-white border border-gray-200 rounded">
                            <div className="border-b border-gray-100 px-5 py-3">
                                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                    Delivery Address
                                </span>
                            </div>
                            <div className="px-5 py-4">
                                <p className="text-sm font-bold text-gray-900">
                                    {buyer?.firstName} {buyer?.lastName}
                                </p>
                                <p className="mt-2 text-sm leading-6 text-gray-600">
                                    {buyer?.address?.street}
                                    <br />
                                    {buyer?.address?.city}, {buyer?.address?.state}
                                    <br />
                                    {buyer?.address?.country}
                                </p>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                        `${buyer?.address?.street}, ${buyer?.address?.city}`,
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#2874f0] hover:underline"
                                >
                                    <MapPin size={11} /> View on Map
                                </a>
                            </div>
                        </div>

                        {/* Buyer Info */}
                        <div className="bg-white border border-gray-200 rounded">
                            <div className="border-b border-gray-100 px-5 py-3">
                                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                    Buyer Info
                                </span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                <div className="flex items-center justify-between px-5 py-3 text-sm">
                                    <span className="text-gray-500">Name</span>
                                    <span className="font-medium text-gray-900">
                                        {buyer?.firstName} {buyer?.lastName}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between gap-4 px-5 py-3 text-sm">
                                    <span className="shrink-0 text-gray-500">Email</span>
                                    <span className="truncate text-right font-medium text-gray-700">
                                        {buyer?.email}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white border border-gray-200 rounded">
                            <div className="border-b border-gray-100 px-5 py-3">
                                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                    Order Summary
                                </span>
                            </div>
                            <div className="divide-y divide-gray-100">
                                <div className="flex items-center justify-between px-5 py-3 text-sm">
                                    <span className="text-gray-500">Order ID</span>
                                    <span className="font-mono text-xs font-semibold tracking-wider text-gray-900">
                                        #{orderId}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between px-5 py-3 text-sm">
                                    <span className="text-gray-500">Payment</span>
                                    <span
                                        style={{ color: pStatus.color }}
                                        className="text-xs font-semibold"
                                    >
                                        {pStatus.label}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between px-5 py-3 text-sm">
                                    <span className="text-gray-500">Shipping</span>
                                    <span className="text-xs font-semibold text-green-600">
                                        Free
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* OTP info box — shown when order is shipped, guiding buyer */}
                        {isShipped && isPaid && !isDelivered && (
                            <div className="rounded border border-blue-100 bg-blue-50 px-4 py-4">
                                <div className="flex items-start gap-2">
                                    <KeyRound size={14} className="mt-0.5 shrink-0 text-blue-500" />
                                    <div>
                                        <p className="text-xs font-bold text-blue-800">
                                            Delivery OTP
                                        </p>
                                        <p className="mt-1 text-xs leading-relaxed text-blue-700">
                                            The buyer has received a unique OTP on their registered
                                            email/phone. Share it with the seller at the time of
                                            delivery to confirm receipt.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
