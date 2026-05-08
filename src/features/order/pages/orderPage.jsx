import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    CreditCard,
    MapPin,
    Package,
    ShieldCheck,
    Loader2,
    XCircle,
    RefreshCcw,
    CheckCircle2,
    Truck,
    ArrowLeft,
    MoreHorizontal,
    Edit2,
    User,
    AlertCircle,
} from "lucide-react";
import { api } from "@/shared/services/axios";
import { showError, showSuccess } from "@/shared/utils/toast";

/* ─── helpers ────────────────────────────────────────────────── */
const fmt = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const TAG = ({ color, bg, border, children }) => (
    <span
        style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "2px 8px",
            borderRadius: 6,
            background: bg,
            border: `1px solid ${border}`,
            fontSize: 11,
            fontWeight: 600,
            color,
            letterSpacing: "0.03em",
        }}
    >
        <span style={{ width: 5, height: 5, borderRadius: "50%", background: color }} />
        {children}
    </span>
);

const paymentTag = (s) =>
    ({
        pending: (
            <TAG color="#b45309" bg="#fefce8" border="#fde68a">
                Payment pending
            </TAG>
        ),
        completed: (
            <TAG color="#15803d" bg="#f0fdf4" border="#bbf7d0">
                Paid
            </TAG>
        ),
        cancelled: (
            <TAG color="#b91c1c" bg="#fff1f2" border="#fecaca">
                Payment cancelled
            </TAG>
        ),
        refunded: (
            <TAG color="#6d28d9" bg="#f5f3ff" border="#ddd6fe">
                Refunded
            </TAG>
        ),
    })[s] || (
        <TAG color="#64748b" bg="#f8fafc" border="#e2e8f0">
            {s}
        </TAG>
    );

const orderTag = (s) =>
    ({
        pending: (
            <TAG color="#b45309" bg="#fefce8" border="#fde68a">
                Unfulfilled
            </TAG>
        ),
        confirmed: (
            <TAG color="#1d4ed8" bg="#eff6ff" border="#bfdbfe">
                Confirmed
            </TAG>
        ),
        shipped: (
            <TAG color="#6d28d9" bg="#f5f3ff" border="#ddd6fe">
                Shipped
            </TAG>
        ),
        delivered: (
            <TAG color="#15803d" bg="#f0fdf4" border="#bbf7d0">
                Delivered
            </TAG>
        ),
        cancelled: (
            <TAG color="#b91c1c" bg="#fff1f2" border="#fecaca">
                Cancelled
            </TAG>
        ),
    })[s] || (
        <TAG color="#64748b" bg="#f8fafc" border="#e2e8f0">
            {s}
        </TAG>
    );

/* ─── Card ───────────────────────────────────────────────────── */
function Card({ children, style = {} }) {
    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                ...style,
            }}
        >
            {children}
        </div>
    );
}

function CardSection({ title, action, children }) {
    return (
        <div style={{ padding: "16px 20px" }}>
            {title && (
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 12,
                    }}
                >
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{title}</span>
                    {action && (
                        <button
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#9ca3af",
                                padding: 2,
                                borderRadius: 4,
                                display: "flex",
                                alignItems: "center",
                            }}
                        >
                            {action}
                        </button>
                    )}
                </div>
            )}
            {children}
        </div>
    );
}

const Divider = () => <div style={{ borderTop: "1px solid #f3f4f6" }} />;

function Row({ label, value, bold }) {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "3px 0",
            }}
        >
            <span style={{ fontSize: 13, color: "#6b7280" }}>{label}</span>
            <span
                style={{
                    fontSize: 13,
                    color: bold ? "#111827" : "#374151",
                    fontWeight: bold ? 700 : 400,
                }}
            >
                {value}
            </span>
        </div>
    );
}

