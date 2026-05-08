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

const PAYMENT_CFG = {
    pending: {
        label: "Pending",
        classes: "bg-yellow-50 border-yellow-200 text-yellow-700",
    },
    completed: {
        label: "Paid",
        classes: "bg-green-50 border-green-200 text-green-700",
    },
    failed: {
        label: "Failed",
        classes: "bg-red-50 border-red-200 text-red-700",
    },
    refunded: {
        label: "Refunded",
        classes: "bg-purple-50 border-purple-200 text-purple-700",
    },
    cancelled: {
        label: "Cancelled",
        classes: "bg-gray-50 border-gray-200 text-gray-600",
    },
};

const ORDER_CFG = {
    awaiting_payment: {
        label: "Awaiting payment",
        classes: "bg-yellow-50 border-yellow-200 text-yellow-700",
        icon: Clock3,
    },
    pending: {
        label: "Pending",
        classes: "bg-yellow-50 border-yellow-200 text-yellow-700",
        icon: Clock3,
    },
    confirmed: {
        label: "Confirmed",
        classes: "bg-blue-50 border-blue-200 text-blue-700",
        icon: CheckCircle2,
    },
    processing: {
        label: "Processing",
        classes: "bg-sky-50 border-sky-200 text-sky-700",
        icon: Clock3,
    },
    shipped: {
        label: "Shipped",
        classes: "bg-purple-50 border-purple-200 text-purple-700",
        icon: Truck,
    },
    delivered: {
        label: "Delivered",
        classes: "bg-green-50 border-green-200 text-green-700",
        icon: CheckCircle2,
    },
    cancelled: {
        label: "Cancelled",
        classes: "bg-red-50 border-red-200 text-red-700",
        icon: XCircle,
    },
};

function PaymentTag({ status }) {
    const c = PAYMENT_CFG[status] || PAYMENT_CFG.pending;

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold ${c.classes}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {c.label}
        </span>
    );
}

function OrderTag({ status }) {
    const c = ORDER_CFG[status] || ORDER_CFG.pending;
    const Icon = c.icon;

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-semibold ${c.classes}`}
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

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!orders.length) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white shadow-sm">
                        <Package className="h-5 w-5 text-gray-400" />
                    </div>

                    <p className="text-sm font-semibold text-gray-900">No orders yet</p>

                    <p className="mt-1 text-sm text-gray-500">You haven't placed any orders.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* TOPBAR */}

            <div className="sticky top-0 z-20 flex h-14 items-center border-b border-gray-200 bg-white px-6">
                <h1 className="text-sm font-bold text-gray-900">Orders</h1>

                <span className="ml-2 rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600">
                    {orders.length}
                </span>
            </div>

            {/* BODY */}

            <div className="mx-auto w-full max-w-6xl p-6">
                {/* SEARCH */}

                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 shadow-sm">
                        <Search className="h-4 w-4 text-gray-400" />

                        <input
                            placeholder="Search orders..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                        />
                    </div>

                    <button className="flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50">
                        <SlidersHorizontal className="h-4 w-4 text-gray-400" />
                        Filter
                    </button>
                </div>

                {/* TABLE */}

                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    {/* HEADER */}

                    <div className="grid grid-cols-[2.2fr_1fr_1fr_1fr_40px] items-center border-b border-gray-200 bg-gray-50 px-5 py-3">
                        {["Item", "Amount", "Payment", "Status", ""].map((h) => (
                            <span
                                key={h}
                                className="text-[11px] font-semibold uppercase tracking-wider text-gray-400"
                            >
                                {h}
                            </span>
                        ))}
                    </div>

                    {/* ROWS */}

                    {filtered.length === 0 ? (
                        <div className="p-10 text-center text-sm text-gray-400">
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
                                    onClick={() => navigate(`/orders/${order?._id}`)}
                                    className={`grid cursor-pointer grid-cols-[2.2fr_1fr_1fr_1fr_40px] items-center px-5 py-4 transition hover:bg-gray-50 ${
                                        !isLast ? "border-b border-gray-100" : ""
                                    }`}
                                >
                                    {/* ITEM */}

                                    <div className="flex min-w-0 items-center gap-3 pr-4">
                                        <div className="h-10 w-10 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                                            <img
                                                src={image}
                                                alt={auction?.name}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-gray-900">
                                                {auction?.name}
                                            </p>

                                            <div className="mt-1 flex items-center gap-1.5">
                                                {order?.sellerId?.profile && (
                                                    <img
                                                        src={order.sellerId.profile}
                                                        className="h-3.5 w-3.5 rounded-full border border-gray-200 object-cover"
                                                    />
                                                )}

                                                <span className="text-xs text-gray-400">
                                                    {order?.sellerId?.firstName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* AMOUNT */}

                                    <div>
                                        <p className="text-sm font-bold text-gray-900">
                                            ₹{order?.finalPrice?.toLocaleString("en-IN")}
                                        </p>

                                        <p className="mt-0.5 text-[11px] text-gray-400">
                                            Winning bid
                                        </p>
                                    </div>

                                    {/* PAYMENT */}

                                    <div>
                                        <PaymentTag status={order?.paymentStatus} />
                                    </div>

                                    {/* STATUS */}

                                    <div>
                                        <OrderTag status={order?.orderStatus} />
                                    </div>

                                    {/* CHEVRON */}

                                    <div className="flex justify-end">
                                        <ChevronRight className="h-4 w-4 text-gray-300" />
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <p className="mt-3 pl-1 text-xs text-gray-400">
                    Showing {filtered.length} of {orders.length} orders
                </p>
            </div>
        </div>
    );
}
