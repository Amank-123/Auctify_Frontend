import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import jsPDF from "jspdf";

import {
    Package,
    Loader2,
    Truck,
    CheckCircle2,
    Clock3,
    XCircle,
    Search,
    SlidersHorizontal,
} from "lucide-react";

import { api } from "@/shared/services/axios";
import { showError } from "@/shared/utils/toast";

const PAYMENT_CFG = {
    pending: {
        label: "Pending",
        dot: "bg-amber-400",
        classes: "text-amber-700 bg-amber-50 ring-amber-200/80",
    },

    completed: {
        label: "Paid",
        dot: "bg-emerald-400",
        classes: "text-emerald-700 bg-emerald-50 ring-emerald-200/80",
    },

    failed: {
        label: "Failed",
        dot: "bg-red-400",
        classes: "text-red-700 bg-red-50 ring-red-200/80",
    },

    refunded: {
        label: "Refunded",
        dot: "bg-violet-400",
        classes: "text-violet-700 bg-violet-50 ring-violet-200/80",
    },

    cancelled: {
        label: "Cancelled",
        dot: "bg-zinc-400",
        classes: "text-zinc-500 bg-zinc-50 ring-zinc-200/80",
    },
};

const ORDER_CFG = {
    awaiting_payment: {
        label: "Awaiting payment",
        classes: "text-amber-700 bg-amber-50 ring-amber-200/80",
        Icon: Clock3,
    },

    pending: {
        label: "Pending",
        classes: "text-amber-700 bg-amber-50 ring-amber-200/80",
        Icon: Clock3,
    },

    confirmed: {
        label: "Confirmed",
        classes: "text-blue-700 bg-blue-50 ring-blue-200/80",
        Icon: CheckCircle2,
    },

    processing: {
        label: "Processing",
        classes: "text-sky-700 bg-sky-50 ring-sky-200/80",
        Icon: Clock3,
    },

    shipped: {
        label: "Shipped",
        classes: "text-violet-700 bg-violet-50 ring-violet-200/80",
        Icon: Truck,
    },

    delivered: {
        label: "Delivered",
        classes: "text-emerald-700 bg-emerald-50 ring-emerald-200/80",
        Icon: CheckCircle2,
    },

    cancelled: {
        label: "Cancelled",
        classes: "text-red-700 bg-red-50 ring-red-200/80",
        Icon: XCircle,
    },
};

function PaymentBadge({ status }) {
    const c = PAYMENT_CFG[status] ?? PAYMENT_CFG.pending;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${c.classes}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
}