function Btn({ onClick, disabled, children, variant = "default", size = "md", fullWidth }) {
    const v = {
        default: { bg: "#fff", border: "#d1d5db", color: "#374151", hbg: "#f9fafb" },
        primary: { bg: "#111827", border: "#111827", color: "#fff", hbg: "#1f2937" },
        danger: { bg: "#fff", border: "#d1d5db", color: "#dc2626", hbg: "#fff1f2" },
        subtle: { bg: "#f9fafb", border: "#e5e7eb", color: "#374151", hbg: "#f3f4f6" },
    }[variant];
    const h = size === "sm" ? 30 : size === "lg" ? 44 : 36;
    const px = size === "sm" ? 10 : size === "lg" ? 18 : 14;
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            style={{
                height: h,
                padding: `0 ${px}px`,
                background: v.bg,
                border: `1px solid ${v.border}`,
                borderRadius: 8,
                color: v.color,
                fontFamily: "inherit",
                fontSize: size === "sm" ? 12 : 13,
                fontWeight: 600,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
                transition: "all 0.12s",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                width: fullWidth ? "100%" : "auto",
                justifyContent: fullWidth ? "center" : "flex-start",
                whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => !disabled && (e.currentTarget.style.background = v.hbg)}
            onMouseLeave={(e) => !disabled && (e.currentTarget.style.background = v.bg)}
        >
            {children}
        </button>
    );
}

/* ─── Fulfillment timeline ───────────────────────────────────── */
const STEPS = [
    { key: "confirmed", label: "Order confirmed" },
    { key: "shipped", label: "Shipped" },
    { key: "delivered", label: "Delivered" },
];

