import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { useAuth } from "@/hooks/useAuth";

/* ─── fonts & global ─── */
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, body { font-family: 'Outfit', sans-serif; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .skeleton { background: linear-gradient(90deg,#f5f0ea 25%,#ede6da 50%,#f5f0ea 75%); background-size:200% 100%; animation:shimmer 1.4s infinite; }
  .live-pulse { animation: pulse-ring 1.4s ease-in-out infinite; }
  @keyframes pulse-ring { 0%,100%{opacity:1} 50%{opacity:0.25} }
`;

/* ─── helpers ─── */
const fmtINR = (n) => (n ? `₹${Number(n).toLocaleString("en-IN")}` : "—");

const STATUS_CFG = {
    active: { label: "LIVE", color: "#dc2626" },
    draft: { label: "Draft", color: "#92400e" },
    ended: { label: "Ended", color: "#57534e" },
};

/* ─── animated number ─── */
function AnimNum({ to, prefix = "", suffix = "" }) {
    const [v, setV] = useState(0);
    useEffect(() => {
        let s = null;
        const step = (ts) => {
            if (!s) s = ts;
            const p = Math.min((ts - s) / 1400, 1);
            const e = 1 - Math.pow(1 - p, 4);
            setV(Math.floor(e * to));
            if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [to]);
    return (
        <>
            {prefix}
            {v.toLocaleString("en-IN")}
            {suffix}
        </>
    );
}

/* ─── live badge ─── */
function LiveBadge() {
    const [t, setT] = useState(true);
    useEffect(() => {
        const id = setInterval(() => setT((x) => !x), 700);
        return () => clearInterval(id);
    }, []);
    return (
        <span
            style={{
                background: "#dc2626",
                color: "#fff",
                fontSize: 9,
                fontWeight: 800,
                letterSpacing: "0.14em",
                padding: "3px 8px",
                borderRadius: 3,
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                textTransform: "uppercase",
            }}
        >
            <span
                style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#fff",
                    opacity: t ? 1 : 0.2,
                    transition: "opacity 0.3s",
                }}
            />
            LIVE
        </span>
    );
}

/* ─── bid progress ─── */
function BidProgress({ current, start }) {
    const pct = start > 0 ? Math.min(((current - start) / start) * 200, 100) : 0;
    return (
        <div style={{ height: 3, background: "#e8dfd4", borderRadius: 99, overflow: "hidden" }}>
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.4 }}
                style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #d97706, #ea580c)",
                    borderRadius: 99,
                }}
            />
        </div>
    );
}

/* ─── wishlist ─── */
function HeartBtn({ id }) {
    const [on, setOn] = useState(false);
    return (
        <motion.button
            whileTap={{ scale: 0.75 }}
            onClick={(e) => {
                e.stopPropagation();
                setOn((s) => !s);
            }}
            style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: "#fff",
                border: "1px solid #e5d5c0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
        >
            <svg
                viewBox="0 0 24 24"
                width={13}
                height={13}
                fill={on ? "#ef4444" : "none"}
                stroke={on ? "#ef4444" : "#a87c50"}
                strokeWidth={2}
            >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
        </motion.button>
    );
}

/* ─── auction card ─── */
function AuctionCard({ item, isOwner, index }) {
    const [imgErr, setImgErr] = useState(false);
    const [hov, setHov] = useState(false);
    const cfg = STATUS_CFG[item.status] || STATUS_CFG.draft;
    const price = item.currentHighestBid || item.startPrice;
    const savings =
        item.mrp && item.startPrice
            ? Math.round(((item.mrp - item.startPrice) / item.mrp) * 100)
            : null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.055, type: "spring", stiffness: 140, damping: 20 }}
            onHoverStart={() => setHov(true)}
            onHoverEnd={() => setHov(false)}
            style={{
                background: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                border: "1px solid #ede5d8",
                boxShadow: hov
                    ? "0 16px 48px -8px rgba(180,120,40,0.18), 0 2px 8px rgba(0,0,0,0.06)"
                    : "0 1px 4px rgba(0,0,0,0.06)",
                transition: "box-shadow 0.3s ease",
            }}
        >
            {/* image */}
            <div
                style={{
                    position: "relative",
                    height: 196,
                    background: "#f7f1e8",
                    flexShrink: 0,
                    overflow: "hidden",
                }}
            >
                {!imgErr ? (
                    <motion.img
                        src={item.media?.[0]}
                        alt={item.name}
                        onError={() => setImgErr(true)}
                        animate={{ scale: hov ? 1.07 : 1 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                ) : (
                    <div
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            color: "#c4a882",
                        }}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            width={36}
                            height={36}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={1.2}
                        >
                            <rect x={3} y={3} width={18} height={18} rx={2} />
                            <circle cx={8.5} cy={8.5} r={1.5} />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                        <span style={{ fontSize: 11, color: "#c4a882" }}>No image</span>
                    </div>
                )}
                {/* overlay */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to bottom, transparent 55%, rgba(0,0,0,0.28))",
                    }}
                />
                {/* top badges */}
                <div
                    style={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                    }}
                >
                    {item.status === "active" ? (
                        <LiveBadge />
                    ) : (
                        <span
                            style={{
                                background: cfg.color,
                                color: "#fff",
                                fontSize: 9,
                                fontWeight: 800,
                                letterSpacing: "0.14em",
                                padding: "3px 8px",
                                borderRadius: 3,
                                textTransform: "uppercase",
                            }}
                        >
                            {cfg.label}
                        </span>
                    )}
                    {savings && (
                        <span
                            style={{
                                background: "#16a34a",
                                color: "#fff",
                                fontSize: 9,
                                fontWeight: 800,
                                padding: "3px 8px",
                                borderRadius: 3,
                            }}
                        >
                            {savings}% OFF
                        </span>
                    )}
                </div>
                {/* wishlist */}
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                    <HeartBtn id={item._id} />
                </div>
                {/* bid count bottom */}
                {(item.bidCount ?? 0) > 0 && (
                    <div style={{ position: "absolute", bottom: 10, left: 10 }}>
                        <span
                            style={{
                                background: "rgba(0,0,0,0.55)",
                                backdropFilter: "blur(6px)",
                                color: "#fff",
                                fontSize: 10,
                                fontWeight: 600,
                                padding: "3px 8px",
                                borderRadius: 4,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width={11}
                                height={11}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                            </svg>
                            {item.bidCount} bids
                        </span>
                    </div>
                )}
            </div>

            {/* body */}
            <div
                style={{
                    padding: "14px 16px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    flex: 1,
                }}
            >
                {item.category && (
                    <span
                        style={{
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.15em",
                            textTransform: "uppercase",
                            color: "#b45309",
                        }}
                    >
                        {item.category}
                    </span>
                )}
                <h3
                    style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#1c1008",
                        lineHeight: 1.4,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        margin: 0,
                        transition: "color 0.2s",
                        ...(hov ? { color: "#92400e" } : {}),
                    }}
                >
                    {item.name}
                </h3>
                {item.sellerName && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div
                            style={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                background: "linear-gradient(135deg, #d97706, #ea580c)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#fff",
                                fontSize: 8,
                                fontWeight: 800,
                            }}
                        >
                            {item.sellerName[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontSize: 11, color: "#8c7560" }}>
                            by{" "}
                            <strong style={{ color: "#4a3520", fontWeight: 600 }}>
                                {item.sellerName}
                            </strong>
                        </span>
                    </div>
                )}

                {/* price box */}
                <div
                    style={{
                        background: "linear-gradient(135deg, #fffbf5, #fef3e2)",
                        border: "1px solid #f0dfc0",
                        borderRadius: 10,
                        padding: "10px 12px",
                        marginTop: "auto",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "space-between",
                        }}
                    >
                        <div>
                            <p
                                style={{
                                    fontSize: 9,
                                    fontWeight: 700,
                                    letterSpacing: "0.13em",
                                    textTransform: "uppercase",
                                    color: "#a87c50",
                                    marginBottom: 2,
                                }}
                            >
                                {item.status === "active" ? "Current Bid" : "Starting at"}
                            </p>
                            <span
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: 22,
                                    fontWeight: 900,
                                    color: "#1c1008",
                                    letterSpacing: "-0.02em",
                                }}
                            >
                                {fmtINR(price)}
                            </span>
                            {item.mrp && (
                                <p
                                    style={{
                                        fontSize: 10,
                                        color: "#b8a08a",
                                        textDecoration: "line-through",
                                        marginTop: 1,
                                    }}
                                >
                                    MRP {fmtINR(item.mrp)}
                                </p>
                            )}
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <p
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: 20,
                                    fontWeight: 800,
                                    color: "#1c1008",
                                }}
                            >
                                {item.bidCount ?? 0}
                            </p>
                            <p
                                style={{
                                    fontSize: 9,
                                    fontWeight: 700,
                                    letterSpacing: "0.13em",
                                    textTransform: "uppercase",
                                    color: "#a87c50",
                                }}
                            >
                                bids
                            </p>
                        </div>
                    </div>
                    {item.status === "active" && item.startPrice && (
                        <div style={{ marginTop: 8 }}>
                            <BidProgress current={price} start={item.startPrice} />
                        </div>
                    )}
                </div>

                {/* CTA */}
                {isOwner ? (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            width: "100%",
                            padding: "10px 0",
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 700,
                            border: "1.5px solid #d4b896",
                            background: "transparent",
                            color: "#7c4a1e",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            transition: "background 0.2s",
                        }}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            width={13}
                            height={13}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                        Manage Auction
                    </motion.button>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(217,119,6,0.35)" }}
                        whileTap={{ scale: 0.96 }}
                        style={{
                            width: "100%",
                            padding: "11px 0",
                            borderRadius: 10,
                            fontSize: 12,
                            fontWeight: 800,
                            border: "none",
                            background: "linear-gradient(135deg, #d97706, #ea580c)",
                            color: "#fff",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 6,
                            position: "relative",
                            overflow: "hidden",
                            letterSpacing: "0.03em",
                        }}
                    >
                        <motion.div
                            style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                                skewX: -15,
                            }}
                            initial={{ x: "-120%" }}
                            animate={hov ? { x: "220%" } : { x: "-120%" }}
                            transition={{ duration: 0.55, ease: "easeInOut" }}
                        />
                        <svg
                            viewBox="0 0 24 24"
                            width={13}
                            height={13}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                            <polyline points="17 6 23 6 23 12" />
                        </svg>
                        <span style={{ position: "relative", zIndex: 1 }}>Place Bid</span>
                    </motion.button>
                )}
            </div>
        </motion.div>
    );
}

/* ─── skeleton ─── */
function CardSkeleton() {
    return (
        <div
            style={{
                background: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid #ede5d8",
            }}
        >
            <div className="skeleton" style={{ height: 196 }} />
            <div
                style={{
                    padding: "14px 16px 16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                }}
            >
                <div className="skeleton" style={{ height: 10, borderRadius: 6, width: "35%" }} />
                <div className="skeleton" style={{ height: 14, borderRadius: 6, width: "80%" }} />
                <div className="skeleton" style={{ height: 12, borderRadius: 6, width: "60%" }} />
                <div className="skeleton" style={{ height: 64, borderRadius: 10, marginTop: 4 }} />
                <div className="skeleton" style={{ height: 38, borderRadius: 10 }} />
            </div>
        </div>
    );
}

/* ─── filter pill ─── */
function Pill({ label, active, count, onClick }) {
    return (
        <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={onClick}
            style={{
                padding: "7px 16px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 600,
                border: active ? "none" : "1.5px solid #e2d0ba",
                background: active ? "linear-gradient(135deg, #d97706, #ea580c)" : "#fff",
                color: active ? "#fff" : "#7c5a38",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: active ? "0 3px 12px rgba(217,119,6,0.3)" : "none",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
            }}
        >
            {label}
            {count !== undefined && (
                <span
                    style={{
                        fontSize: 10,
                        fontWeight: 800,
                        padding: "1px 6px",
                        borderRadius: 999,
                        background: active ? "rgba(0,0,0,0.18)" : "#f0e4d0",
                        color: active ? "#fff" : "#92400e",
                    }}
                >
                    {count}
                </span>
            )}
        </motion.button>
    );
}

/* ─── categories ─── */
const CATS = [
    { label: "Electronics", icon: "💻" },
    { label: "Jewellery", icon: "💍" },
    { label: "Vehicles", icon: "🚗" },
    { label: "Art", icon: "🎨" },
    { label: "Watches", icon: "⌚" },
    { label: "Antiques", icon: "🏺" },
    { label: "Fashion", icon: "👗" },
    { label: "Books", icon: "📚" },
];

function CategoryRow({ onSelect }) {
    return (
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 48px" }}>
            <div
                className="scrollbar-hide"
                style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}
            >
                {CATS.map((c, i) => (
                    <motion.button
                        key={c.label}
                        onClick={() => onSelect?.(c.label)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + i * 0.05 }}
                        whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(217,119,6,0.15)" }}
                        whileTap={{ scale: 0.95 }}
                        style={{
                            flexShrink: 0,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 6,
                            background: "#fff",
                            border: "1.5px solid #e8dfd0",
                            borderRadius: 14,
                            padding: "12px 20px",
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#5c3d1e",
                            cursor: "pointer",
                            transition: "all 0.2s",
                        }}
                    >
                        <span style={{ fontSize: 22 }}>{c.icon}</span>
                        {c.label}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}

/* ─── hero ─── */
function Hero({ stats, loading }) {
    const { scrollY } = useScroll();
    const bgY = useTransform(scrollY, [0, 400], [0, 70]);

    return (
        <div
            style={{
                position: "relative",
                overflow: "hidden",
                background: "#fffbf5",
                borderBottom: "1px solid #e8dfd0",
            }}
        >
            {/* decorative background shapes */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
                {/* large warm circle top right */}
                <div
                    style={{
                        position: "absolute",
                        top: -120,
                        right: -80,
                        width: 520,
                        height: 520,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(251,191,36,0.12) 0%, transparent 70%)",
                    }}
                />
                {/* grid pattern */}
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        opacity: 0.5,
                        backgroundImage:
                            "radial-gradient(circle, rgba(180,100,20,0.12) 1px, transparent 1px)",
                        backgroundSize: "32px 32px",
                    }}
                />
                {/* diagonal accent */}
                <svg
                    style={{ position: "absolute", bottom: 0, left: 0, right: 0, width: "100%" }}
                    viewBox="0 0 1440 80"
                    fill="none"
                    preserveAspectRatio="none"
                >
                    <path d="M0 80L1440 30V80H0Z" fill="#faf5ec" />
                </svg>
                {/* floating orbs */}
                {[...Array(4)].map((_, i) => (
                    <motion.div
                        key={i}
                        style={{
                            position: "absolute",
                            borderRadius: "50%",
                            width: 12 + i * 8,
                            height: 12 + i * 8,
                            background: `rgba(217,119,6,${0.08 + i * 0.03})`,
                            top: `${20 + i * 18}%`,
                            left: `${8 + i * 22}%`,
                            animation: `float ${3.5 + i}s ease-in-out infinite`,
                            animationDelay: `${i * 0.7}s`,
                        }}
                    />
                ))}
            </div>

            <motion.div style={{ y: bgY }} className="">
                <div
                    style={{
                        position: "relative",
                        zIndex: 10,
                        maxWidth: 1280,
                        margin: "0 auto",
                        padding: "72px 24px 64px",
                        textAlign: "center",
                    }}
                >
                    {/* eyebrow */}
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 }}
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 7,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            color: "#92400e",
                            background: "linear-gradient(135deg, #fef3c7, #fde68a)",
                            border: "1px solid #f6d07a",
                            borderRadius: 999,
                            padding: "6px 20px",
                            marginBottom: 24,
                        }}
                    >
                        <span
                            style={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                background: "#d97706",
                                display: "inline-block",
                            }}
                            className="live-pulse"
                        />
                        India's Premier Auction Platform
                    </motion.div>

                    {/* headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.12, type: "spring", stiffness: 90, damping: 18 }}
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: "clamp(40px, 7vw, 80px)",
                            fontWeight: 900,
                            color: "#1c1008",
                            lineHeight: 1.05,
                            letterSpacing: "-0.02em",
                            marginBottom: 20,
                        }}
                    >
                        Where Every{" "}
                        <span
                            style={{
                                backgroundImage: "linear-gradient(135deg, #d97706, #ea580c)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Bid Tells
                        </span>
                        <br />a Story.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            fontSize: 16,
                            color: "#7c5a38",
                            maxWidth: 460,
                            margin: "0 auto 36px",
                            lineHeight: 1.7,
                            fontWeight: 400,
                        }}
                    >
                        Discover rare finds — electronics, jewellery, vintage vehicles & more.
                        Real-time bids, verified sellers, delivered pan-India.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.26 }}
                        style={{
                            display: "flex",
                            gap: 12,
                            justifyContent: "center",
                            flexWrap: "wrap",
                            marginBottom: 56,
                        }}
                    >
                        <motion.button
                            whileHover={{
                                scale: 1.04,
                                boxShadow: "0 10px 32px rgba(217,119,6,0.4)",
                            }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                padding: "14px 32px",
                                borderRadius: 12,
                                fontSize: 14,
                                fontWeight: 800,
                                background: "linear-gradient(135deg, #d97706, #ea580c)",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                letterSpacing: "0.02em",
                            }}
                        >
                            Start Bidding Free
                            <svg
                                viewBox="0 0 24 24"
                                width={16}
                                height={16}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2.5}
                            >
                                <line x1={5} y1={12} x2={19} y2={12} />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02, background: "#f5ece0" }}
                            whileTap={{ scale: 0.97 }}
                            style={{
                                padding: "14px 32px",
                                borderRadius: 12,
                                fontSize: 14,
                                fontWeight: 600,
                                background: "#fff",
                                color: "#7c4a1e",
                                border: "1.5px solid #d4b896",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                transition: "background 0.2s",
                            }}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                width={15}
                                height={15}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <circle cx={12} cy={12} r={10} />
                                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
                            </svg>
                            How it works
                        </motion.button>
                    </motion.div>

                    {/* stats */}
                    {!loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.36 }}
                            style={{
                                display: "inline-grid",
                                gridTemplateColumns: "repeat(3, 1fr)",
                                background: "#fff",
                                border: "1.5px solid #e8dfd0",
                                borderRadius: 18,
                                overflow: "hidden",
                                boxShadow: "0 4px 24px rgba(180,120,40,0.1)",
                            }}
                        >
                            {[
                                { label: "Live Now", val: stats.live, suffix: "" },
                                { label: "Total Auctions", val: stats.total, suffix: "+" },
                                { label: "Bids Placed", val: stats.bids, suffix: "" },
                            ].map(({ label, val, suffix }, i) => (
                                <div
                                    key={label}
                                    style={{
                                        padding: "20px 32px",
                                        textAlign: "center",
                                        borderRight: i < 2 ? "1.5px solid #e8dfd0" : "none",
                                    }}
                                >
                                    <p
                                        style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: 28,
                                            fontWeight: 900,
                                            color: "#d97706",
                                            margin: "0 0 3px",
                                        }}
                                    >
                                        <AnimNum to={val} suffix={suffix} />
                                    </p>
                                    <p
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            letterSpacing: "0.14em",
                                            textTransform: "uppercase",
                                            color: "#a87c50",
                                            margin: 0,
                                        }}
                                    >
                                        {label}
                                    </p>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

/* ─── trust strip ─── */
function TrustStrip() {
    const items = [
        { icon: "🔒", text: "Secure Payments" },
        { icon: "⚡", text: "Real-Time Bidding" },
        { icon: "🏆", text: "Verified Sellers" },
        { icon: "↩️", text: "Buyer Protection" },
        { icon: "📦", text: "Pan-India Delivery" },
    ];
    return (
        <div
            style={{
                background: "#faf5ec",
                borderBottom: "1px solid #e8dfd0",
                padding: "12px 24px",
            }}
        >
            <div
                style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: 10,
                }}
            >
                {items.map((it, i) => (
                    <motion.div
                        key={it.text}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 7,
                            fontSize: 11,
                            fontWeight: 600,
                            color: "#7c5a38",
                        }}
                    >
                        <span style={{ fontSize: 16 }}>{it.icon}</span>
                        {it.text}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

/* ─── section wrapper ─── */
function Section({ title, subtitle, action, children }) {
    return (
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 64px" }}>
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    marginBottom: 24,
                }}
            >
                <div>
                    <h2
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 28,
                            fontWeight: 800,
                            color: "#1c1008",
                            margin: "0 0 4px",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        {title}
                    </h2>
                    {subtitle && (
                        <p style={{ fontSize: 13, color: "#8c7560", margin: 0 }}>{subtitle}</p>
                    )}
                </div>
                {action && (
                    <motion.button
                        whileHover={{ x: 3 }}
                        onClick={action.fn}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 12,
                            fontWeight: 700,
                            color: "#d97706",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: 0,
                        }}
                    >
                        {action.label}
                        <svg
                            viewBox="0 0 24 24"
                            width={14}
                            height={14}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2.5}
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </motion.button>
                )}
            </div>
            {children}
        </section>
    );
}

/* ─── empty state ─── */
function EmptyState({ onReset }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                textAlign: "center",
                padding: "60px 24px",
                background: "#faf5ec",
                borderRadius: 18,
                border: "1.5px dashed #d4b896",
            }}
        >
            <p style={{ fontSize: 48, marginBottom: 12 }}>🔍</p>
            <p
                style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 20,
                    fontWeight: 700,
                    color: "#3d2008",
                    marginBottom: 6,
                }}
            >
                No auctions found
            </p>
            <p style={{ fontSize: 13, color: "#8c7560", marginBottom: 20 }}>
                Try adjusting your filter or search term
            </p>
            <button
                onClick={onReset}
                style={{
                    padding: "10px 24px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #d97706, #ea580c)",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                Clear filters
            </button>
        </motion.div>
    );
}

/* ─── footer CTA ─── */
function FooterCTA() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 64px" }}
        >
            <div
                style={{
                    borderRadius: 24,
                    padding: "56px 40px",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                    background: "linear-gradient(135deg, #1c0f00, #3d1f00, #1c0f00)",
                    border: "1px solid rgba(217,119,6,0.25)",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        backgroundImage:
                            "radial-gradient(circle at 50% 50%, rgba(217,119,6,0.1) 0%, transparent 65%)",
                    }}
                />
                <div style={{ position: "relative", zIndex: 1 }}>
                    <p
                        style={{
                            fontSize: 10,
                            fontWeight: 800,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "#fbbf24",
                            marginBottom: 12,
                        }}
                    >
                        Sell on BidIndia
                    </p>
                    <h3
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: 36,
                            fontWeight: 900,
                            color: "#fff",
                            margin: "0 0 14px",
                            letterSpacing: "-0.01em",
                        }}
                    >
                        Got something to sell?
                    </h3>
                    <p
                        style={{
                            fontSize: 14,
                            color: "rgba(255,255,255,0.55)",
                            maxWidth: 380,
                            margin: "0 auto 28px",
                            lineHeight: 1.65,
                        }}
                    >
                        List your item in minutes. Reach thousands of eager bidders across India.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                        style={{
                            padding: "14px 36px",
                            borderRadius: 12,
                            fontSize: 14,
                            fontWeight: 800,
                            background: "linear-gradient(135deg, #f59e0b, #ea580c)",
                            color: "#1c0f00",
                            border: "none",
                            cursor: "pointer",
                            letterSpacing: "0.02em",
                        }}
                    >
                        Start Selling Free →
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

/* ══════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════ */
export default function Homepage() {
    const { User } = useAuth();
    const [auctions, setAuctions] = useState([]);
    const [myAuctions, setMyAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("latest");
    const listRef = useRef(null);

    useEffect(() => {
        (async () => {
            try {
                const [allRes, myRes] = await Promise.all([
                    api.get(API_ENDPOINTS.Auction.GET_ALL),
                    User ? api.get(API_ENDPOINTS.Auction.GET_BY_SELLER) : Promise.resolve(null),
                ]);
                setAuctions(allRes.data.data || []);
                if (myRes) setMyAuctions(myRes.data.data || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        })();
    }, [User]);

    const counts = {
        all: auctions.length,
        active: auctions.filter((a) => a.status === "active").length,
        draft: auctions.filter((a) => a.status === "draft").length,
        ended: auctions.filter((a) => a.status === "ended").length,
    };

    const sorted = [...auctions].sort((a, b) => {
        if (sortBy === "price-asc") return (a.startPrice || 0) - (b.startPrice || 0);
        if (sortBy === "price-desc") return (b.startPrice || 0) - (a.startPrice || 0);
        if (sortBy === "bids") return (b.bidCount || 0) - (a.bidCount || 0);
        return 0;
    });

    const filtered = sorted
        .filter((a) => filter === "all" || a.status === filter)
        .filter((a) => a.name?.toLowerCase().includes(search.toLowerCase()));

    const stats = {
        live: auctions.filter((a) => a.status === "active").length,
        total: auctions.length,
        bids: auctions.reduce((s, a) => s + (a.bidCount || 0), 0),
    };

    const FILTERS = [
        { key: "all", label: "All" },
        { key: "active", label: "🔴 Live" },
        { key: "draft", label: "Draft" },
        { key: "ended", label: "Ended" },
    ];

    return (
        <>
            <style>{GLOBAL_STYLE}</style>
            <div style={{ minHeight: "100vh", background: "#faf5ec" }}>
                {/* ── announcement bar ── */}
                <motion.div
                    initial={{ y: -36, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{
                        background: "linear-gradient(90deg, #92400e, #b45309, #92400e)",
                        color: "#fef3c7",
                        textAlign: "center",
                        fontSize: 11,
                        fontWeight: 700,
                        padding: "9px 16px",
                        letterSpacing: "0.04em",
                    }}
                >
                    🎉 &nbsp; FLASH SALE LIVE — Up to 80% off on 200+ auctions today &nbsp;·&nbsp;
                    Free shipping on wins above ₹999
                </motion.div>

                {/* ── hero ── */}
                <Hero stats={stats} loading={loading} />

                {/* ── trust strip ── */}
                <TrustStrip />

                <div style={{ paddingTop: 52 }} ref={listRef}>
                    {/* ── categories ── */}
                    <CategoryRow />

                    {/* ── divider ── */}
                    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 40px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div
                                style={{
                                    flex: 1,
                                    height: 1,
                                    background: "linear-gradient(90deg, transparent, #d4b896)",
                                }}
                            />
                            <span
                                style={{
                                    fontSize: 10,
                                    fontWeight: 800,
                                    letterSpacing: "0.2em",
                                    textTransform: "uppercase",
                                    color: "#a87c50",
                                }}
                            >
                                Live & Upcoming
                            </span>
                            <div
                                style={{
                                    flex: 1,
                                    height: 1,
                                    background: "linear-gradient(90deg, #d4b896, transparent)",
                                }}
                            />
                        </div>
                    </div>

                    {/* ── main auctions section ── */}
                    <Section
                        title="Auctions"
                        subtitle="Bid now before time runs out — prices update in real-time"
                        action={{ label: "View all live", fn: () => setFilter("active") }}
                    >
                        {/* search + sort */}
                        <div
                            style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}
                        >
                            <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
                                <svg
                                    viewBox="0 0 24 24"
                                    width={15}
                                    height={15}
                                    fill="none"
                                    stroke="#a87c50"
                                    strokeWidth={2}
                                    style={{
                                        position: "absolute",
                                        left: 13,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                    }}
                                >
                                    <circle cx={11} cy={11} r={8} />
                                    <line x1={21} y1={21} x2={16.65} y2={16.65} />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search auctions, products, sellers…"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    style={{
                                        width: "100%",
                                        paddingLeft: 36,
                                        paddingRight: 14,
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                        fontSize: 13,
                                        border: "1.5px solid #e2d0ba",
                                        borderRadius: 10,
                                        background: "#fff",
                                        color: "#3d2008",
                                        outline: "none",
                                        boxSizing: "border-box",
                                    }}
                                />
                            </div>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                style={{
                                    padding: "10px 14px",
                                    fontSize: 12,
                                    fontWeight: 600,
                                    border: "1.5px solid #e2d0ba",
                                    borderRadius: 10,
                                    background: "#fff",
                                    color: "#7c5a38",
                                    outline: "none",
                                    cursor: "pointer",
                                }}
                            >
                                <option value="latest">Latest First</option>
                                <option value="price-asc">Price: Low → High</option>
                                <option value="price-desc">Price: High → Low</option>
                                <option value="bids">Most Bids</option>
                            </select>
                        </div>

                        {/* filter pills */}
                        <div
                            style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}
                        >
                            {FILTERS.map((f) => (
                                <Pill
                                    key={f.key}
                                    label={f.label}
                                    active={filter === f.key}
                                    count={counts[f.key]}
                                    onClick={() => setFilter(f.key)}
                                />
                            ))}
                        </div>

                        {/* grid */}
                        {loading ? (
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                                    gap: 20,
                                }}
                            >
                                {[...Array(8)].map((_, i) => (
                                    <CardSkeleton key={i} />
                                ))}
                            </div>
                        ) : filtered.length === 0 ? (
                            <EmptyState
                                onReset={() => {
                                    setFilter("all");
                                    setSearch("");
                                }}
                            />
                        ) : (
                            <AnimatePresence mode="popLayout">
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fill, minmax(240px, 1fr))",
                                        gap: 20,
                                    }}
                                >
                                    {filtered.map((item, i) => (
                                        <AuctionCard
                                            key={item._id}
                                            item={item}
                                            index={i}
                                            isOwner={false}
                                        />
                                    ))}
                                </div>
                            </AnimatePresence>
                        )}
                    </Section>

                    {/* ── my auctions ── */}
                    {User && myAuctions.length > 0 && (
                        <Section
                            title="Your Auctions"
                            subtitle="Manage your active and past listings"
                        >
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                                    gap: 20,
                                }}
                            >
                                {myAuctions.map((item, i) => (
                                    <AuctionCard key={item._id} item={item} index={i} isOwner />
                                ))}
                            </div>
                        </Section>
                    )}

                    {/* ── how it works ── */}
                    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 64px" }}>
                        <div style={{ textAlign: "center", marginBottom: 40 }}>
                            <h2
                                style={{
                                    fontFamily: "'Playfair Display', serif",
                                    fontSize: 28,
                                    fontWeight: 800,
                                    color: "#1c1008",
                                    margin: "0 0 8px",
                                }}
                            >
                                How BidIndia Works
                            </h2>
                            <p style={{ fontSize: 13, color: "#8c7560" }}>
                                Three simple steps to your next great deal
                            </p>
                        </div>
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                                gap: 20,
                            }}
                        >
                            {[
                                {
                                    n: "01",
                                    title: "Browse Auctions",
                                    desc: "Discover hundreds of verified listings across categories — from vintage watches to the latest electronics.",
                                    icon: "🔍",
                                },
                                {
                                    n: "02",
                                    title: "Place Your Bid",
                                    desc: "Bid in real-time. Get instant notifications when you're outbid so you never miss a winning opportunity.",
                                    icon: "⚡",
                                },
                                {
                                    n: "03",
                                    title: "Win & Receive",
                                    desc: "Won? Complete secure payment and receive your item delivered anywhere across India.",
                                    icon: "🎉",
                                },
                            ].map((step, i) => (
                                <motion.div
                                    key={step.n}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.12 }}
                                    style={{
                                        background: "#fff",
                                        border: "1.5px solid #e8dfd0",
                                        borderRadius: 18,
                                        padding: "28px 24px",
                                        position: "relative",
                                        overflow: "hidden",
                                    }}
                                >
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: 16,
                                            right: 18,
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: 56,
                                            fontWeight: 900,
                                            color: "#f0e4d0",
                                            lineHeight: 1,
                                            userSelect: "none",
                                        }}
                                    >
                                        {step.n}
                                    </span>
                                    <span
                                        style={{ fontSize: 32, display: "block", marginBottom: 14 }}
                                    >
                                        {step.icon}
                                    </span>
                                    <h4
                                        style={{
                                            fontFamily: "'Playfair Display', serif",
                                            fontSize: 17,
                                            fontWeight: 800,
                                            color: "#1c1008",
                                            margin: "0 0 8px",
                                        }}
                                    >
                                        {step.title}
                                    </h4>
                                    <p
                                        style={{
                                            fontSize: 13,
                                            color: "#7c5a38",
                                            lineHeight: 1.65,
                                            margin: 0,
                                        }}
                                    >
                                        {step.desc}
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </section>

                    {/* ── footer CTA ── */}
                    <FooterCTA />
                </div>
            </div>
        </>
    );
}
