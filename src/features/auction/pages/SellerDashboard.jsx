import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { showError, showSuccess } from "@/shared/utils/toast.js";

import { auctionAPI } from "../auctionAPI.js";
import { C } from "../constants/dashboardColors";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import StatCard from "../components/dashboard/StatCard";
import AuctionRow from "../components/dashboard/AuctionRow";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const CHART_DATA = MONTHS.map((m, i) => ({
    month: m,
    revenue: [40, 55, 45, 60, 52, 48, 70, 125, 62, 80, 90, 110][i],
}));

const FILTERS = [
    { key: "all", label: "All" },
    { key: "active", label: "Live" },
    { key: "draft", label: "Draft" },
    { key: "ended", label: "Ended" },
];

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div
            style={{
                background: C.white,
                border: `1px solid ${C.slate200}`,
                borderRadius: 8,
                padding: "8px 12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
        >
            <p style={{ fontSize: 10, color: C.slate400, marginBottom: 2 }}>Revenue in {label}</p>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.blue }}>
                Rp. {(payload[0].value * 1_000_000).toLocaleString("id-ID")}
            </p>
        </div>
    );
}

const fadeUp = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: delay * 0.1,
            duration: 0.4,
        },
    }),
};
export default function SellerDashboard() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");

    const fetchAuctions = async () => {
        try {
            setLoading(true);
            const data = await auctionAPI.getBySeller(); // already flattened media
            setAuctions(data);
        } catch {
            showError("Failed to load your auctions");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAuctions();
    }, []);

    const handleStart = async (id) => {
        try {
            await auctionAPI.start(id);
            showSuccess("Auction is now live");
            fetchAuctions();
        } catch (err) {
            showError(err.response?.data?.message || "Failed to start auction");
        }
    };

    const handleEnd = async (id) => {
        try {
            await auctionAPI.end(id);
            showSuccess("Auction ended successfully");
            fetchAuctions();
        } catch (err) {
            showError(err.response?.data?.message || "Failed to end auction");
        }
    };

    const filtered = auctions
        .filter((a) => filter === "all" || a.status === filter)
        .filter(
            (a) =>
                a.name.toLowerCase().includes(search.toLowerCase()) ||
                a.description?.toLowerCase().includes(search.toLowerCase()),
        );

    const stats = {
        total: auctions.length,
        live: auctions.filter((a) => a.status === "active").length,
        draft: auctions.filter((a) => a.status === "draft").length,
        ended: auctions.filter((a) => ["ended", "expired"].includes(a.status)).length,
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');
                * { font-family:'DM Sans',sans-serif; box-sizing:border-box; }
                h1,h2,h3 { font-family:'Syne',sans-serif; }
                ::-webkit-scrollbar { width:4px; }
                ::-webkit-scrollbar-thumb { background:${C.slate200}; border-radius:9999px; }
                @keyframes pulse-dot {
                    0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
                    70%  { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
                    100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
                }
                .live-dot { animation: pulse-dot 1.8s ease-out infinite; }
            `}</style>

            <div style={{ minHeight: "100vh", background: C.slate50, display: "flex" }}>
                <DashboardSidebar liveCount={stats.live} />

                <main style={{ flex: 1, marginLeft: 200, minHeight: "100vh" }}>
                    <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 32px" }}>
                        {/* Header */}
                        <div
                            style={{
                                display: "flex",
                                alignItems: "flex-start",
                                justifyContent: "space-between",
                                marginBottom: 24,
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: -14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 120 }}
                            >
                                <h1
                                    style={{
                                        fontSize: 28,
                                        fontWeight: 800,
                                        color: C.slate900,
                                        lineHeight: 1,
                                    }}
                                >
                                    My Auctions
                                </h1>
                                <p style={{ fontSize: 12, color: C.slate400, marginTop: 6 }}>
                                    {new Date().toLocaleDateString("en-IN", {
                                        weekday: "long",
                                        day: "numeric",
                                        month: "long",
                                    })}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                            >
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
                                        boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                                    }}
                                >
                                    <span style={{ fontSize: 16 }}>+</span> Create Auction
                                </Link>
                            </motion.div>
                        </div>

                        {/* Stats */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4,1fr)",
                                gap: 12,
                                marginBottom: 24,
                            }}
                        >
                            <div
                                style={{
                                    gridColumn: "1 / 4",
                                    display: "grid",
                                    gridTemplateColumns: "repeat(4,1fr)",
                                    gap: 12,
                                }}
                            >
                                {[
                                    {
                                        label: "Total Auctions",
                                        value: stats.total,
                                        badge: "38% ▲",
                                        badgeUp: true,
                                    },
                                    {
                                        label: "Live Auctions",
                                        value: stats.live,
                                        badge: "24% ▼",
                                        badgeUp: false,
                                    },
                                    { label: "Total Drafts", value: stats.draft },
                                    { label: "Completed", value: stats.ended },
                                ].map((s, i) => (
                                    <StatCard key={s.label} {...s} delay={0.08 * i + 0.1} />
                                ))}
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, type: "spring" }}
                                style={{
                                    background: C.blue,
                                    borderRadius: 12,
                                    padding: "16px 18px",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: 11,
                                        color: "rgba(255,255,255,0.7)",
                                        marginBottom: 6,
                                    }}
                                >
                                    Overall Revenue
                                </p>
                                <p
                                    style={{
                                        fontSize: 17,
                                        fontWeight: 700,
                                        color: C.white,
                                        fontFamily: "'Syne',sans-serif",
                                    }}
                                >
                                    ₹0
                                </p>
                                <span
                                    style={{
                                        marginTop: 6,
                                        fontSize: 10,
                                        fontWeight: 700,
                                        background: "rgba(255,255,255,0.2)",
                                        color: C.white,
                                        padding: "2px 8px",
                                        borderRadius: 4,
                                        alignSelf: "flex-start",
                                    }}
                                >
                                    Live data
                                </span>
                            </motion.div>
                        </div>

                        {/* Chart */}
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 200px",
                                gap: 12,
                                marginBottom: 24,
                            }}
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                style={{
                                    background: C.white,
                                    border: `1px solid ${C.slate200}`,
                                    borderRadius: 12,
                                    padding: 18,
                                }}
                            >
                                <h2
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: C.slate900,
                                        marginBottom: 14,
                                        fontFamily: "'Syne',sans-serif",
                                    }}
                                >
                                    Sales Analytics
                                </h2>
                                <ResponsiveContainer width="100%" height={160}>
                                    <LineChart
                                        data={CHART_DATA}
                                        margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke={C.slate100} />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 10, fill: C.slate400 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <YAxis
                                            tick={{ fontSize: 10, fill: C.slate400 }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip content={<ChartTooltip />} />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke={C.blue}
                                            strokeWidth={2.5}
                                            dot={false}
                                            activeDot={{
                                                r: 5,
                                                fill: C.blue,
                                                stroke: C.white,
                                                strokeWidth: 2,
                                            }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                style={{
                                    background: C.blue,
                                    borderRadius: 12,
                                    padding: 20,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    textAlign: "center",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: 14,
                                        fontWeight: 700,
                                        color: C.white,
                                        marginBottom: 16,
                                        fontFamily: "'Syne',sans-serif",
                                    }}
                                >
                                    Total Bids
                                </p>
                                <p
                                    style={{
                                        fontSize: 44,
                                        fontWeight: 800,
                                        color: C.white,
                                        lineHeight: 1,
                                        fontFamily: "'Syne',sans-serif",
                                    }}
                                >
                                    {auctions.reduce((sum, a) => sum + (a.bidCount || 0), 0)}
                                </p>
                                <p
                                    style={{
                                        fontSize: 11,
                                        color: "rgba(255,255,255,0.7)",
                                        marginTop: 10,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    Total bids across all your auctions.
                                </p>
                            </motion.div>
                        </div>

                        {/* Live alert */}
                        <AnimatePresence>
                            {stats.live > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ overflow: "hidden", marginBottom: 16 }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                            background: C.white,
                                            border: `1px solid ${C.slate200}`,
                                            borderLeft: `3px solid ${C.blue}`,
                                            borderRadius: 10,
                                            padding: "10px 14px",
                                        }}
                                    >
                                        <span
                                            className="live-dot"
                                            style={{
                                                width: 8,
                                                height: 8,
                                                borderRadius: "50%",
                                                background: "#22c55e",
                                                flexShrink: 0,
                                            }}
                                        />
                                        <p style={{ fontSize: 12, color: C.slate600 }}>
                                            <strong style={{ color: C.slate900 }}>
                                                {stats.live} auction{stats.live > 1 ? "s" : ""}
                                            </strong>{" "}
                                            actively receiving bids right now
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Search + Filter */}
                        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                            <div style={{ position: "relative", flex: 1 }}>
                                <svg
                                    style={{
                                        position: "absolute",
                                        left: 12,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: C.slate300,
                                    }}
                                    width="14"
                                    height="14"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                >
                                    <circle cx="6.5" cy="6.5" r="4.5" />
                                    <path d="M10.5 10.5l3 3" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search by name or description…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        width: "100%",
                                        background: C.white,
                                        border: `1px solid ${C.slate200}`,
                                        borderRadius: 10,
                                        padding: "9px 14px 9px 36px",
                                        fontSize: 12,
                                        color: C.slate700,
                                        outline: "none",
                                        transition: "border-color 0.2s",
                                    }}
                                    onFocus={(e) => (e.target.style.borderColor = C.blue)}
                                    onBlur={(e) => (e.target.style.borderColor = C.slate200)}
                                />
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    gap: 4,
                                    background: C.white,
                                    border: `1px solid ${C.slate200}`,
                                    borderRadius: 10,
                                    padding: 4,
                                }}
                            >
                                {FILTERS.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => setFilter(key)}
                                        style={{
                                            padding: "6px 14px",
                                            fontSize: 11,
                                            fontWeight: 600,
                                            borderRadius: 8,
                                            border: "none",
                                            cursor: "pointer",
                                            transition: "all 0.2s",
                                            background: filter === key ? C.blue : "transparent",
                                            color: filter === key ? C.white : C.slate400,
                                        }}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Auction list */}
                        {loading ? (
                            <DashboardSkeleton />
                        ) : filtered.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                style={{
                                    background: C.white,
                                    border: `1px solid ${C.slate200}`,
                                    borderRadius: 12,
                                    padding: "60px 0",
                                    textAlign: "center",
                                }}
                            >
                                <p
                                    style={{
                                        fontWeight: 700,
                                        fontSize: 15,
                                        color: C.slate700,
                                        fontFamily: "'Syne',sans-serif",
                                        marginBottom: 6,
                                    }}
                                >
                                    No auctions found
                                </p>
                                <p style={{ fontSize: 12, color: C.slate400, marginBottom: 18 }}>
                                    Try adjusting your search or filter criteria
                                </p>
                                <Link
                                    to="/auction/create"
                                    style={{
                                        fontSize: 12,
                                        fontWeight: 600,
                                        color: C.blue,
                                        textDecoration: "none",
                                    }}
                                >
                                    + Create a new auction
                                </Link>
                            </motion.div>
                        ) : (
                            <AnimatePresence mode="popLayout">
                                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                    {filtered.map((auction, i) => (
                                        <AuctionRow
                                            key={auction._id}
                                            auction={auction}
                                            index={i}
                                            onStart={handleStart}
                                            onEnd={handleEnd}
                                        />
                                    ))}
                                </div>
                            </AnimatePresence>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
