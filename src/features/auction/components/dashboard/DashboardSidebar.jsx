import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { C } from "../../constants/dashboardColors";

const NavIcons = {
    Dashboard: (
        <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <rect x="1" y="1" width="6" height="6" rx="1.5" />
            <rect x="9" y="1" width="6" height="6" rx="1.5" />
            <rect x="1" y="9" width="6" height="6" rx="1.5" />
            <rect x="9" y="9" width="6" height="6" rx="1.5" />
        </svg>
    ),
    Properties: (
        <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        >
            <path d="M2 4h12M2 8h12M2 12h7" />
        </svg>
    ),
    Messages: (
        <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        >
            <rect x="1" y="2" width="14" height="10" rx="2" />
            <path d="M4 14l2-2h5" />
        </svg>
    ),
    Notifications: (
        <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <path d="M8 1a5 5 0 015 5v3l1.5 2h-13L3 9V6a5 5 0 015-5z" strokeLinecap="round" />
            <path d="M6.5 13a1.5 1.5 0 003 0" />
        </svg>
    ),
    Orders: (
        <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        >
            <rect x="2" y="1" width="12" height="14" rx="2" />
            <path d="M5 5h6M5 8h6M5 11h3" />
        </svg>
    ),
    Analytics: (
        <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
        >
            <polyline points="2,12 6,7 9,10 14,4" />
        </svg>
    ),
    Setting: (
        <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <circle cx="8" cy="8" r="2.5" />
            <path
                d="M8 1.5v1M8 13.5v1M1.5 8h1M13.5 8h1M3.4 3.4l.7.7M11.9 11.9l.7.7M11.9 3.4l-.7.7M3.4 11.9l.7-.7"
                strokeLinecap="round"
            />
        </svg>
    ),
    Help: (
        <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
        >
            <circle cx="8" cy="8" r="6" />
            <path d="M6.5 6a1.5 1.5 0 012.5 1c0 1-1.5 1.5-1.5 2.5M8 12v.5" strokeLinecap="round" />
        </svg>
    ),
};

const NAV_SECTIONS = [
    { label: "OVERVIEW", items: ["Dashboard", "Properties", "Messages", "Notifications"] },
    { label: "PERFORMANCE", items: ["Orders", "Analytics"] },
    { label: "SUPPORT", items: ["Setting", "Help"] },
];

export default function DashboardSidebar({ liveCount }) {
    return (
        <motion.aside
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            style={{
                width: 200,
                background: C.white,
                borderRight: `1px solid ${C.slate200}`,
                height: "100vh",
                position: "fixed",
                display: "flex",
                flexDirection: "column",
                zIndex: 10,
            }}
        >
            {/* Logo */}
            <div style={{ padding: "20px 16px 16px", borderBottom: `1px solid ${C.slate100}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div
                        style={{
                            width: 34,
                            height: 34,
                            borderRadius: 8,
                            background: C.blue,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: C.white,
                            fontWeight: 800,
                            fontSize: 15,
                            fontFamily: "'Syne',sans-serif",
                            boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
                        }}
                    >
                        A
                    </div>
                    <div>
                        <div
                            style={{
                                fontWeight: 800,
                                fontSize: 14,
                                color: C.slate900,
                                fontFamily: "'Syne',sans-serif",
                            }}
                        >
                            AuctionHub
                        </div>
                        <div
                            style={{
                                fontSize: 9,
                                color: C.slate400,
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                            }}
                        >
                            Seller Portal
                        </div>
                    </div>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: "8px 10px", overflowY: "auto" }}>
                {NAV_SECTIONS.map(({ label, items }) => (
                    <div key={label}>
                        <p
                            style={{
                                fontSize: 9,
                                color: C.slate400,
                                letterSpacing: "0.12em",
                                textTransform: "uppercase",
                                padding: "10px 8px 4px",
                                fontWeight: 600,
                            }}
                        >
                            {label}
                        </p>
                        {items.map((item) => {
                            const isActive = item === "Dashboard";
                            return (
                                <motion.div
                                    key={item}
                                    initial={{ opacity: 0, x: -12 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    whileHover={!isActive ? { x: 2 } : {}}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 8,
                                        padding: "8px 10px",
                                        borderRadius: 10,
                                        cursor: "pointer",
                                        fontSize: 12,
                                        fontWeight: isActive ? 600 : 400,
                                        color: isActive ? C.blue : C.slate400,
                                        background: isActive ? C.blueLight : "transparent",
                                        marginBottom: 1,
                                        transition: "all 0.15s",
                                        borderRight: isActive
                                            ? `2px solid ${C.blue}`
                                            : "2px solid transparent",
                                    }}
                                >
                                    {NavIcons[item]}
                                    {item}
                                    {item === "Dashboard" && liveCount > 0 && (
                                        <span
                                            style={{
                                                marginLeft: "auto",
                                                fontSize: 9,
                                                fontWeight: 700,
                                                background: C.blueLight,
                                                color: C.blue,
                                                border: `1px solid ${C.blueBorder}`,
                                                padding: "1px 6px",
                                                borderRadius: 9999,
                                            }}
                                        >
                                            {liveCount}
                                        </span>
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>
                ))}
            </nav>

            {/* Create CTA */}
            <div style={{ padding: "10px 12px", borderTop: `1px solid ${C.slate100}` }}>
                <div
                    style={{
                        background: `linear-gradient(135deg, ${C.blueLight}, #eef2ff)`,
                        border: `1px solid ${C.blueBorder}`,
                        borderRadius: 10,
                        padding: "12px",
                    }}
                >
                    <p
                        style={{
                            fontSize: 11,
                            color: C.slate500,
                            marginBottom: 8,
                            lineHeight: 1.4,
                        }}
                    >
                        Start selling with a new listing today
                    </p>
                    <Link
                        to="/auction/create"
                        style={{
                            display: "block",
                            textAlign: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "7px 0",
                            borderRadius: 8,
                            color: C.white,
                            textDecoration: "none",
                            background: C.blue,
                        }}
                    >
                        + New Auction
                    </Link>
                </div>
            </div>
        </motion.aside>
    );
}
