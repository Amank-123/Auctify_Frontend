import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";

import {
    Package,
    Loader2,
    Truck,
    CheckCircle2,
    Clock3,
    XCircle,
    Search,
    Receipt,
    ChevronRight,
} from "lucide-react";

import { api } from "@/shared/services/axios";
import { showError } from "@/shared/utils/toast";

const PAYMENT_CFG = {
    pending: {
        label: "Pending",
        classes: "bg-amber-50 text-amber-700 border border-amber-100",
        dot: "bg-amber-400",
    },
    completed: {
        label: "Paid",
        classes: "bg-emerald-50 text-emerald-700 border border-emerald-100",
        dot: "bg-emerald-400",
    },
    refunded: {
        label: "Refunded",
        classes: "bg-violet-50 text-violet-700 border border-violet-100",
        dot: "bg-violet-400",
    },
    failed: {
        label: "Failed",
        classes: "bg-red-50 text-red-700 border border-red-100",
        dot: "bg-red-400",
    },
};

const ORDER_CFG = {
    processing: {
        label: "Processing",
        classes: "bg-sky-50 text-sky-700 border border-sky-100",
        Icon: Clock3,
    },
    shipped: {
        label: "Shipped",
        classes: "bg-violet-50 text-violet-700 border border-violet-100",
        Icon: Truck,
    },
    delivered: {
        label: "Delivered",
        classes: "bg-emerald-50 text-emerald-700 border border-emerald-100",
        Icon: CheckCircle2,
    },
    cancelled: {
        label: "Cancelled",
        classes: "bg-red-50 text-red-700 border border-red-100",
        Icon: XCircle,
    },
    pending: {
        label: "Pending",
        classes: "bg-amber-50 text-amber-700 border border-amber-100",
        Icon: Clock3,
    },
};

function PaymentBadge({ status }) {
    const c = PAYMENT_CFG[status] ?? PAYMENT_CFG.pending;
    return (
        <div
            className={`
                inline-flex items-center gap-1.5
                rounded-full
                px-2.5 py-1
                text-[11px] font-medium
                ${c.classes}
            `}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </div>
    );
}

function OrderBadge({ status }) {
    const c = ORDER_CFG[status] ?? ORDER_CFG.pending;
    const { Icon } = c;
    return (
        <div
            className={`
                inline-flex items-center gap-1.5
                rounded-full
                px-2.5 py-1
                text-[11px] font-medium
                ${c.classes}
            `}
        >
            <Icon size={11} />
            {c.label}
        </div>
    );
}

