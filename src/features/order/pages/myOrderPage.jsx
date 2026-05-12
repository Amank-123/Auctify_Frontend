import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import {
    Package,
    Loader2,
    Truck,
    CheckCircle2,
    Clock3,
    XCircle,
    Search,
    SlidersHorizontal,
    Download,
} from "lucide-react";

import { api } from "@/shared/services/axios";
import { showError } from "@/shared/utils/toast";

/* ───────────────── CONFIG ───────────────── */

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

/* ───────────────── BADGES ───────────────── */

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

/* ───────────────── PAGE ───────────────── */

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
            {/* PAGE */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                {/* HEADER */}
                <div className="mb-8">
                    <div
                        className="
                            flex flex-col lg:flex-row
                            lg:items-start
                            lg:justify-between

                            gap-5
                        "
                    >
                        <div>
                            <h1
                                className="
                                    text-3xl
                                    font-black
                                    tracking-tight
                                    text-zinc-900
                                "
                            >
                                All Orders
                            </h1>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-zinc-500
                                "
                            >
                                Track and manage all your auction orders.
                            </p>
                        </div>

                        <button
                            className="
                                inline-flex items-center
                                justify-center gap-2

                                h-11 px-5

                                rounded-xl

                                bg-blue-600
                                hover:bg-blue-700

                                text-sm font-semibold
                                text-white

                                shadow-sm

                                transition-all
                            "
                        >
                            <Download size={16} />
                            Export Orders
                        </button>
                    </div>

                    {/* TABS */}
                    <div
                        className="
                            mt-6

                            flex flex-wrap
                            gap-3
                        "
                    >
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`
                                    inline-flex items-center
                                    gap-2

                                    rounded-xl

                                    px-4 py-2.5

                                    text-sm font-medium

                                    transition-all

                                    ${
                                        activeTab === tab.key
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "border border-zinc-200 bg-white/80 backdrop-blur-sm text-zinc-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                                    }
                                `}
                            >
                                {tab.label}

                                <span
                                    className={`
                                        rounded-full

                                        px-2 py-0.5

                                        text-[11px]
                                        font-semibold

                                        ${
                                            activeTab === tab.key
                                                ? "bg-white/20 text-white"
                                                : "bg-zinc-100 text-zinc-600"
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
                <div
                    className="
                        mb-5

                        flex flex-col
                        sm:flex-row

                        gap-3
                    "
                >
                    <label
                        className="
                            flex h-11 flex-1
                            items-center gap-3

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

                            px-5

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

/* ───────────────── ORDER ROW ───────────────── */

function OrderRow({ order, isLast, navigate }) {
    const auction = order?.auctionId;

    const image = auction?.media?.[0]?.[0] ?? auction?.media?.[0] ?? "/placeholder.png";

    const downloadReceipt = (e) => {
        e.stopPropagation();

        const doc = new jsPDF();

        const auction = order?.auctionId;
        const buyer = order?.buyerId;
        const seller = order?.sellerId;

        const amount = new Intl.NumberFormat("en-IN", {
            maximumFractionDigits: 0,
        }).format(Number(order?.finalPrice || 0));

        const pageWidth = doc.internal.pageSize.width;

        /* ───────────────── COLORS ───────────────── */

        const BLACK = [20, 20, 20];
        const GRAY = [120, 120, 120];
        const LIGHT = [240, 240, 240];
        const BLUE = [37, 99, 235];

        /* ───────────────── HEADER ───────────────── */

        doc.setFont("times", "bold");

        doc.setTextColor(...BLACK);

        doc.setFontSize(24);

        doc.text("Auctify", 16, 22);

        doc.setFontSize(11);

        doc.setFont("helvetica", "normal");

        doc.setTextColor(...GRAY);

        doc.text("Official Payment Receipt", 16, 30);

        /* RIGHT */

        doc.setFont("times", "bold");

        doc.setTextColor(...BLACK);

        doc.setFontSize(18);

        doc.text("INVOICE", pageWidth - 16, 22, {
            align: "right",
        });

        doc.setFontSize(10);

        doc.setFont("helvetica", "normal");

        doc.setTextColor(...GRAY);

        doc.text(`#${order?._id?.slice(-8)}`, pageWidth - 16, 30, {
            align: "right",
        });

        /* LINE */

        doc.setDrawColor(...LIGHT);

        doc.line(16, 38, 194, 38);

        /* ───────────────── META ───────────────── */

        doc.setTextColor(...BLACK);

        doc.setFont("times", "bold");

        doc.setFontSize(11);

        doc.text("Date", 16, 50);

        doc.setFont("helvetica", "normal");

        doc.text(new Date(order?.createdAt).toLocaleDateString(), 40, 50);

        doc.setFont("times", "bold");

        doc.text("Payment", 110, 50);

        doc.setFont("helvetica", "normal");

        doc.text(order?.paymentStatus || "completed", 140, 50);

        /* ───────────────── BILLING ───────────────── */

        doc.setFont("times", "bold");

        doc.setTextColor(...BLACK);

        doc.setFontSize(12);

        doc.text("Buyer Information", 16, 68);

        doc.text("Seller Information", 110, 68);

        doc.setFont("helvetica", "normal");

        doc.setFontSize(10);

        doc.setTextColor(...GRAY);

        /* BUYER */

        doc.text(`${buyer?.firstName || ""} ${buyer?.lastName || ""}`, 16, 78);

        doc.text(buyer?.email || "", 16, 86);

        doc.text(buyer?.address?.city || "", 16, 94);

        /* SELLER */

        doc.text(seller?.firstName || "", 110, 78);

        doc.text(seller?.email || "", 110, 86);

        /* ───────────────── TABLE HEADER ───────────────── */

        doc.setFillColor(...BLACK);

        doc.rect(16, 112, 178, 10, "F");

        doc.setTextColor(255);

        doc.setFont("times", "bold");

        doc.setFontSize(10);

        doc.text("Product", 20, 119);

        doc.text("Category", 95, 119);

        doc.text("Status", 140, 119);

        doc.text("Amount", 182, 119, {
            align: "right",
        });

        /* ───────────────── TABLE ROW ───────────────── */

        doc.setDrawColor(...LIGHT);

        doc.rect(16, 122, 178, 20);

        doc.setTextColor(...BLACK);

        doc.setFont("times", "bold");

        doc.text(auction?.name || "Auction Product", 20, 132);

        doc.setFont("helvetica", "normal");

        doc.setTextColor(...GRAY);

        const category =
            typeof auction?.category === "object" ? auction?.category?.name : auction?.category;

        doc.text(category || "General", 95, 132);

        doc.text(order?.orderStatus || "Delivered", 140, 132);

        doc.setTextColor(...BLACK);

        doc.setFont("times", "bold");

        doc.text(`Rs. ${amount}`, 182, 132, {
            align: "right",
        });

        /* ───────────────── TOTALS ───────────────── */

        let y = 162;

        doc.setFont("helvetica", "normal");

        doc.setTextColor(...GRAY);

        doc.text("Subtotal", 130, y);

        doc.text(`Rs. ${amount}`, 182, y, {
            align: "right",
        });

        y += 10;

        doc.text("Platform Fee", 130, y);

        doc.text("Rs. 0", 182, y, {
            align: "right",
        });

        y += 10;

        doc.setDrawColor(...LIGHT);

        doc.line(130, y, 182, y);

        y += 10;

        doc.setFont("times", "bold");

        doc.setTextColor(...BLACK);

        doc.setFontSize(13);

        doc.text("Total", 130, y);

        doc.setTextColor(...BLUE);

        doc.text(`Rs. ${amount}`, 182, y, {
            align: "right",
        });

        /* ───────────────── FOOTER ───────────────── */

        doc.setFontSize(9);

        doc.setFont("helvetica", "normal");

        doc.setTextColor(...GRAY);

        doc.text("This receipt confirms successful payment for your auction order.", 16, 260);

        doc.text("Generated securely by Auctify.", 16, 268);

        /* ───────────────── SAVE ───────────────── */

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
                hover:shadow-[0_4px_20px_rgba(0,0,0,0.03)]

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

                            shadow-sm

                            shrink-0
                        "
                    >
                        <img
                            src={image}
                            alt={auction?.name}
                            className="
                                h-full w-full
                                object-cover

                                transition duration-500
                                group-hover:scale-105
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

                        <div className="mt-2 flex items-center gap-2">
                            <span
                                className="
                                    rounded-full

                                    bg-blue-50

                                    px-2 py-1

                                    text-[10px]
                                    font-semibold

                                    text-blue-700
                                "
                            >
                                {typeof auction?.category === "object"
                                    ? auction?.category?.name
                                    : auction?.category}
                            </span>

                            <span className="text-[11px] text-zinc-400">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div>
                    <p className="text-[20px] font-black tracking-tight text-zinc-900">
                        ₹{order?.finalPrice?.toLocaleString("en-IN")}
                    </p>

                    <p className="mt-1 text-[11px] text-zinc-400">Winning bid</p>
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

                            bg-gradient-to-r
                            from-blue-600
                            to-blue-500

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

                            bg-white/80

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
            <div className="lg:hidden p-4">
                <div
                    className="
                        rounded-2xl
                        border border-zinc-200

                        bg-white

                        shadow-sm

                        p-4
                    "
                >
                    <div className="flex gap-3">
                        <div
                            className="
                                h-[78px]
                                w-[78px]

                                shrink-0

                                overflow-hidden

                                rounded-xl

                                border border-zinc-100
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

                        <div className="min-w-0 flex-1">
                            <p
                                className="
                                    line-clamp-2

                                    text-[15px]
                                    font-bold

                                    leading-snug

                                    text-zinc-900
                                "
                            >
                                {auction?.name}
                            </p>

                            <div className="mt-2 text-[11px] text-zinc-400 space-y-1">
                                <p>
                                    Seller:
                                    {order?.sellerId?.firstName}
                                </p>

                                <p>
                                    Order ID:
                                    {order?._id?.slice(-6)}
                                </p>
                            </div>

                            <p className="mt-3 text-xl font-black tracking-tight text-zinc-900">
                                ₹{order?.finalPrice?.toLocaleString("en-IN")}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <PaymentBadge status={order?.paymentStatus} />

                        <OrderBadge status={order?.orderStatus} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();

                                navigate(`/orders/${order?._id}`);
                            }}
                            className="
                                h-10

                                rounded-xl

                                bg-gradient-to-r
                                from-blue-600
                                to-blue-500

                                text-sm
                                font-semibold
                                text-white
                            "
                        >
                            View
                        </button>

                        <button
                            onClick={downloadReceipt}
                            className="
                                h-10

                                rounded-xl

                                border border-zinc-200

                                bg-white

                                text-sm
                                font-semibold

                                text-zinc-700
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
