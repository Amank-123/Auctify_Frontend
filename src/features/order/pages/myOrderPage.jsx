import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Package,
    Loader2,
    Truck,
    CheckCircle2,
    Clock3,
    XCircle,
    ChevronRight,
    Search,
    SlidersHorizontal,
} from "lucide-react";
import { api } from "@/shared/services/axios";
import { showError } from "@/shared/utils/toast";

/* ─── status configs ─────────────────────────────────────────── */
const PAYMENT_CFG = {
    pending: { label: "Pending", color: "#b45309", bg: "#fefce8", border: "#fde68a" },
    completed: { label: "Paid", color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
    failed: { label: "Failed", color: "#b91c1c", bg: "#fff1f2", border: "#fecaca" },
    refunded: { label: "Refunded", color: "#6d28d9", bg: "#f5f3ff", border: "#ddd6fe" },
    cancelled: { label: "Cancelled", color: "#6b7280", bg: "#f9fafb", border: "#e5e7eb" },
};

const ORDER_CFG = {
    awaiting_payment: {
        label: "Awaiting payment",
        color: "#b45309",
        bg: "#fefce8",
        border: "#fde68a",
        icon: Clock3,
    },
    pending: { label: "Pending", color: "#b45309", bg: "#fefce8", border: "#fde68a", icon: Clock3 },
    confirmed: {
        label: "Confirmed",
        color: "#1d4ed8",
        bg: "#eff6ff",
        border: "#bfdbfe",
        icon: CheckCircle2,
    },
    processing: {
        label: "Processing",
        color: "#0369a1",
        bg: "#f0f9ff",
        border: "#bae6fd",
        icon: Clock3,
    },
    shipped: { label: "Shipped", color: "#6d28d9", bg: "#f5f3ff", border: "#ddd6fe", icon: Truck },
    delivered: {
        label: "Delivered",
        color: "#15803d",
        bg: "#f0fdf4",
        border: "#bbf7d0",
        icon: CheckCircle2,
    },
    cancelled: {
        label: "Cancelled",
        color: "#b91c1c",
        bg: "#fff1f2",
        border: "#fecaca",
        icon: XCircle,
    },
};

function PaymentTag({ status }) {
    const c = PAYMENT_CFG[status] || PAYMENT_CFG.pending;
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "2px 8px",
                borderRadius: 6,
                background: c.bg,
                border: `1px solid ${c.border}`,
                fontSize: 11,
                fontWeight: 600,
                color: c.color,
                letterSpacing: "0.03em",
            }}
        >
            <span
                style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: c.color,
                    flexShrink: 0,
                }}
            />
            {c.label}
        </span>
    );
}

function OrderTag({ status }) {
    const c = ORDER_CFG[status] || ORDER_CFG.pending;
    const Icon = c.icon;
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                padding: "2px 8px",
                borderRadius: 6,
                background: c.bg,
                border: `1px solid ${c.border}`,
                fontSize: 11,
                fontWeight: 600,
                color: c.color,
                letterSpacing: "0.03em",
            }}
        >
            <Icon size={10} />
            {c.label}
        </span>
    );
}

