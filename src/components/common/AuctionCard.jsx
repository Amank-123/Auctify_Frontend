import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Gavel, Clock, Tag, TrendingUp, User, Eye, Flame, CheckCircle2 } from "lucide-react";

/* ─────────────────────────────────────────
   BRAND TOKENS  (Auctify palette)
───────────────────────────────────────── */
const B = {
    blue: "#1a3db5", // primary deep blue
    blueMid: "#2347d6", // nav / banner
    blueLight: "#e8edfb", // tint bg
    bluePale: "#f0f3fc", // very soft bg
    orange: "#e87c1e", // accent / highlight
    orangeLight: "#fff3e8", // tint
    white: "#ffffff",
    gray50: "#f7f8fc",
    gray100: "#eef0f6",
    gray300: "#c7cad8",
    gray500: "#8a8fa8",
    gray700: "#3d4261",
    gray900: "#1a1d2e",
};

const AUCTION_DURATION_HOURS = 2;

/* ─────────────────────────────────────────
   COUNTDOWN
───────────────────────────────────────── */
function Countdown({ endsAt }) {
    const calc = () => {
        if (!endsAt) return { h: "00", m: "00", s: "00" };
        const diff = Math.max(0, Math.floor((new Date(endsAt) - Date.now()) / 1000));
        return {
            h: String(Math.floor(diff / 3600)).padStart(2, "0"),
            m: String(Math.floor((diff % 3600) / 60)).padStart(2, "0"),
            s: String(diff % 60).padStart(2, "0"),
        };
    };

    const [t, setT] = useState(calc);
    useEffect(() => {
        const id = setInterval(() => setT(calc()), 1000);
        return () => clearInterval(id);
    }, [endsAt]);

    const labels = ["HRS", "MIN", "SEC"];

    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                marginBottom: 14,
                background: B.blueLight,
                borderRadius: 10,
                padding: "8px 10px",
                border: `1px solid #d0d8f5`,
            }}
        >
            <Clock size={13} color={B.blue} strokeWidth={2.2} style={{ flexShrink: 0 }} />
            <span
                style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: B.blue,
                    letterSpacing: "0.04em",
                    marginRight: 4,
                }}
            >
                ENDS IN
            </span>
            {["h", "m", "s"].map((k, i) => (
                <div key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <div style={{ textAlign: "center" }}>
                        <div
                            style={{
                                background: B.blue,
                                color: B.white,
                                borderRadius: 6,
                                padding: "3px 7px",
                                fontSize: 13,
                                fontWeight: 700,
                                fontVariantNumeric: "tabular-nums",
                                minWidth: 28,
                                lineHeight: 1.4,
                            }}
                        >
                            {t[k]}
                        </div>
                        <div
                            style={{
                                fontSize: 8,
                                color: B.gray500,
                                marginTop: 2,
                                letterSpacing: "0.06em",
                            }}
                        >
                            {labels[i]}
                        </div>
                    </div>
                    {i < 2 && (
                        <span
                            style={{
                                fontSize: 14,
                                fontWeight: 700,
                                color: B.blue,
                                marginBottom: 10,
                                opacity: 0.6,
                            }}
                        >
                            :
                        </span>
                    )}
                </div>
            ))}
        </div>
    );
}

/* ─────────────────────────────────────────
   FAV BUTTON
───────────────────────────────────────── */
function FavBtn() {
    const [on, setOn] = useState(false);
    return (
        <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={(e) => {
                e.stopPropagation();
                setOn(!on);
            }}
            style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: on ? "#ffe4e4" : "rgba(255,255,255,0.88)",
                backdropFilter: "blur(6px)",
                cursor: "pointer",
                transition: "background 0.2s",
                boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
            }}
        >
            <Heart
                size={15}
                strokeWidth={2}
                color={on ? "#e53e3e" : B.gray500}
                fill={on ? "#e53e3e" : "none"}
            />
        </motion.button>
    );
}

