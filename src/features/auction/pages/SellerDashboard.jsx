import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Package, Search, CheckCircle2, ShieldCheck } from "lucide-react";

import { showError, showSuccess } from "@/shared/utils/toast.js";
import { api } from "@/shared/services/axios";

import { C } from "../constants/dashboardColors";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";

const FILTERS = [
    { key: "all", label: "All" },
    { key: "confirmed", label: "Confirmed" },
    { key: "delivered", label: "Delivered" },
];

export default function SellerDashboard() {
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);

    const [filter, setFilter] = useState("all");

    const [search, setSearch] = useState("");

    const [otpModal, setOtpModal] = useState(null);

    const [otp, setOtp] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);

            const { data } = await api.get("/api/order/seller");

            setOrders(data.data);
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to load seller orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const sendOTP = async (id) => {
        try {
            await api.patch(`/api/order/send-otp/${id}`);

            showSuccess("OTP sent successfully");

            fetchOrders();
        } catch (err) {
            showError(err?.response?.data?.message || "Failed to send OTP");
        }
    };

    const verifyOTP = async () => {
        try {
            await api.patch(`/api/order/verify-otp/${otpModal}`, {
                otp,
            });

            showSuccess("Order delivered successfully");

            setOtpModal(null);

            setOtp("");

            fetchOrders();
        } catch (err) {
            showError(err?.response?.data?.message || "Invalid OTP");
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
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

                * {
                    font-family: 'DM Sans', sans-serif;
                    box-sizing: border-box;
                }

                h1,h2,h3 {
                    font-family: 'Syne', sans-serif;
                }

                ::-webkit-scrollbar {
                    width: 4px;
                }

                ::-webkit-scrollbar-thumb {
                    background: ${C.slate200};
                    border-radius: 9999px;
                }
            `}</style>

            <div
                style={{
                    minHeight: "100vh",

                    background: C.slate50,

                    display: "flex",
                }}
            >
                <DashboardSidebar />

                <main
                    style={{
                        flex: 1,

                        marginLeft: 200,

                        minHeight: "100vh",
                    }}
                >
                    <div
                        style={{
                            maxWidth: 1100,

                            margin: "0 auto",

                            padding: "32px",
                        }}
                    >
                        {/* HEADER */}

                        <div
                            style={{
                                display: "flex",

                                justifyContent: "space-between",

                                alignItems: "center",

                                marginBottom: 24,
                            }}
                        >
                            <div>
                                <h1
                                    style={{
                                        fontSize: 30,

                                        fontWeight: 800,

                                        color: C.slate900,
                                    }}
                                >
                                    Seller Orders
                                </h1>

                                <p
                                    style={{
                                        marginTop: 6,

                                        fontSize: 13,

                                        color: C.slate400,
                                    }}
                                >
                                    Manage payments and delivery verification
                                </p>
                            </div>

                            <Link
                                to="/auction/create"
                                style={{
                                    display: "flex",

                                    alignItems: "center",

                                    gap: 6,

                                    padding: "10px 18px",

                                    borderRadius: 10,

                                    fontWeight: 700,

                                    fontSize: 13,

                                    color: C.white,

                                    textDecoration: "none",

                                    background: C.blue,
                                }}
                            >
                                + Create Auction
                            </Link>
                        </div>

                        {/* STATS */}

                        <div
                            style={{
                                display: "grid",

                                gridTemplateColumns: "repeat(3,1fr)",

                                gap: 14,

                                marginBottom: 24,
                            }}
                        >
                            {[
                                {
                                    label: "Total Orders",

                                    value: stats.total,
                                },

                                {
                                    label: "Confirmed",

                                    value: stats.confirmed,
                                },

                                {
                                    label: "Delivered",

                                    value: stats.delivered,
                                },
                            ].map((s) => (
                                <div
                                    key={s.label}
                                    style={{
                                        background: C.white,

                                        border: `1px solid ${C.slate200}`,

                                        borderRadius: 14,

                                        padding: 20,
                                    }}
                                >
                                    <p
                                        style={{
                                            fontSize: 12,

                                            color: C.slate400,
                                        }}
                                    >
                                        {s.label}
                                    </p>

                                    <h2
                                        style={{
                                            marginTop: 8,

                                            fontSize: 28,

                                            fontWeight: 800,

                                            color: C.slate900,
                                        }}
                                    >
                                        {s.value}
                                    </h2>
                                </div>
                            ))}
                        </div>

                        {/* SEARCH */}

                        <div
                            style={{
                                display: "flex",

                                gap: 12,

                                marginBottom: 20,
                            }}
                        >
                            <div
                                style={{
                                    position: "relative",

                                    flex: 1,
                                }}
                            >
                                <Search
                                    size={15}
                                    style={{
                                        position: "absolute",

                                        top: "50%",

                                        left: 12,

                                        transform: "translateY(-50%)",

                                        color: C.slate300,
                                    }}
                                />

                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        width: "100%",

                                        padding: "11px 14px 11px 38px",

                                        borderRadius: 12,

                                        border: `1px solid ${C.slate200}`,

                                        background: C.white,

                                        outline: "none",

                                        fontSize: 13,
                                    }}
                                />
                            </div>

                            <div
                                style={{
                                    display: "flex",

                                    gap: 6,

                                    background: C.white,

                                    border: `1px solid ${C.slate200}`,

                                    padding: 5,

                                    borderRadius: 12,
                                }}
                            >
                                {FILTERS.map((f) => (
                                    <button
                                        key={f.key}
                                        onClick={() => setFilter(f.key)}
                                        style={{
                                            padding: "8px 14px",

                                            borderRadius: 10,

                                            border: "none",

                                            cursor: "pointer",

                                            fontSize: 12,

                                            fontWeight: 700,

                                            background: filter === f.key ? C.blue : "transparent",

                                            color: filter === f.key ? C.white : C.slate500,
                                        }}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* LIST */}

                        {loading ? (
                            <div
                                style={{
                                    textAlign: "center",

                                    padding: "80px 0",
                                }}
                            >
                                Loading...
                            </div>
                        ) : filtered.length === 0 ? (
                            <div
                                style={{
                                    background: C.white,

                                    border: `1px solid ${C.slate200}`,

                                    borderRadius: 16,

                                    padding: "80px 0",

                                    textAlign: "center",
                                }}
                            >
                                <Package size={38} color={C.slate300} />

                                <h2
                                    style={{
                                        marginTop: 16,

                                        fontSize: 18,

                                        fontWeight: 700,
                                    }}
                                >
                                    No Orders
                                </h2>
                            </div>
                        ) : (
                            <AnimatePresence>
                                <div
                                    style={{
                                        display: "flex",

                                        flexDirection: "column",

                                        gap: 14,
                                    }}
                                >
                                    {filtered.map((order) => (
                                        <motion.div
                                            key={order._id}
                                            initial={{
                                                opacity: 0,

                                                y: 10,
                                            }}
                                            animate={{
                                                opacity: 1,

                                                y: 0,
                                            }}
                                            style={{
                                                background: C.white,

                                                border: `1px solid ${C.slate200}`,

                                                borderRadius: 16,

                                                padding: 18,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",

                                                    gap: 18,

                                                    alignItems: "center",
                                                }}
                                            >
                                                <img
                                                    src={order?.auctionId?.media?.[0]}
                                                    alt=""
                                                    style={{
                                                        width: 90,

                                                        height: 90,

                                                        borderRadius: 14,

                                                        objectFit: "cover",
                                                    }}
                                                />

                                                <div
                                                    style={{
                                                        flex: 1,
                                                    }}
                                                >
                                                    <h2
                                                        style={{
                                                            fontSize: 20,

                                                            fontWeight: 700,

                                                            color: C.slate900,
                                                        }}
                                                    >
                                                        {order?.auctionId?.name}
                                                    </h2>

                                                    <p
                                                        style={{
                                                            marginTop: 6,

                                                            fontSize: 13,

                                                            color: C.slate500,
                                                        }}
                                                    >
                                                        Buyer: {order?.buyerId?.firstName}{" "}
                                                        {order?.buyerId?.lastName}
                                                    </p>

                                                    <p
                                                        style={{
                                                            marginTop: 4,

                                                            fontSize: 13,

                                                            color: C.slate500,
                                                        }}
                                                    >
                                                        Payment: {order.paymentStatus}
                                                    </p>

                                                    <p
                                                        style={{
                                                            marginTop: 4,

                                                            fontSize: 13,

                                                            color: C.slate500,
                                                        }}
                                                    >
                                                        Status: {order.orderStatus}
                                                    </p>
                                                </div>

                                                <div
                                                    style={{
                                                        display: "flex",

                                                        flexDirection: "column",

                                                        gap: 10,
                                                    }}
                                                >
                                                    {order.paymentStatus === "completed" &&
                                                        order.orderStatus !== "delivered" && (
                                                            <button
                                                                onClick={() => sendOTP(order._id)}
                                                                style={{
                                                                    border: "none",

                                                                    background: C.blue,

                                                                    color: C.white,

                                                                    padding: "11px 18px",

                                                                    borderRadius: 12,

                                                                    fontWeight: 700,

                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Send OTP
                                                            </button>
                                                        )}

                                                    {order.orderStatus !== "delivered" && (
                                                        <button
                                                            onClick={() => setOtpModal(order._id)}
                                                            style={{
                                                                border: "none",

                                                                background: "#16a34a",

                                                                color: "white",

                                                                padding: "11px 18px",

                                                                borderRadius: 12,

                                                                fontWeight: 700,

                                                                cursor: "pointer",
                                                            }}
                                                        >
                                                            Verify OTP
                                                        </button>
                                                    )}

                                                    {order.orderStatus === "delivered" && (
                                                        <div
                                                            style={{
                                                                display: "flex",

                                                                alignItems: "center",

                                                                gap: 6,

                                                                background: "#dcfce7",

                                                                color: "#166534",

                                                                padding: "10px 14px",

                                                                borderRadius: 12,

                                                                fontSize: 12,

                                                                fontWeight: 700,
                                                            }}
                                                        >
                                                            <CheckCircle2 size={15} />
                                                            Delivered
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </AnimatePresence>
                        )}
                    </div>
                </main>
            </div>

            {/* OTP MODAL */}

            {otpModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-md rounded-2xl bg-white p-6">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-green-600" />

                            <h2 className="text-xl font-bold">Verify OTP</h2>
                        </div>

                        <input
                            type="text"
                            placeholder="Enter delivery OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="mt-5 w-full rounded-xl border p-3 outline-none"
                        />

                        <div className="mt-5 flex gap-3">
                            <button
                                onClick={verifyOTP}
                                className="flex-1 rounded-xl bg-black px-4 py-3 font-semibold text-white"
                            >
                                Verify
                            </button>

                            <button
                                onClick={() => {
                                    setOtpModal(null);

                                    setOtp("");
                                }}
                                className="flex-1 rounded-xl border px-4 py-3 font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