/* ─── main ───────────────────────────────────────────────────── */
export default function MyOrdersPage() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const { data } = await api.get("/api/order/my");
            setOrders(data?.data || []);
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    const filtered = orders.filter(
        (o) => !search || o?.auctionId?.name?.toLowerCase().includes(search.toLowerCase()),
    );

    /* loading */
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

    /* empty */
    if (!orders.length)
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "#f3f4f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0;}`}</style>
                <div
                    style={{ textAlign: "center", fontFamily: "'DM Sans', system-ui, sans-serif" }}
                >
                    <div
                        style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: "#fff",
                            border: "1px solid #e5e7eb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 12px",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                        }}
                    >
                        <Package size={20} color="#9ca3af" />
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>No orders yet</p>
                    <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
                        You haven't placed any orders.
                    </p>
                </div>
            </div>
        );

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
                .row-hover:hover{background:#f9fafb !important;}
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
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                }}
            >
                <h1 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>Orders</h1>
                <span
                    style={{
                        marginLeft: 8,
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#6b7280",
                        background: "#f3f4f6",
                        border: "1px solid #e5e7eb",
                        padding: "1px 7px",
                        borderRadius: 20,
                    }}
                >
                    {orders.length}
                </span>
            </div>

            {/* ── BODY ── */}
            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
                {/* Search + filter bar */}
                <div style={{ display: "flex", gap: 10, marginBottom: 16, alignItems: "center" }}>
                    <div
                        style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            background: "#fff",
                            border: "1px solid #e5e7eb",
                            borderRadius: 8,
                            padding: "0 12px",
                            height: 36,
                            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                        }}
                    >
                        <Search size={14} color="#9ca3af" style={{ flexShrink: 0 }} />
                        <input
                            placeholder="Search orders…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                flex: 1,
                                border: "none",
                                outline: "none",
                                background: "none",
                                fontSize: 13,
                                color: "#374151",
                                fontFamily: "inherit",
                            }}
                        />
                    </div>
                    <button
                        style={{
                            height: 36,
                            padding: "0 14px",
                            borderRadius: 8,
                            background: "#fff",
                            border: "1px solid #e5e7eb",
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#374151",
                            cursor: "pointer",
                            fontFamily: "inherit",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                        }}
                    >
                        <SlidersHorizontal size={13} color="#9ca3af" />
                        Filter
                    </button>
                </div>

                {/* ── TABLE ── */}
                <div
                    style={{
                        background: "#fff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                        animation: "fadeUp 0.2s ease both",
                    }}
                >
                    {/* Header */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "2.2fr 1fr 1fr 1fr 32px",
                            gap: 0,
                            padding: "0 20px",
                            height: 38,
                            background: "#f9fafb",
                            borderBottom: "1px solid #e5e7eb",
                            alignItems: "center",
                        }}
                    >
                        {["Item", "Amount", "Payment", "Status", ""].map((h, i) => (
                            <span
                                key={i}
                                style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "#9ca3af",
                                    textTransform: "uppercase",
                                    letterSpacing: "0.07em",
                                    paddingRight: 16,
                                }}
                            >
                                {h}
                            </span>
                        ))}
                    </div>

                    {/* Rows */}
                    {filtered.length === 0 ? (
                        <div
                            style={{
                                padding: "40px 20px",
                                textAlign: "center",
                                color: "#9ca3af",
                                fontSize: 13,
                            }}
                        >
                            No orders match your search.
                        </div>
                    ) : (
                        filtered.map((order, idx) => {
                            const auction = order?.auctionId;
                            const image =
                                auction?.media?.[0]?.[0] ||
                                auction?.media?.[0] ||
                                "/placeholder.png";
                            const isLast = idx === filtered.length - 1;

                            return (
                                <div
                                    key={order?._id}
                                    className="row-hover"
                                    onClick={() => navigate(`/orders/${order?._id}`)}
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "2.2fr 1fr 1fr 1fr 32px",
                                        gap: 0,
                                        padding: "12px 20px",
                                        alignItems: "center",
                                        borderBottom: isLast ? "none" : "1px solid #f3f4f6",
                                        cursor: "pointer",
                                        background: "#fff",
                                        transition: "background 0.1s",
                                    }}
                                >
                                    {/* Item */}
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 12,
                                            minWidth: 0,
                                            paddingRight: 16,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 8,
                                                flexShrink: 0,
                                                overflow: "hidden",
                                                border: "1px solid #f3f4f6",
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
                                        <div style={{ minWidth: 0 }}>
                                            <p
                                                style={{
                                                    fontSize: 13,
                                                    fontWeight: 600,
                                                    color: "#111827",
                                                    whiteSpace: "nowrap",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                }}
                                            >
                                                {auction?.name}
                                            </p>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 6,
                                                    marginTop: 2,
                                                }}
                                            >
                                                {order?.sellerId?.profile && (
                                                    <img
                                                        src={order.sellerId.profile}
                                                        style={{
                                                            width: 14,
                                                            height: 14,
                                                            borderRadius: "50%",
                                                            objectFit: "cover",
                                                            border: "1px solid #e5e7eb",
                                                        }}
                                                    />
                                                )}
                                                <span style={{ fontSize: 12, color: "#9ca3af" }}>
                                                    {order?.sellerId?.firstName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div style={{ paddingRight: 16 }}>
                                        <p
                                            style={{
                                                fontSize: 13,
                                                fontWeight: 700,
                                                color: "#111827",
                                                fontFamily: "'DM Mono', monospace",
                                                letterSpacing: "-0.01em",
                                            }}
                                        >
                                            ₹{order?.finalPrice?.toLocaleString("en-IN")}
                                        </p>
                                        <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
                                            Winning bid
                                        </p>
                                    </div>

                                    {/* Payment */}
                                    <div style={{ paddingRight: 16 }}>
                                        <PaymentTag status={order?.paymentStatus} />
                                    </div>

                                    {/* Order Status */}
                                    <div style={{ paddingRight: 16 }}>
                                        <OrderTag status={order?.orderStatus} />
                                    </div>

                                    {/* Chevron */}
                                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                                        <ChevronRight size={15} color="#d1d5db" />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer count */}
                <p style={{ marginTop: 12, fontSize: 12, color: "#9ca3af", paddingLeft: 2 }}>
                    Showing {filtered.length} of {orders.length} orders
                </p>
            </div>
        </div>
    );
}