function FulfillmentTimeline({ status }) {
    const idx = STEPS.findIndex((s) => s.key === status);
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {STEPS.map((step, i) => {
                const done = idx > i;
                const active = idx === i;
                return (
                    <div
                        key={step.key}
                        style={{
                            display: "flex",
                            gap: 12,
                            paddingBottom: i < STEPS.length - 1 ? 14 : 0,
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: 20,
                                    height: 20,
                                    borderRadius: "50%",
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: done || active ? "#111827" : "#f3f4f6",
                                    border: `2px solid ${done || active ? "#111827" : "#e5e7eb"}`,
                                }}
                            >
                                {done ? (
                                    <CheckCircle2 size={10} color="#fff" />
                                ) : (
                                    <span
                                        style={{
                                            width: 6,
                                            height: 6,
                                            borderRadius: "50%",
                                            background: active ? "#fff" : "#d1d5db",
                                        }}
                                    />
                                )}
                            </div>
                            {i < STEPS.length - 1 && (
                                <div
                                    style={{
                                        width: 2,
                                        flex: 1,
                                        minHeight: 16,
                                        marginTop: 2,
                                        background: done ? "#111827" : "#e5e7eb",
                                    }}
                                />
                            )}
                        </div>
                        <p
                            style={{
                                fontSize: 12,
                                fontWeight: active || done ? 600 : 400,
                                color: active || done ? "#111827" : "#9ca3af",
                                paddingTop: 2,
                            }}
                        >
                            {step.label}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function OrderDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

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
            if (!pd?.razorOrder?.id) throw new Error("Razorpay order not created");
            const razor = new window.Razorpay({
                key: import.meta.env.VITE_RAZORPAY_KEY,
                amount: pd.razorOrder.amount,
                currency: "INR",
                name: "Auctify",
                description: "Auction Payment",
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

                modal: {
                    ondismiss: async () => {
                        showError("Payment cancelled");
                    },
                },

                prefill: {
                    name: `${order?.buyerId?.firstName || ""} ${order?.buyerId?.lastName || ""}`,
                    email: order?.buyerId?.email || "",
                },

                theme: {
                    color: "#111827",
                },
            });

            razor.open();

            console.log(razor);
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to initiate payment");
        } finally {
            setPaying(false);
        }
    };

    const cancelOrder = async () => {
        try {
            setActionLoading(true);
            await api.patch(`/api/order/cancel/${order._id}`);
            showSuccess("Order cancelled");
            fetchOrder();
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to cancel order");
        } finally {
            setActionLoading(false);
        }
    };

    const cancelPayment = async () => {
        try {
            setActionLoading(true);
            const r = await api.get(`/api/payment/order/${order._id}`);
            const p = r?.data?.data;
            if (!p?._id) return showError("Payment not found");
            await api.patch(`/api/payment/cancel/${p._id}`);
            showSuccess("Payment cancelled");
            fetchOrder();
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to cancel payment");
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

    const updateOrderStatus = async (status) => {
        try {
            setActionLoading(true);
            await api.patch(`/api/order/status/${order._id}`, { status });
            showSuccess(`Order marked as ${status}`);
            fetchOrder();
        } catch (err) {
            showError(err?.response?.data?.message || "Failed updating status");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading)
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f3f4f6",
                }}
            >
                <Loader2
                    size={22}
                    color="#9ca3af"
                    style={{ animation: "spin 1s linear infinite" }}
                />
                <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
            </div>
        );

    if (!order)
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f3f4f6",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <Package size={36} color="#d1d5db" />
                    <p style={{ marginTop: 8, color: "#9ca3af", fontSize: 14 }}>Order not found</p>
                </div>
            </div>
        );

    const auction = order?.auctionId;
    const image = auction?.media?.[0]?.[0] || auction?.media?.[0] || "/placeholder.png";
    const address = order?.shippingAddress || order?.buyerId?.address;
    const buyer = order?.buyerId;
    const isPaid = order?.paymentStatus === "completed";
    const isCancelled = order?.orderStatus === "cancelled";
    const isDelivered = order?.orderStatus === "delivered";

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f3f4f6",
                fontFamily: "'DM Sans', system-ui, sans-serif",
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
                *{box-sizing:border-box;margin:0;padding:0;}
                @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
                @keyframes fadeUp{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
                .fade{animation:fadeUp 0.2s ease both}
            `}</style>

            {/* ── TOP BAR ── */}
            <div
                style={{
                    background: "#fff",
                    borderBottom: "1px solid #e5e7eb",
                    padding: "0 24px",
                    height: 52,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                }}
            >
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#374151",
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "inherit",
                        padding: "5px 8px",
                        borderRadius: 6,
                        transition: "background 0.12s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                >
                    <ArrowLeft size={15} /> Orders
                </button>

                <span style={{ color: "#d1d5db", fontSize: 16 }}>/</span>

                <h1 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>
                    Order ID: {order._id?.slice(-10).toUpperCase()}
                </h1>

                <div style={{ display: "flex", gap: 6 }}>
                    {paymentTag(order?.paymentStatus)}
                    {orderTag(order?.orderStatus)}
                </div>

                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    {!isCancelled && (
                        <Btn onClick={cancelOrder} disabled={actionLoading} variant="danger">
                            <XCircle size={13} /> Cancel order
                        </Btn>
                    )}
                    {isPaid && (
                        <Btn onClick={refundPayment} disabled={actionLoading}>
                            <RefreshCcw size={13} /> Refund
                        </Btn>
                    )}
                    <Btn>
                        <MoreHorizontal size={15} />
                    </Btn>
                </div>
            </div>

            {/* ── BODY ── */}
            <div
                style={{
                    maxWidth: 1100,
                    margin: "0 auto",
                    padding: "24px",
                    display: "grid",
                    gridTemplateColumns: "1fr 292px",
                    gap: 18,
                    alignItems: "start",
                }}
            >
                {/* ════ LEFT / MAIN ════ */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Order Item */}
                    <Card className="fade">
                        <CardSection title="Order Item">
                            <div
                                style={{
                                    display: "flex",
                                    gap: 14,
                                    alignItems: "center",
                                    padding: "8px 0 14px",
                                }}
                            >
                                <div
                                    style={{
                                        width: 56,
                                        height: 56,
                                        borderRadius: 8,
                                        flexShrink: 0,
                                        border: "1px solid #e5e7eb",
                                        overflow: "hidden",
                                        background: "#f9fafb",
                                    }}
                                >
                                    <img
                                        src={image}
                                        alt={auction?.name}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                                        {auction?.name}
                                    </p>
                                    {auction?.category && (
                                        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                                            {auction.category}
                                        </p>
                                    )}
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                    <p style={{ fontSize: 13, color: "#6b7280" }}>
                                        1 × {fmt(order?.finalPrice)}
                                    </p>
                                    <p
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 700,
                                            color: "#111827",
                                            marginTop: 2,
                                        }}
                                    >
                                        {fmt(order?.finalPrice)}
                                    </p>
                                </div>
                            </div>
                            <Divider />
                            <div
                                style={{
                                    paddingTop: 12,
                                    display: "flex",
                                    gap: 8,
                                    flexWrap: "wrap",
                                }}
                            >
                                {isPaid && order?.orderStatus === "confirmed" && (
                                    <Btn
                                        onClick={() => updateOrderStatus("shipped")}
                                        disabled={actionLoading}
                                        variant="primary"
                                        size="sm"
                                    >
                                        <Truck size={12} /> Mark as shipped
                                    </Btn>
                                )}
                                {order?.orderStatus === "shipped" && (
                                    <Btn
                                        onClick={() => updateOrderStatus("delivered")}
                                        disabled={actionLoading}
                                        variant="primary"
                                        size="sm"
                                    >
                                        <CheckCircle2 size={12} /> Mark as delivered
                                    </Btn>
                                )}
                                {isCancelled && (
                                    <span
                                        style={{
                                            fontSize: 12,
                                            color: "#dc2626",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 5,
                                        }}
                                    >
                                        <AlertCircle size={13} /> Order cancelled
                                    </span>
                                )}
                                {isDelivered && (
                                    <span
                                        style={{
                                            fontSize: 12,
                                            color: "#16a34a",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 5,
                                        }}
                                    >
                                        <CheckCircle2 size={13} /> Delivered successfully
                                    </span>
                                )}
                            </div>
                        </CardSection>
                    </Card>

                    {/* Fulfillment */}
                    {!isCancelled && (
                        <Card className="fade">
                            <CardSection title="Fulfillment">
                                <FulfillmentTimeline status={order?.orderStatus} />
                            </CardSection>
                        </Card>
                    )}

                    {/* Order Summary */}
                    <Card className="fade">
                        <CardSection title="Order summary">
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    marginBottom: 10,
                                }}
                            >
                                <Row label={`Subtotal · 1 item`} value={fmt(order?.finalPrice)} />
                                <Row label="Discount" value="—" />
                                <Row label="Shipping" value="Free shipping" />
                                <div style={{ borderTop: "1px solid #e5e7eb", margin: "8px 0" }} />
                                <Row label="Total" value={fmt(order?.finalPrice)} bold />
                            </div>
                            <div
                                style={{
                                    borderTop: "1px solid #f3f4f6",
                                    paddingTop: 10,
                                    marginBottom: 14,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                <Row
                                    label="Paid by customer"
                                    value={isPaid ? fmt(order?.finalPrice) : fmt(0)}
                                />
                                {!isPaid && (
                                    <Row label="Payment due when invoice is sent" value="" />
                                )}
                            </div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                                {!isPaid ? (
                                    <>
                                        <Btn
                                            onClick={handlePayment}
                                            disabled={paying}
                                            variant="primary"
                                        >
                                            {paying ? (
                                                <>
                                                    <Loader2
                                                        size={13}
                                                        style={{
                                                            animation: "spin 1s linear infinite",
                                                        }}
                                                    />{" "}
                                                    Processing…
                                                </>
                                            ) : (
                                                <>
                                                    <CreditCard size={13} /> Collect payment
                                                </>
                                            )}
                                        </Btn>
                                        <Btn onClick={cancelPayment} disabled={actionLoading}>
                                            Cancel payment
                                        </Btn>
                                    </>
                                ) : (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 6,
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: "#16a34a",
                                        }}
                                    >
                                        <CheckCircle2 size={15} /> Payment collected
                                    </div>
                                )}
                            </div>
                        </CardSection>
                    </Card>

                    {/* Timeline */}
                    <Card className="fade">
                        <CardSection title="Timeline">
                            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                                <div
                                    style={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: "50%",
                                        background: "#111827",
                                        flexShrink: 0,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <User size={13} color="#fff" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p
                                        style={{
                                            fontSize: 13,
                                            fontWeight: 600,
                                            color: "#111827",
                                            marginBottom: 6,
                                        }}
                                    >
                                        {buyer?.firstName} {buyer?.lastName}
                                    </p>
                                    <textarea
                                        placeholder="Leave a comment…"
                                        style={{
                                            width: "100%",
                                            border: "1px solid #e5e7eb",
                                            borderRadius: 8,
                                            padding: "10px 12px",
                                            fontSize: 13,
                                            color: "#374151",
                                            fontFamily: "inherit",
                                            resize: "none",
                                            outline: "none",
                                            background: "#f9fafb",
                                            lineHeight: 1.5,
                                            minHeight: 64,
                                            transition: "border-color 0.12s",
                                        }}
                                        onFocus={(e) => (e.target.style.borderColor = "#6b7280")}
                                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                                    />
                                </div>
                            </div>
                        </CardSection>
                    </Card>
                </div>

                {/* ════ RIGHT PANEL ════ */}
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {/* Notes */}
                    <Card className="fade">
                        <CardSection title="Notes" action={<Edit2 size={13} />}>
                            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
                                {auction?.description
                                    ? auction.description.slice(0, 90) +
                                      (auction.description.length > 90 ? "…" : "")
                                    : "No notes from customer"}
                            </p>
                        </CardSection>
                    </Card>

                    {/* Customer */}
                    <Card className="fade">
                        <CardSection title="Customer">
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <div
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: "50%",
                                        background: "#f3f4f6",
                                        border: "1px solid #e5e7eb",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                    }}
                                >
                                    <User size={14} color="#9ca3af" />
                                </div>
                                <div>
                                    <p style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
                                        {buyer?.firstName} {buyer?.lastName}
                                    </p>
                                    <p style={{ fontSize: 11, color: "#9ca3af" }}>1 Order</p>
                                </div>
                            </div>
                        </CardSection>

                        <Divider />

                        <CardSection title="Contact information" action={<Edit2 size={13} />}>
                            <p style={{ fontSize: 13, color: "#374151" }}>
                                {buyer?.email || "No email"}
                            </p>
                            <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 2 }}>
                                {buyer?.phone || "No phone number"}
                            </p>
                        </CardSection>

                        <Divider />

                        <CardSection title="Shipping address" action={<Edit2 size={13} />}>
                            {address ? (
                                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.9 }}>
                                    <p style={{ fontWeight: 600, color: "#111827" }}>
                                        {buyer?.firstName} {buyer?.lastName}
                                    </p>
                                    <p>{address?.street}</p>
                                    <p>
                                        {address?.city}, {address?.state}
                                    </p>
                                    <p>{address?.country}</p>
                                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: 12 }}>
                                        {address?.pin}
                                    </p>
                                    <button
                                        style={{
                                            marginTop: 4,
                                            background: "none",
                                            border: "none",
                                            color: "#4f46e5",
                                            fontSize: 12,
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            fontFamily: "inherit",
                                            padding: 0,
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 4,
                                        }}
                                    >
                                        <MapPin size={11} /> View Map
                                    </button>
                                </div>
                            ) : (
                                <p style={{ fontSize: 13, color: "#9ca3af" }}>
                                    No shipping address
                                </p>
                            )}
                        </CardSection>

                        <Divider />

                        <CardSection title="Billing address">
                            <p style={{ fontSize: 13, color: "#6b7280" }}>
                                Same as shipping address
                            </p>
                        </CardSection>
                    </Card>

                    {/* Conversion */}
                    <Card className="fade">
                        <CardSection title="Conversion summary">
                            <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>
                                {isPaid
                                    ? "Customer completed payment successfully."
                                    : "There aren't any conversion details available for this order."}
                            </p>
                            {!isPaid && (
                                <button
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        color: "#4f46e5",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        fontFamily: "inherit",
                                        padding: 0,
                                        marginTop: 6,
                                    }}
                                >
                                    Learn more
                                </button>
                            )}
                        </CardSection>
                    </Card>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            padding: "2px 2px",
                        }}
                    >
                        <ShieldCheck size={12} color="#d1d5db" />
                        <span style={{ fontSize: 11, color: "#d1d5db" }}>
                            Secured · Razorpay · 256-bit SSL
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