export default function MyOrdersPage() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

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
            const matchStatus = statusFilter === "all" ? true : o?.orderStatus === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [orders, search, statusFilter]);

    return (
        <div className="min-h-screen bg-[#f5f7fb]">
            <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900 sm:text-4xl">
                        My Orders
                    </h1>
                    <p className="mt-1 text-sm text-zinc-500">Track and manage your purchases</p>
                </div>

                {/* STATS */}
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <StatCard title="Orders" value={orders.length} />
                    <StatCard
                        title="Delivered"
                        value={orders.filter((o) => o.orderStatus === "delivered").length}
                    />
                    <StatCard
                        title="Shipped"
                        value={orders.filter((o) => o.orderStatus === "shipped").length}
                    />
                    <StatCard
                        title="Pending"
                        value={orders.filter((o) => o.orderStatus === "processing").length}
                    />
                </div>

                {/* SEARCH + FILTER */}
                <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm sm:flex-row">
                    {/* SEARCH */}
                    <div className="flex h-11 flex-1 items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50 px-4 transition-colors focus-within:border-zinc-300 focus-within:bg-white">
                        <Search className="h-4 w-4 shrink-0 text-zinc-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search orders..."
                            className="flex-1 bg-transparent text-sm text-zinc-800 placeholder-zinc-400 outline-none"
                        />
                    </div>

                    {/* FILTER */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="h-11 rounded-xl border border-zinc-100 bg-zinc-50 px-4 text-sm font-medium text-zinc-700 outline-none transition-colors hover:border-zinc-300 hover:bg-white sm:w-44"
                    >
                        <option value="all">All Orders</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>

                {/* CONTENT */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-zinc-300 bg-white py-16 text-center">
                        <Package className="mx-auto mb-3 h-10 w-10 text-zinc-300" />
                        <p className="text-sm text-zinc-400">No orders found</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <AnimatePresence>
                            {filtered.map((order) => (
                                <OrderCard key={order?._id} order={order} navigate={navigate} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-zinc-400">{title}</p>
            <h3 className="mt-1.5 text-2xl font-black tracking-tight text-zinc-900">{value}</h3>
        </div>
    );
}

function OrderCard({ order, navigate }) {
    const auction = order?.auctionId;
    const image = auction?.media?.[0]?.[0] ?? auction?.media?.[0] ?? "/placeholder.png";

    const downloadReceipt = (e) => {
        e.stopPropagation();

        const doc = new jsPDF({
            unit: "pt",
            format: "a4",
        });

        const auction = order?.auctionId;

        const pageWidth = doc.internal.pageSize.getWidth();

        const primary = "#2563eb";
        const dark = "#18181b";
        const gray = "#71717a";
        const light = "#f8fafc";
        const border = "#e4e4e7";

        // FORMAT CURRENCY
        const formatCurrency = (amount) => {
            return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
        };

        // PAGE BACKGROUND
        doc.setFillColor(255, 255, 255);

        doc.rect(0, 0, pageWidth, 842, "F");

        // HEADER
        doc.setFillColor(37, 99, 235);

        doc.rect(0, 0, pageWidth, 72, "F");

        // BRAND
        doc.setTextColor(255, 255, 255);

        doc.setFont("helvetica", "bold");

        doc.setFontSize(24);

        doc.text("Auctify", 40, 45);

        doc.setFont("helvetica", "normal");

        doc.setFontSize(11);

        doc.text("Order Invoice", 40, 62);

        // TITLE
        doc.setTextColor(dark);

        doc.setFont("helvetica", "bold");

        doc.setFontSize(24);

        doc.text("INVOICE", 40, 125);

        // META SECTION
        const metaY = 165;

        doc.setFontSize(10);

        doc.setTextColor(gray);

        doc.setFont("helvetica", "bold");

        doc.text("Invoice ID", 40, metaY);

        doc.text("Date", 290, metaY);

        doc.text("Status", 430, metaY);

        // VALUES
        doc.setTextColor(dark);

        doc.setFont("helvetica", "normal");

        doc.text(`INV-${order?._id?.slice(-6)}`, 40, metaY + 24);

        doc.text(new Date().toLocaleDateString(), 290, metaY + 24);

        doc.text(order?.paymentStatus || "pending", 430, metaY + 24);

        // DIVIDER
        doc.setDrawColor(border);

        doc.line(40, 215, 555, 215);

        // ORDER DETAILS
        doc.setFont("helvetica", "bold");

        doc.setFontSize(16);

        doc.setTextColor(dark);

        doc.text("Order Details", 40, 255);

        // DETAILS CARD
        doc.setFillColor(248, 250, 252);

        doc.roundedRect(40, 275, 515, 120, 10, 10, "F");

        const leftX = 60;

        const rightX = 310;

        // LABELS
        doc.setFontSize(10);

        doc.setTextColor(gray);

        doc.setFont("helvetica", "bold");

        doc.text("Product", leftX, 310);

        doc.text("Seller", leftX, 350);

        doc.text("Order Status", rightX, 310);

        doc.text("Payment Status", rightX, 350);

        // VALUES
        doc.setTextColor(dark);

        doc.setFont("helvetica", "normal");

        doc.setFontSize(11);

        doc.text(auction?.name || "Auction Product", leftX, 330);

        doc.text(order?.sellerId?.firstName || "Unknown", leftX, 370);

        doc.text(order?.orderStatus || "processing", rightX, 330);

        doc.text(order?.paymentStatus || "completed", rightX, 370);

        // PAYMENT SUMMARY
        doc.setFont("helvetica", "bold");

        doc.setFontSize(16);

        doc.text("Payment Summary", 40, 455);

        // TABLE WRAPPER
        doc.setDrawColor(229, 231, 235);

        doc.roundedRect(40, 480, 515, 120, 8, 8);

        // TABLE HEADER
        doc.setFillColor(248, 250, 252);

        doc.roundedRect(40, 480, 515, 36, 8, 8, "F");

        doc.setFontSize(11);

        doc.setTextColor(gray);

        doc.setFont("helvetica", "bold");

        doc.text("Description", 60, 503);

        doc.text("Amount", 500, 503, {
            align: "right",
        });

        // HEADER DIVIDER
        doc.line(40, 516, 555, 516);

        // ITEM ROW
        doc.setTextColor(dark);

        doc.setFont("helvetica", "normal");

        doc.text(auction?.name || "Auction Product", 60, 550);

        // IMPORTANT FONT FIX
        doc.setFont("courier", "bold");

        doc.text(formatCurrency(order?.finalPrice), 500, 550, {
            align: "right",
        });

        // TOTAL DIVIDER
        doc.line(40, 575, 555, 575);

        // TOTAL LABEL
        doc.setFont("helvetica", "bold");

        doc.setFontSize(13);

        doc.setTextColor(dark);

        doc.text("Total", 400, 610);

        // TOTAL AMOUNT
        doc.setFont("courier", "bold");

        doc.setFontSize(24);

        doc.setTextColor(primary);

        doc.text(formatCurrency(order?.finalPrice), 555, 612, {
            align: "right",
        });

        // FOOTER
        doc.setFont("helvetica", "normal");

        doc.setFontSize(10);

        doc.setTextColor(gray);

        doc.text("Thank you for choosing Auctify.", 40, 770);

        doc.text("This is a digitally generated invoice.", 40, 788);

        // SAVE
        doc.save(`Invoice-${order?._id?.slice(-6)}.pdf`);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            whileHover={{ y: -2 }}
            transition={{ duration: 0.2 }}
            onClick={() => navigate(`/orders/${order?._id}`)}
            className="cursor-pointer rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
        >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                {/* LEFT — image + info */}
                <div className="flex min-w-0 flex-1 gap-4">
                    {/* IMAGE */}
                    <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:h-20 sm:w-20">
                        <img
                            src={image}
                            alt={auction?.name}
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* INFO */}
                    <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <h2 className="truncate text-base font-bold tracking-tight text-zinc-900 sm:text-lg">
                                    {auction?.name}
                                </h2>
                                <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-zinc-400">
                                    <span>Order #{order?._id?.slice(-6)}</span>
                                    <span>·</span>
                                    <span>{order?.sellerId?.firstName}</span>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1.5">
                                    <PaymentBadge status={order?.paymentStatus} />
                                    <OrderBadge status={order?.orderStatus} />
                                </div>
                            </div>
                            <ChevronRight className="hidden h-4 w-4 shrink-0 text-zinc-300 sm:block" />
                        </div>
                    </div>
                </div>

                {/* RIGHT — price + actions */}
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    {/* PRICE */}
                    <div className="sm:text-right">
                        <p className="text-xl font-black tracking-tight text-zinc-900 sm:text-2xl">
                            ₹{order?.finalPrice?.toLocaleString("en-IN")}
                        </p>
                        <p className="text-[11px] text-zinc-400">Winning Bid</p>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/orders/${order?._id}`);
                            }}
                            className="h-9 rounded-xl bg-blue-600 px-4 text-xs font-semibold text-white transition-colors hover:bg-blue-700 active:scale-[0.98]"
                        >
                            View
                        </button>
                        <button
                            onClick={downloadReceipt}
                            title="Download receipt"
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-50 hover:text-zinc-700"
                        >
                            <Receipt className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