/* ─────────────────────────────────────────
   STATUS BADGE
───────────────────────────────────────── */
function StatusBadge({ status }) {
    const config = {
        active: { bg: B.orange, color: "#fff", icon: <Flame size={10} />, label: "LIVE" },
        ended: { bg: B.gray500, color: "#fff", icon: <Gavel size={10} />, label: "ENDED" },
        expired: { bg: B.gray300, color: B.gray700, icon: null, label: "EXPIRED" },
        draft: { bg: "#f59e0b", color: "#fff", icon: null, label: "DRAFT" },
    };
    const c = config[status] || config.draft;
    return (
        <div
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: c.bg,
                color: c.color,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.07em",
                padding: "4px 9px",
                borderRadius: 20,
            }}
        >
            {c.icon}
            {c.label}
        </div>
    );
}

/* ─────────────────────────────────────────
   SELLER AVATAR
───────────────────────────────────────── */
function SellerAvatar({ name }) {
    const initials =
        name
            ?.split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() || "AU";
    return (
        <div
            style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${B.blue} 0%, ${B.blueMid} 100%)`,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 700,
                flexShrink: 0,
            }}
        >
            {initials}
        </div>
    );
}

/* ─────────────────────────────────────────
   MAIN CARD
───────────────────────────────────────── */
export default function AuctionCard({ auction }) {
    const navigate = useNavigate();

    /* ── DATA ── */
    const image = auction?.media?.[0];
    const title = auction?.name || "Untitled Auction";
    const category =
        auction?.category?.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Auction";
    const price =
        auction?.currentHighestBid > 0 ? auction.currentHighestBid : auction?.startPrice || 0;
    const bids = auction?.bidCount || 0;
    const status = auction?.status || "draft";
    const seller = auction?.seller?.username || "Seller";

    /* ── TIMING ── */
    const endsAt = auction?.startTime
        ? new Date(new Date(auction.startTime).getTime() + AUCTION_DURATION_HOURS * 3600 * 1000)
        : null;
    const isActive = status === "active" && endsAt && new Date(endsAt) > new Date();

    /* ── BUTTON STATE ── */
    const [bidDone, setBidDone] = useState(false);

    const handleBid = () => {
        navigate(`/auction/${auction._id}`);
        if (isActive) {
            setBidDone(true);
            setTimeout(() => setBidDone(false), 1800);
        }
    };

    /* ── UI ── */
    return (
        <motion.div
            whileHover={{ y: -6, boxShadow: "0 16px 40px rgba(26,61,181,0.14)" }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            style={{
                width: 300,
                background: B.white,
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 2px 12px rgba(26,61,181,0.08)",
                border: `1px solid ${B.gray100}`,
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                cursor: "pointer",
            }}
        >
            {/* ── IMAGE ── */}
            <div
                style={{
                    position: "relative",
                    height: 180,
                    background: B.gray100,
                    overflow: "hidden",
                }}
            >
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                        }}
                    />
                ) : (
                    <div
                        style={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            background: B.bluePale,
                        }}
                    >
                        <Gavel size={32} color={B.gray300} strokeWidth={1.5} />
                        <span style={{ fontSize: 12, color: B.gray500 }}>No Image</span>
                    </div>
                )}

                {/* Top overlays */}
                <div style={{ position: "absolute", top: 12, left: 12 }}>
                    <StatusBadge status={status} />
                </div>
                <div style={{ position: "absolute", top: 10, right: 10 }}>
                    <FavBtn />
                </div>

                {/* Category tag */}
                <div
                    style={{
                        position: "absolute",
                        bottom: 12,
                        left: 12,
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        background: "rgba(26,61,181,0.82)",
                        backdropFilter: "blur(4px)",
                        color: "#fff",
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "4px 10px",
                        borderRadius: 20,
                    }}
                >
                    <Tag size={10} />
                    {category}
                </div>

                {/* Bid count pill — top right of image bottom */}
                {bids > 0 && (
                    <div
                        style={{
                            position: "absolute",
                            bottom: 12,
                            right: 12,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            background: "rgba(232,124,30,0.9)",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 600,
                            padding: "4px 9px",
                            borderRadius: 20,
                        }}
                    >
                        <TrendingUp size={10} />
                        {bids} bids
                    </div>
                )}
            </div>

            {/* ── BODY ── */}
            <div style={{ padding: "16px 16px 14px" }}>
                {/* Countdown */}
                {isActive && <Countdown endsAt={endsAt} />}

                {/* Title */}
                <h3
                    style={{
                        margin: "0 0 12px",
                        fontSize: 15,
                        fontWeight: 700,
                        lineHeight: 1.4,
                        color: B.gray900,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                >
                    {title}
                </h3>

                {/* Price section */}
                <div
                    style={{
                        background: B.orangeLight,
                        border: `1px solid #f5d9b8`,
                        borderRadius: 10,
                        padding: "10px 12px",
                        marginBottom: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div>
                        <div
                            style={{
                                fontSize: 10,
                                fontWeight: 600,
                                color: B.orange,
                                letterSpacing: "0.06em",
                                marginBottom: 2,
                            }}
                        >
                            {auction?.currentHighestBid > 0 ? "CURRENT BID" : "STARTING BID"}
                        </div>
                        <div
                            style={{
                                fontSize: 20,
                                fontWeight: 800,
                                color: B.gray900,
                                lineHeight: 1,
                            }}
                        >
                            ₹{price.toLocaleString("en-IN")}
                        </div>
                    </div>
                    <Gavel size={22} color={B.orange} strokeWidth={1.8} />
                </div>

                {/* Seller row */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 14,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <SellerAvatar name={seller} />
                        <div>
                            <div
                                style={{
                                    fontSize: 10,
                                    color: B.gray500,
                                    lineHeight: 1,
                                    marginBottom: 1,
                                }}
                            >
                                Seller
                            </div>
                            <div style={{ fontSize: 12, fontWeight: 600, color: B.gray700 }}>
                                {seller}
                            </div>
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            color: B.gray500,
                            fontSize: 11,
                        }}
                    >
                        <User size={12} />
                        Verified
                    </div>
                </div>

                {/* Divider */}
                <div style={{ height: 1, background: B.gray100, marginBottom: 13 }} />

                {/* CTA Button */}
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleBid}
                    style={{
                        width: "100%",
                        padding: "11px 0",
                        borderRadius: 10,
                        border: "none",
                        cursor: "pointer",
                        fontSize: 14,
                        fontWeight: 700,
                        letterSpacing: "0.02em",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 7,
                        transition: "opacity 0.18s",
                        ...(bidDone
                            ? { background: "#16a34a", color: "#fff" }
                            : isActive
                              ? {
                                    background: `linear-gradient(90deg, ${B.blue} 0%, ${B.blueMid} 100%)`,
                                    color: "#fff",
                                    boxShadow: `0 4px 14px rgba(26,61,181,0.28)`,
                                }
                              : {
                                    background: B.gray100,
                                    color: B.gray700,
                                    border: `1px solid ${B.gray300}`,
                                }),
                    }}
                >
                    <AnimatePresence mode="wait">
                        {bidDone ? (
                            <motion.span
                                key="done"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                style={{ display: "flex", alignItems: "center", gap: 6 }}
                            >
                                <CheckCircle2 size={15} />
                                Bid Placed!
                            </motion.span>
                        ) : isActive ? (
                            <motion.span
                                key="bid"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                style={{ display: "flex", alignItems: "center", gap: 6 }}
                            >
                                <Gavel size={15} />
                                Place Bid
                            </motion.span>
                        ) : (
                            <motion.span
                                key="view"
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                style={{ display: "flex", alignItems: "center", gap: 6 }}
                            >
                                <Eye size={15} />
                                View Details
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.div>
    );
}