function OrderBadge({ status }) {
    const c = ORDER_CFG[status] ?? ORDER_CFG.pending;

    const { Icon } = c;

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ${c.classes}`}
        >
            <Icon size={10} />
            {c.label}
        </span>
    );
}

export default function MyOrdersPage() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [activeTab, setActiveTab] = useState("all");

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

    const filtered = useMemo(() => {
        return orders.filter((o) => {
            const matchSearch =
                !search || o?.auctionId?.name?.toLowerCase().includes(search.toLowerCase());

            const matchTab = activeTab === "all" ? true : o?.orderStatus === activeTab;

            return matchSearch && matchTab;
        });
    }, [orders, search, activeTab]);

    const tabs = [
        {
            key: "all",
            label: "All Orders",
            count: orders.length,
        },

        {
            key: "processing",
            label: "Processing",
            count: orders.filter((o) => o.orderStatus === "processing").length,
        },

        {
            key: "shipped",
            label: "Shipped",
            count: orders.filter((o) => o.orderStatus === "shipped").length,
        },

        {
            key: "cancelled",
            label: "Cancelled",
            count: orders.filter((o) => o.orderStatus === "cancelled").length,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100/70">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-5 sm:py-10">
                {/* HEADER */}
                <div className="mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h1
                                className="
                                    text-[30px] sm:text-3xl
                                    font-black
                                    tracking-tight
                                    text-zinc-900
                                "
                            >
                                All Orders
                            </h1>

                            <p
                                className="
                                    mt-1.5
                                    text-sm
                                    text-zinc-500
                                "
                            >
                                Track and manage your auction orders.
                            </p>
                        </div>
                    </div>

                    {/* TABS */}
                    <div
                        className="
                            mt-5

                            flex gap-2
                            overflow-x-auto
                            scrollbar-hide

                            pb-1
                        "
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`
                                    shrink-0

                                    inline-flex items-center
                                    gap-2

                                    rounded-xl

                                    px-4 py-2.5

                                    text-[13px]
                                    font-semibold

                                    transition-all

                                    ${
                                        activeTab === tab.key
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "border border-zinc-200 bg-white text-zinc-700"
                                    }
                                `}
                            >
                                {tab.label}

                                <span
                                    className={`
                                        rounded-full

                                        px-1.5 py-0.5

                                        text-[10px]
                                        font-bold

                                        ${
                                            activeTab === tab.key
                                                ? "bg-white/20 text-white"
                                                : "bg-zinc-100 text-zinc-500"
                                        }
                                    `}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* SEARCH */}
                <div className="mb-4 flex flex-col gap-3">
                    <label
                        className="
                            flex h-11 items-center gap-3

                            rounded-2xl

                            border border-zinc-200
                            bg-white

                            px-4

                            shadow-sm
                        "
                    >
                        <Search className="h-4 w-4 text-zinc-400" />

                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search orders..."
                            className="
                                flex-1
                                bg-transparent

                                text-sm
                                text-zinc-900

                                outline-none
                            "
                        />
                    </label>

                    <button
                        className="
                            flex h-11
                            items-center justify-center
                            gap-2

                            rounded-2xl

                            border border-zinc-200
                            bg-white

                            text-sm font-medium
                            text-zinc-600

                            shadow-sm
                        "
                    >
                        <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
                        Filter
                    </button>
                </div>

                {/* TABLE */}
                <div
                    className="
                        overflow-hidden

                        rounded-3xl

                        border border-zinc-200

                        bg-white/90
                        backdrop-blur-sm

                        shadow-[0_10px_30px_rgba(0,0,0,0.04)]
                    "
                >
                    {/* DESKTOP HEADER */}
                    <div
                        className="
                            hidden lg:grid

                            grid-cols-[2.8fr_1fr_1fr_1fr_.9fr]

                            border-b border-zinc-100

                            bg-zinc-50/70

                            px-6 py-4
                        "
                    >
                        {["Product", "Amount", "Payment", "Status", "Actions"].map((h) => (
                            <span
                                key={h}
                                className="
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-widest
                                    text-zinc-400
                                "
                            >
                                {h}
                            </span>
                        ))}
                    </div>

                    {/* CONTENT */}
                    {loading ? (
                        <div className="py-20 flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-20 text-center">
                            <Package className="mx-auto mb-4 h-10 w-10 text-zinc-300" />

                            <p className="text-sm text-zinc-500">No orders found.</p>
                        </div>
                    ) : (
                        filtered.map((order, idx) => (
                            <OrderRow
                                key={order?._id}
                                order={order}
                                isLast={idx === filtered.length - 1}
                                navigate={navigate}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

function OrderRow({ order, isLast, navigate }) {
    const auction = order?.auctionId;

    const image = auction?.media?.[0]?.[0] ?? auction?.media?.[0] ?? "/placeholder.png";

    const downloadReceipt = (e) => {
        e.stopPropagation();

        const doc = new jsPDF();

        doc.text("Receipt", 20, 20);

        doc.save(`Invoice-${order?._id?.slice(-6)}.pdf`);
    };

    return (
        <motion.div
            layout
            onClick={() => navigate(`/orders/${order?._id}`)}
            className={`
                group

                cursor-pointer

                bg-white

                transition-all duration-300

                hover:bg-zinc-50/80

                ${!isLast ? "border-b border-zinc-100" : ""}
            `}
        >
            {/* DESKTOP */}
            <div
                className="
                    hidden lg:grid

                    grid-cols-[2.8fr_1fr_1fr_1fr_.9fr]

                    items-center

                    px-6 py-4
                "
            >
                <div className="flex min-w-0 items-center gap-4 pr-6">
                    <div
                        className="
                            h-16 w-16
                            overflow-hidden

                            rounded-xl

                            border border-zinc-100

                            bg-zinc-50

                            shrink-0
                        "
                    >
                        <img
                            src={image}
                            alt={auction?.name}
                            className="
                                h-full w-full
                                object-cover
                            "
                        />
                    </div>

                    <div className="min-w-0">
                        <p
                            className="
                                truncate

                                text-[16px]
                                font-bold

                                tracking-tight

                                text-zinc-900
                            "
                        >
                            {auction?.name}
                        </p>

                        <div
                            className="
                                mt-1.5

                                flex flex-wrap
                                items-center gap-2

                                text-[11px]
                                text-zinc-400
                            "
                        >
                            <span>
                                Order ID:
                                {order?._id?.slice(-6)}
                            </span>

                            <span>•</span>

                            <span>
                                Seller:
                                {order?.sellerId?.firstName}
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="text-[20px] font-black tracking-tight text-zinc-900">
                        ₹{order?.finalPrice?.toLocaleString("en-IN")}
                    </p>
                </div>

                <PaymentBadge status={order?.paymentStatus} />

                <OrderBadge status={order?.orderStatus} />

                <div className="flex flex-col gap-2">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();

                            navigate(`/orders/${order?._id}`);
                        }}
                        className="
                            h-8 px-4

                            rounded-xl

                            bg-blue-600

                            text-[11px]
                            font-semibold
                            text-white
                        "
                    >
                        View Details
                    </button>

                    <button
                        onClick={downloadReceipt}
                        className="
                            h-8 px-4

                            rounded-xl

                            border border-zinc-200

                            bg-white

                            text-[11px]
                            font-semibold

                            text-zinc-600
                        "
                    >
                        Receipt
                    </button>
                </div>
            </div>

            {/* MOBILE */}
            {/* MOBILE */}
            <div className="lg:hidden p-3">
                <div
                    className="
            rounded-[28px]
            border border-zinc-200/80
            bg-white

            p-4

            shadow-[0_8px_30px_rgba(0,0,0,0.04)]
        "
                >
                    {/* TOP */}
                    <div className="flex items-start gap-3">
                        {/* IMAGE */}
                        <div
                            className="
                    h-[92px]
                    w-[92px]

                    shrink-0

                    overflow-hidden

                    rounded-2xl

                    bg-zinc-100
                "
                        >
                            <img
                                src={image}
                                alt={auction?.name}
                                className="
                        h-full
                        w-full
                        object-cover
                    "
                            />
                        </div>

                        {/* INFO */}
                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <h3
                                        className="
                                truncate

                                text-[17px]
                                font-bold

                                tracking-tight
                                text-zinc-900
                            "
                                    >
                                        {auction?.name}
                                    </h3>

                                    <p
                                        className="
                                mt-1

                                text-[12px]
                                font-medium

                                text-zinc-400
                            "
                                    >
                                        Seller • {order?.sellerId?.firstName}
                                    </p>

                                    <p
                                        className="
                                mt-0.5

                                text-[11px]

                                text-zinc-400
                            "
                                    >
                                        #{order?._id?.slice(-6)}
                                    </p>
                                </div>
                            </div>

                            {/* PRICE */}
                            <div className="mt-4">
                                <p
                                    className="
                            text-[32px]
                            leading-none

                            font-black
                            tracking-tight

                            text-zinc-900
                        "
                                >
                                    ₹{order?.finalPrice?.toLocaleString("en-IN")}
                                </p>

                                <p
                                    className="
                            mt-1

                            text-[11px]
                            font-medium

                            text-zinc-400
                        "
                                >
                                    Winning Bid
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* BADGES */}
                    <div className="mt-5 flex flex-wrap gap-2">
                        <PaymentBadge status={order?.paymentStatus} />

                        <OrderBadge status={order?.orderStatus} />
                    </div>

                    {/* ACTIONS */}
                    <div className="mt-5 flex gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/orders/${order?._id}`);
                            }}
                            className="
                    flex-1

                    h-12

                    rounded-2xl

                    bg-gradient-to-r
                    from-blue-600
                    to-blue-500

                    text-[14px]
                    font-semibold
                    text-white

                    shadow-[0_8px_20px_rgba(37,99,235,0.25)]

                    active:scale-[0.98]
                    transition-all
                "
                        >
                            View Order
                        </button>

                        <button
                            onClick={downloadReceipt}
                            className="
                    flex-1

                    h-12

                    rounded-2xl

                    border border-zinc-200

                    bg-zinc-50

                    text-[14px]
                    font-semibold

                    text-zinc-700

                    active:scale-[0.98]
                    transition-all
                "
                        >
                            Receipt
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
