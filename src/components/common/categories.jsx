import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import AuctionsGrid from "@/features/home/pages/AuctionsGrid.jsx";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";

export default function CategoryAuctionsPage() {
    const { category } = useParams();
    const navigate = useNavigate();
    const headerRef = useRef(null);
    const isInView = useInView(headerRef, { once: true, margin: "-40px" });

    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);

    const categoryName = category?.charAt(0).toUpperCase() + category?.slice(1);

    useEffect(() => {
        const fetchCategoryAuctions = async () => {
            try {
                setLoading(true);
                const res = await api.get(API_ENDPOINTS.Auction.GET_ALL, {
                    params: { page: 1, limit: 100, sortBy: "createdAt", order: "desc" },
                });
                const data = res?.data?.data || [];
                const filtered = data.filter(
                    (item) =>
                        item?.category?.trim().toLowerCase() === category?.trim().toLowerCase(),
                );
                setAuctions(filtered);
            } catch (error) {
                console.log("Category fetch error:", error);
                setAuctions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCategoryAuctions();
    }, [category]);

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#F8F9FF",
                fontFamily: "'Inter', 'Segoe UI', sans-serif",
            }}
        >
            {/* ── Top banner strip ── */}
            <div
                style={{
                    background: "#2D47E6",
                    padding: "9px 32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 24,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span
                        style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: "#4ADE80",
                            boxShadow: "0 0 6px #4ADE80",
                            display: "block",
                        }}
                    />
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.9)",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Real-time Auctions
                    </span>
                </div>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>•</span>
                <span
                    style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.7)",
                        letterSpacing: "0.04em",
                    }}
                >
                    Direct seller-to-buyer
                </span>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>•</span>
                <span
                    style={{
                        fontSize: 11,
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.7)",
                        letterSpacing: "0.04em",
                    }}
                >
                    No middleman fees
                </span>
            </div>

            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px 80px" }}>
                {/* ── Breadcrumb ── */}
                <motion.nav
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "20px 0 0" }}
                >
                    {[
                        { label: "Home", path: "/" },
                        { label: "Explore", path: "/explore" },
                    ].map((crumb, i) => (
                        <span key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <button
                                onClick={() => navigate(crumb.path)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: 12,
                                    fontWeight: 500,
                                    color: "#9CA3AF",
                                    padding: 0,
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "#2D47E6")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "#9CA3AF")}
                            >
                                {crumb.label}
                            </button>
                            <span style={{ color: "#D1D5DB", fontSize: 11 }}>›</span>
                        </span>
                    ))}
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                        {categoryName}
                    </span>
                </motion.nav>

                {/* ── Page Header ── */}
                <div ref={headerRef} style={{ marginTop: 32, marginBottom: 40 }}>
                    {/* Eyebrow line */}
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.4 }}
                        style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}
                    >
                        <span
                            style={{
                                display: "block",
                                width: 32,
                                height: 2,
                                background: "#2D47E6",
                                borderRadius: 2,
                            }}
                        />
                        <span
                            style={{
                                fontSize: 10,
                                fontWeight: 700,
                                letterSpacing: "0.4em",
                                textTransform: "uppercase",
                                color: "#2D47E6",
                            }}
                        >
                            Category Collection
                        </span>
                    </motion.div>

                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 24,
                        }}
                    >
                        <div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{
                                    duration: 0.55,
                                    delay: 0.08,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                style={{
                                    fontSize: "clamp(32px, 4.5vw, 54px)",
                                    fontWeight: 900,
                                    color: "#0D0D0D",
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.05,
                                    margin: 0,
                                }}
                            >
                                {categoryName} <span style={{ color: "#2D47E6" }}>Auctions</span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 12 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ duration: 0.45, delay: 0.18 }}
                                style={{
                                    marginTop: 12,
                                    fontSize: 14,
                                    color: "#6B7280",
                                    lineHeight: 1.7,
                                    maxWidth: 480,
                                    fontWeight: 400,
                                }}
                            >
                                Explore premium {categoryName.toLowerCase()} listings with real-time
                                bidding and trusted sellers on Auctify.
                            </motion.p>
                        </div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.45, delay: 0.24 }}
                            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
                        >
                            <div
                                style={{
                                    background: "#fff",
                                    border: "1px solid #E5E7EB",
                                    borderRadius: 10,
                                    padding: "14px 20px",
                                    minWidth: 110,
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: 9,
                                        fontWeight: 700,
                                        letterSpacing: "0.3em",
                                        textTransform: "uppercase",
                                        color: "#9CA3AF",
                                        marginBottom: 6,
                                    }}
                                >
                                    Total Listings
                                </p>
                                <p
                                    style={{
                                        fontSize: 26,
                                        fontWeight: 900,
                                        color: "#0D0D0D",
                                        letterSpacing: "-0.02em",
                                        lineHeight: 1,
                                    }}
                                >
                                    {loading ? (
                                        <span
                                            style={{
                                                display: "inline-block",
                                                width: 40,
                                                height: 28,
                                                background: "#F3F4F6",
                                                borderRadius: 4,
                                            }}
                                        />
                                    ) : (
                                        auctions.length
                                    )}
                                </p>
                            </div>

                            <div
                                style={{
                                    background: "#2D47E6",
                                    borderRadius: 10,
                                    padding: "14px 20px",
                                    minWidth: 110,
                                    boxShadow: "0 4px 16px rgba(45,71,230,0.3)",
                                }}
                            >
                                <p
                                    style={{
                                        fontSize: 9,
                                        fontWeight: 700,
                                        letterSpacing: "0.3em",
                                        textTransform: "uppercase",
                                        color: "rgba(255,255,255,0.65)",
                                        marginBottom: 6,
                                    }}
                                >
                                    Category
                                </p>
                                <p
                                    style={{
                                        fontSize: 18,
                                        fontWeight: 800,
                                        color: "#fff",
                                        letterSpacing: "-0.01em",
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {categoryName}
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* ── Divider ── */}
                <div
                    style={{
                        height: 1,
                        background: "linear-gradient(90deg, #2D47E6, #E5E7EB 60%)",
                        marginBottom: 36,
                        borderRadius: 1,
                    }}
                />

                {/* ── Content ── */}
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            background: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: 16,
                            padding: "80px 32px",
                            textAlign: "center",
                            boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 7,
                                marginBottom: 20,
                            }}
                        >
                            {[0, 1, 2].map((i) => (
                                <motion.span
                                    key={i}
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: i * 0.15,
                                        ease: "easeInOut",
                                    }}
                                    style={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: "#2D47E6",
                                        display: "block",
                                    }}
                                />
                            ))}
                        </div>
                        <p style={{ fontSize: 16, fontWeight: 700, color: "#0D0D0D", margin: 0 }}>
                            Loading Auctions
                        </p>
                        <p style={{ fontSize: 13, color: "#9CA3AF", marginTop: 6 }}>
                            Fetching {categoryName.toLowerCase()} listings...
                        </p>
                    </motion.div>
                ) : auctions.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            background: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: 16,
                            padding: "80px 32px",
                            textAlign: "center",
                            boxShadow: "0 1px 8px rgba(0,0,0,0.04)",
                        }}
                    >
                        <div
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 16,
                                background: "rgba(45,71,230,0.08)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto 20px",
                            }}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#2D47E6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </div>
                        <p
                            style={{
                                fontSize: 17,
                                fontWeight: 800,
                                color: "#0D0D0D",
                                margin: "0 0 8px",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            No Auctions Found
                        </p>
                        <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 24px" }}>
                            There are no active {categoryName.toLowerCase()} auctions at the moment.
                        </p>
                        <button
                            onClick={() => navigate("/explore")}
                            style={{
                                background: "#2D47E6",
                                color: "#fff",
                                border: "none",
                                borderRadius: 8,
                                padding: "10px 24px",
                                fontSize: 13,
                                fontWeight: 600,
                                cursor: "pointer",
                                letterSpacing: "0.02em",
                            }}
                        >
                            Browse All Auctions
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, delay: 0.1 }}
                    >
                        <AuctionsGrid
                            filteredAuctions={auctions}
                            showAll={false}
                            title={`${categoryName} Auctions`}
                            subtitle={`Browse all ${categoryName.toLowerCase()} auctions available right now.`}
                        />
                    </motion.div>
                )}
            </div>
        </div>
    );
}
