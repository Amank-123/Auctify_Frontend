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
import { myOrders } from "../orderAPI";

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
            const data = await myOrders();
            setOrders(data || []);
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
            orientation: "portrait",
            unit: "pt",
            format: "a4",
        });

        // =========================
        // DATA
        // =========================
        const auction = order?.auctionId;
        const buyer = order?.buyerId;
        const shipping = buyer?.address || {};

        // =========================
        // COLORS
        // =========================
        const C = {
            primary: [30, 64, 175], // indigo-800
            accent: [99, 102, 241], // indigo-500
            dark: [15, 23, 42], // slate-900
            bodyText: [51, 65, 85], // slate-700
            muted: [100, 116, 139], // slate-500
            border: [226, 232, 240], // slate-200
            surface: [248, 250, 252], // slate-50
            white: [255, 255, 255],
            successBg: [220, 252, 231],
            successFg: [22, 163, 74],
            amberBg: [254, 243, 199],
            amberFg: [146, 64, 14],
        };

        // =========================
        // HELPERS
        // =========================
        const setFill = (rgb) => doc.setFillColor(...rgb);
        const setStroke = (rgb) => doc.setDrawColor(...rgb);
        const setColor = (rgb) => doc.setTextColor(...rgb);

        const formatCurrency = (amount) =>
            `Rs. ${Number(amount || 0).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`;

        const formatAddress = () =>
            [
                shipping?.street,
                [shipping?.city, shipping?.state].filter(Boolean).join(", "),
                [shipping?.country, shipping?.pin].filter(Boolean).join(" "),
            ]
                .filter(Boolean)
                .join("\n");

        // Rounded rect helper (stroke + optional fill)
        const rrect = (x, y, w, h, r, style = "F") => doc.roundedRect(x, y, w, h, r, r, style);

        // Right-aligned text helper
        const textRight = (text, rightEdge, y) => {
            const tw = doc.getTextWidth(String(text));
            doc.text(String(text), rightEdge - tw, y);
        };

        // =========================
        // LAYOUT CONSTANTS
        // =========================
        const PW = doc.internal.pageSize.getWidth(); // 595.28
        const PH = doc.internal.pageSize.getHeight(); // 841.89
        const ML = 48; // margin left
        const MR = 48; // margin right
        const CW = PW - ML - MR; // content width  ≈ 499.28
        const RE = ML + CW; // right edge      ≈ 547.28

        // =========================
        // WHITE BACKGROUND
        // =========================
        setFill(C.white);
        doc.rect(0, 0, PW, PH, "F");

        // =========================
        // HEADER BAND
        // =========================
        const HEADER_H = 100;
        setFill(C.primary);
        doc.rect(0, 0, PW, HEADER_H, "F");

        // Subtle accent stripe at top
        setFill(C.accent);
        doc.rect(0, 0, PW, 5, "F");

        // Brand name
        setColor(C.white);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(26);
        doc.text("Auctify", ML, 52);

        // Tagline
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        setColor([180, 198, 252]); // muted-white
        doc.text("Online Auction Platform", ML, 68);

        // "INVOICE" label — right aligned
        setColor(C.white);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(30);
        textRight("INVOICE", RE, 58);

        // Invoice number below — right aligned
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        setColor([180, 198, 252]);
        textRight(`#INV-${order?._id?.slice(-6)?.toUpperCase()}`, RE, 75);

        // =========================
        // META ROW (3 cards)
        // =========================
        const META_Y = 118;
        const META_H = 64;
        const META_GAP = 12;
        const META_W = (CW - META_GAP * 2) / 3;

        const metaCards = [
            {
                icon: "📅",
                label: "Invoice Date",
                value: new Date().toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                }),
            },
            {
                icon: "🔖",
                label: "Order ID",
                value: `#${order?._id?.slice(-8)?.toUpperCase()}`,
            },
            {
                icon: "💳",
                label: "Payment",
                value: order?.paymentStatus || "Completed",
                badge: true,
                badgeBg: C.successBg,
                badgeFg: C.successFg,
            },
        ];

        metaCards.forEach((card, i) => {
            const cx = ML + i * (META_W + META_GAP);

            // Card background
            setFill(C.surface);
            setStroke(C.border);
            rrect(cx, META_Y, META_W, META_H, 8, "FD");

            // Label
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            setColor(C.muted);
            doc.text(card.label.toUpperCase(), cx + 14, META_Y + 20);

            // Value
            if (card.badge) {
                const bw = doc.getTextWidth(card.value) + 20;
                setFill(card.badgeBg);
                rrect(cx + 14, META_Y + 30, bw, 22, 6, "F");
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                setColor(card.badgeFg);
                doc.text(card.value, cx + 24, META_Y + 45);
            } else {
                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                setColor(C.dark);
                doc.text(card.value, cx + 14, META_Y + 48);
            }
        });

        // =========================
        // BILLING SECTION
        // =========================
        const BILL_Y = META_Y + META_H + 24;

        // Bill To — left column
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        setColor(C.muted);
        doc.text("BILL TO", ML, BILL_Y);

        const buyerName =
            [buyer?.firstName, buyer?.lastName].filter(Boolean).join(" ") || "Customer";
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        setColor(C.dark);
        doc.text(buyerName, ML, BILL_Y + 18);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        setColor(C.bodyText);
        const addrLines = formatAddress().split("\n").filter(Boolean);
        addrLines.forEach((line, idx) => {
            doc.text(line, ML, BILL_Y + 34 + idx * 14);
        });

        // Sold By — right column
        const SB_X = ML + CW * 0.55;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        setColor(C.muted);
        doc.text("SOLD BY", SB_X, BILL_Y);

        const sellerName =
            [order?.sellerId?.firstName, order?.sellerId?.lastName].filter(Boolean).join(" ") ||
            "Seller";
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        setColor(C.dark);
        doc.text(sellerName, SB_X, BILL_Y + 18);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        setColor(C.bodyText);
        doc.text("Auctify Verified Seller", SB_X, BILL_Y + 32);

        // Divider
        const DIV_Y = BILL_Y + 62;
        setStroke(C.border);
        doc.setLineWidth(0.5);
        doc.line(ML, DIV_Y, RE, DIV_Y);

        // =========================
        // ITEM TABLE
        // =========================
        const TBL_Y = DIV_Y + 20;
        const COL = {
            desc: ML,
            qty: ML + CW * 0.5,
            unit: ML + CW * 0.63,
            total: RE - 10, // 10pt inset so text never clips at edge
        };

        // Table header background
        setFill(C.primary);
        rrect(ML, TBL_Y, CW, 32, 6, "F");

        // Header labels
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        setColor(C.white);
        doc.text("DESCRIPTION", COL.desc + 10, TBL_Y + 20);
        doc.text("QTY", COL.qty, TBL_Y + 20);
        doc.text("UNIT PRICE", COL.unit, TBL_Y + 20);
        textRight("TOTAL", COL.total, TBL_Y + 20);

        // Item row
        const ROW_Y = TBL_Y + 32;
        const ROW_H = 44;

        // alternating row bg (only one item here, but pattern is ready)
        setFill(C.surface);
        doc.rect(ML, ROW_Y, CW, ROW_H, "F");

        // Row bottom border
        setStroke(C.border);
        doc.setLineWidth(0.5);
        doc.line(ML, ROW_Y + ROW_H, RE, ROW_Y + ROW_H);

        const productName = auction?.name || "Auction Product";
        const finalPrice = order?.finalPrice || 0;

        // Product name — two lines if long
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        setColor(C.dark);
        const nameLines = doc.splitTextToSize(productName, CW * 0.46);
        doc.text(nameLines, COL.desc + 10, ROW_Y + 16);

        // Auction badge below name
        const badgeLabel = "Auction Item";
        setFill(C.amberBg);
        const badgeW = doc.getTextWidth(badgeLabel) + 14;
        rrect(COL.desc + 10, ROW_Y + 26, badgeW, 14, 3, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        setColor(C.amberFg);
        doc.text(badgeLabel, COL.desc + 17, ROW_Y + 36);

        // Qty
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        setColor(C.bodyText);
        doc.text("1", COL.qty, ROW_Y + 26);

        // Unit price
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        setColor(C.bodyText);
        doc.text(formatCurrency(finalPrice), COL.unit, ROW_Y + 26);

        // Total — right aligned
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        setColor(C.dark);
        textRight(formatCurrency(finalPrice), COL.total, ROW_Y + 26);

        // =========================
        // TOTALS BLOCK
        // =========================
        const TOT_Y = ROW_Y + ROW_H + 16;
        const TOT_LW = CW * 0.48; // slightly wider label block
        const TOT_X = RE - TOT_LW - 10; // aligned with COL.total inset
        const TOT_RE = RE - 10; // consistent right edge

        const totals = [
            { label: "Subtotal", value: formatCurrency(finalPrice) },
            { label: "Platform Fee (0%)", value: formatCurrency(0) },
            { label: "Shipping", value: "Not included (seller-managed)" },
        ];

        let ty = TOT_Y;
        totals.forEach((row) => {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.5);
            setColor(C.muted);
            doc.text(row.label, TOT_X, ty);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10.5);
            setColor(C.bodyText);
            textRight(row.value, TOT_RE, ty);

            ty += 18;
        });

        // Grand total separator
        ty += 6;
        setStroke(C.primary);
        doc.setLineWidth(1.2);
        doc.line(TOT_X, ty, TOT_RE, ty);
        ty += 18;

        // Grand total row
        setFill(C.primary);
        rrect(TOT_X - 14, ty - 14, TOT_LW + 24, 30, 6, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        setColor(C.white);
        doc.text("TOTAL AMOUNT", TOT_X - 4, ty + 6);
        textRight(formatCurrency(finalPrice), TOT_RE - 4, ty + 6);

        // =========================
        // ORDER STATUS SECTION
        // =========================
        const STATUS_Y = ty + 40;

        setFill(C.surface);
        setStroke(C.border);
        rrect(ML, STATUS_Y, CW, 54, 8, "FD");

        const statuses = [
            { label: "Order Status", value: order?.orderStatus || "Delivered" },
            { label: "Payment Status", value: order?.paymentStatus || "Completed" },
            { label: "Auction", value: auction?.name || "—" },
        ];

        const statColW = CW / statuses.length;
        statuses.forEach((s, i) => {
            const sx = ML + i * statColW + 18;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(8.5);
            setColor(C.muted);
            doc.text(s.label.toUpperCase(), sx, STATUS_Y + 18);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(11);
            setColor(C.dark);
            doc.text(s.value, sx, STATUS_Y + 36);

            // Vertical divider between columns
            if (i < statuses.length - 1) {
                setStroke(C.border);
                doc.setLineWidth(0.5);
                doc.line(
                    ML + (i + 1) * statColW,
                    STATUS_Y + 10,
                    ML + (i + 1) * statColW,
                    STATUS_Y + 44,
                );
            }
        });

        // =========================
        // NOTES / TERMS
        // =========================
        const NOTE_Y = STATUS_Y + 72;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        setColor(C.muted);
        doc.text("NOTES", ML, NOTE_Y);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        setColor(C.muted);
        doc.text(
            "This is a computer-generated invoice and does not require a signature.\nFor support, visit help.auctify.com or email support@auctify.com.",
            ML,
            NOTE_Y + 14,
            { lineHeightFactor: 1.5 },
        );

        // =========================
        // FOOTER BAND
        // =========================
        const FOOTER_H = 40;
        const FOOTER_Y = PH - FOOTER_H;

        setFill(C.primary);
        doc.rect(0, FOOTER_Y, PW, FOOTER_H, "F");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        setColor([180, 198, 252]);
        doc.text("Thank you for choosing Auctify — where every bid is a win.", ML, FOOTER_Y + 16);
        textRight("auctify.com", RE, FOOTER_Y + 16);

        setColor([100, 120, 200]);
        doc.setFontSize(8);
        doc.text(`Invoice generated on ${new Date().toLocaleString("en-IN")}`, ML, FOOTER_Y + 30);
        textRight(`Page 1 of 1`, RE, FOOTER_Y + 30);

        // =========================
        // SAVE
        // =========================
        doc.save(`Auctify-Invoice-${order?._id?.slice(-6)?.toUpperCase()}.pdf`);
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
