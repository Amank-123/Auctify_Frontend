import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Gavel,
    Trophy,
    Package,
    ShieldCheck,
    Clock3,
    ArrowRight,
    ChevronDown,
    Zap,
    Lock,
    Users,
    TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";

export default function HowItWorksPage() {
    const navigate = useNavigate();
    const [tab, setTab] = useState("buyer");
    const [openFaq, setOpenFaq] = useState(null);
    const heroRef = useRef(null);
    const stepsRef = useRef(null);
    const stepsInView = useInView(stepsRef, { once: true, margin: "-80px" });

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

    const buyerSteps = [
        {
            icon: Search,
            title: "Discover",
            sub: "Browse Auctions",
            desc: "Explore thousands of premium live listings across electronics, fashion, vehicles, watches and more — all in real time.",
            stat: "10K+",
            statLabel: "Active Listings",
        },
        {
            icon: Gavel,
            title: "Compete",
            sub: "Bid in Real Time",
            desc: "Place instant bids, compete live and track every auction update with full transparency. No delays, no hidden activity.",
            stat: "< 1s",
            statLabel: "Bid Latency",
        },
        {
            icon: Trophy,
            title: "Win",
            sub: "Win the Auction",
            desc: "When the countdown ends, the highest bidder wins automatically. Instant confirmation, zero ambiguity.",
            stat: "100%",
            statLabel: "Auto-Confirmed",
        },
        {
            icon: Package,
            title: "Receive",
            sub: "Pay & Receive",
            desc: "Complete payment through our secure gateway and receive your item. Buyer protection on every transaction.",
            stat: "256-bit",
            statLabel: "Encryption",
        },
    ];

    const sellerSteps = [
        {
            icon: Package,
            title: "List",
            sub: "Create Listing",
            desc: "Upload photos, write a detailed description and select your product category in minutes.",
            stat: "2 min",
            statLabel: "Avg. Setup",
        },
        {
            icon: Clock3,
            title: "Configure",
            sub: "Set Auction Rules",
            desc: "Choose your starting price, set the auction duration and define any bidding conditions that fit your needs.",
            stat: "Flexible",
            statLabel: "Duration",
        },
        {
            icon: Gavel,
            title: "Watch",
            sub: "Receive Bids",
            desc: "Sit back as buyers compete live. Bids update in real time and you get notified at every milestone.",
            stat: "Live",
            statLabel: "Bid Alerts",
        },
        {
            icon: Trophy,
            title: "Close",
            sub: "Sell to Winner",
            desc: "The auction closes automatically. The highest bidder wins, you get paid, and the deal is sealed securely.",
            stat: "0%",
            statLabel: "Hidden Fees",
        },
    ];

    const faqs = [
        {
            q: "Is bidding free on Auctify?",
            a: "Yes. Browsing and placing bids is completely free for all users. Charges only apply where our platform policies specifically require, and these are always disclosed upfront before you commit.",
        },
        {
            q: "How is the auction winner selected?",
            a: "The highest valid bid at the exact moment the timer reaches zero wins automatically. Our system handles this instantly with no human intervention, ensuring complete fairness.",
        },
        {
            q: "Can I sell used or pre-owned items?",
            a: "Absolutely. Pre-owned items are welcome as long as they meet our category guidelines and quality standards. We ask sellers to be transparent about condition in their listings.",
        },
        {
            q: "How are sellers verified?",
            a: "Every seller goes through identity verification and account checks before listing. Our moderation team actively reviews listings and monitors for any suspicious activity.",
        },
        {
            q: "Can I cancel a bid once placed?",
            a: "It depends on the specific auction rules and timing. Some auctions treat bids as binding commitments. Always review the auction terms before placing a bid.",
        },
    ];

    const metrics = [
        { value: "50K+", label: "Active Users", icon: Users },
        { value: "99.9%", label: "Uptime SLA", icon: Zap },
        { value: "128+", label: "Countries Reached", icon: TrendingUp },
        { value: "0%", label: "Hidden Fees", icon: Lock },
    ];

    const steps = tab === "buyer" ? buyerSteps : sellerSteps;

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#FAFBFF",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                overflowX: "hidden",
            }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
                body, * { font-family: 'Plus Jakarta Sans', sans-serif !important; }
                .syne { font-family: 'Plus Jakarta Sans', sans-serif !important; font-weight: 800; letter-spacing: -0.03em; }
                .body-text { font-family: 'Inter', sans-serif !important; }
                .faq-item:hover { border-color: rgba(45,71,230,0.25) !important; }
            `}</style>

            {/* ── Announcement bar ── */}
            <div
                style={{
                    background: "#2D47E6",
                    padding: "10px 32px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 28,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <motion.span
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "#4ADE80",
                            display: "block",
                            flexShrink: 0,
                        }}
                    />
                    <span
                        style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "rgba(255,255,255,0.92)",
                            letterSpacing: "0.05em",
                        }}
                    >
                        Real-time Auctions
                    </span>
                </div>
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>|</span>
                <span
                    style={{
                        fontSize: 11,
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.65)",
                        letterSpacing: "0.04em",
                    }}
                >
                    Direct seller-to-buyer
                </span>
                <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 14 }}>|</span>
                <span
                    style={{
                        fontSize: 11,
                        fontWeight: 400,
                        color: "rgba(255,255,255,0.65)",
                        letterSpacing: "0.04em",
                    }}
                >
                    No middleman fees
                </span>
            </div>

            {/* ── HERO ── */}
            <div
                ref={heroRef}
                style={{
                    position: "relative",
                    overflow: "hidden",
                    background: "#F8F8FF",
                    paddingBottom: 0,
                }}
            >
                <motion.div
                    style={{ y: heroY, opacity: heroOpacity }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <div
                        style={{
                            maxWidth: 1280,
                            margin: "0 auto",
                            padding: "100px 32px 120px",
                            position: "relative",
                            zIndex: 2,
                            textAlign: "center",
                        }}
                    >
                        {/* Pill badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -12, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.45, delay: 0.1 }}
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 8,
                                background: "rgba(45,71,230,0.18)",
                                border: "1px solid rgba(45,71,230,0.35)",
                                borderRadius: 100,
                                padding: "6px 16px",
                                marginBottom: 32,
                            }}
                        >
                            <span
                                style={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: "50%",
                                    background: "#7B9EFF",
                                    display: "block",
                                }}
                            />
                            <span
                                style={{
                                    fontSize: 11,
                                    fontWeight: 600,
                                    color: "#7B9EFF",
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                }}
                            >
                                How Auctify Works
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            className="syne"
                            initial={{ opacity: 0, y: 32 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                                fontSize: "clamp(40px, 6vw, 76px)",
                                fontWeight: 800,
                                color: "#000000",
                                letterSpacing: "-0.03em",
                                lineHeight: 1.05,
                                margin: "0 0 28px",
                            }}
                        >
                            Buy Smart.{" "}
                            <span
                                style={{
                                    background: "linear-gradient(135deg, #7B9EFF 0%, #2D47E6 100%)",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                }}
                            >
                                Bid Fast.
                            </span>
                            <br />
                            Win Easy.
                        </motion.h1>

                        {/* Sub */}
                        <motion.p
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.28 }}
                            style={{
                                fontSize: 17,
                                color: "#000000",
                                lineHeight: 1.75,
                                maxWidth: 560,
                                margin: "0 auto 44px",
                                fontWeight: 400,
                            }}
                        >
                            Auctify brings modern, transparent and exciting online auctions to
                            everyone. Discover products, place live bids, or sell directly to real
                            buyers.
                        </motion.p>

                        {/* Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.38 }}
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: 14,
                                flexWrap: "wrap",
                            }}
                        >
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => navigate("/explore")}
                                style={{
                                    height: 50,
                                    padding: "0 32px",
                                    borderRadius: 10,
                                    background: "#2D47E6",
                                    color: "#fff",
                                    border: "none",
                                    fontSize: 14,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    letterSpacing: "0.01em",
                                    boxShadow:
                                        "0 0 0 1px rgba(45,71,230,0.5), 0 8px 24px rgba(45,71,230,0.4)",
                                }}
                            >
                                Explore Auctions
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.1)" }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => navigate("/auction/create")}
                                style={{
                                    height: 50,
                                    padding: "0 32px",
                                    borderRadius: 10,
                                    background: "rgba(255,255,255,0.06)",
                                    color: "#000000",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 8,
                                    backdropFilter: "blur(8px)",
                                }}
                            >
                                Sell an Item <ArrowRight size={15} />
                            </motion.button>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* ── METRICS BAR ── */}
            <div
                style={{
                    background: "#fff",
                    borderBottom: "1px solid #E9ECF5",
                    borderTop: "1px solid #E9ECF5",
                }}
            >
                <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px" }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            borderLeft: "1px solid #E9ECF5",
                        }}
                    >
                        {metrics.map((m, i) => {
                            const Icon = m.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    style={{
                                        padding: "28px 32px",
                                        borderRight: "1px solid #E9ECF5",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 16,
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 10,
                                            background: "rgba(45,71,230,0.08)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <Icon size={18} color="#2D47E6" />
                                    </div>
                                    <div>
                                        <p
                                            style={{
                                                fontSize: 22,
                                                fontWeight: 800,
                                                color: "#0A0E27",
                                                letterSpacing: "-0.03em",
                                                lineHeight: 1,
                                                margin: "0 0 3px",
                                            }}
                                        >
                                            {m.value}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 500,
                                                color: "#9CA3AF",
                                                letterSpacing: "0.05em",
                                                textTransform: "uppercase",
                                                margin: 0,
                                            }}
                                        >
                                            {m.label}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px 100px" }}>
                {/* ── ROLE TABS ── */}
                <div style={{ display: "flex", justifyContent: "center", padding: "72px 0 52px" }}>
                    <div
                        style={{
                            background: "#fff",
                            border: "1px solid #E5E7EB",
                            borderRadius: 12,
                            padding: 5,
                            display: "flex",
                            gap: 4,
                            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                        }}
                    >
                        {["buyer", "seller"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                style={{
                                    height: 42,
                                    padding: "0 32px",
                                    borderRadius: 8,
                                    border: "none",
                                    fontSize: 13,
                                    fontWeight: 700,
                                    cursor: "pointer",
                                    background: tab === t ? "#2D47E6" : "transparent",
                                    color: tab === t ? "#fff" : "#6B7280",
                                    boxShadow:
                                        tab === t ? "0 2px 12px rgba(45,71,230,0.3)" : "none",
                                    transition: "all 0.22s",
                                    letterSpacing: "0.01em",
                                }}
                            >
                                {t === "buyer" ? "For Buyers" : "For Sellers"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── STEPS GRID ── */}
                <div ref={stepsRef}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tab}
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={{ duration: 0.38 }}
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                                gap: 12,
                                marginBottom: 100,
                            }}
                        >
                            {steps.map((item, i) => {
                                const Icon = item.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        className="step-card"
                                        initial={{ opacity: 0, y: 28 }}
                                        animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                                        transition={{
                                            delay: i * 0.09,
                                            duration: 0.5,
                                            ease: [0.16, 1, 0.3, 1],
                                        }}
                                        style={{
                                            background: "#fff",
                                            border: "1px solid #E9ECF5",
                                            borderRadius: 20,
                                            padding: "32px 28px",
                                            position: "relative",
                                            cursor: "default",
                                            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                                            transition:
                                                "box-shadow 0.25s, border-color 0.25s, transform 0.25s",
                                            overflow: "hidden",
                                        }}
                                        whileHover={{
                                            y: -6,
                                            boxShadow: "0 20px 60px rgba(45,71,230,0.13)",
                                            borderColor: "rgba(45,71,230,0.3)",
                                        }}
                                    >
                                        {/* Faded step number background */}
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: -10,
                                                right: 16,
                                                fontSize: 88,
                                                fontWeight: 800,
                                                lineHeight: 1,
                                                color: "rgba(45,71,230,0.04)",
                                                userSelect: "none",
                                                pointerEvents: "none",
                                                letterSpacing: "-0.04em",
                                            }}
                                        >
                                            {i + 1}
                                        </div>

                                        {/* Top row */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "flex-start",
                                                justifyContent: "space-between",
                                                marginBottom: 24,
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: 48,
                                                    height: 48,
                                                    borderRadius: 14,
                                                    background: "rgba(45,71,230,0.08)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Icon size={21} color="#2D47E6" />
                                            </div>
                                            <span
                                                style={{
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    letterSpacing: "0.2em",
                                                    textTransform: "uppercase",
                                                    color: "#CBD5E1",
                                                    background: "#F8FAFF",
                                                    border: "1px solid #E9ECF5",
                                                    padding: "4px 10px",
                                                    borderRadius: 100,
                                                }}
                                            >
                                                Step {String(i + 1).padStart(2, "0")}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3
                                            className="syne"
                                            style={{
                                                fontSize: 20,
                                                fontWeight: 800,
                                                color: "#0A0E27",
                                                letterSpacing: "-0.025em",
                                                margin: "0 0 6px",
                                            }}
                                        >
                                            {item.title}
                                        </h3>
                                        <p
                                            style={{
                                                fontSize: 11,
                                                fontWeight: 600,
                                                color: "#2D47E6",
                                                letterSpacing: "0.08em",
                                                textTransform: "uppercase",
                                                margin: "0 0 14px",
                                            }}
                                        >
                                            {item.sub}
                                        </p>
                                        <p
                                            style={{
                                                fontSize: 13,
                                                color: "#6B7280",
                                                lineHeight: 1.75,
                                                margin: "0 0 24px",
                                                fontWeight: 400,
                                            }}
                                        >
                                            {item.desc}
                                        </p>

                                        {/* Stat chip */}
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 10,
                                                paddingTop: 20,
                                                borderTop: "1px solid #F1F3FA",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    fontSize: 17,
                                                    fontWeight: 800,
                                                    color: "#2D47E6",
                                                    letterSpacing: "-0.02em",
                                                }}
                                            >
                                                {item.stat}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: 11,
                                                    fontWeight: 500,
                                                    color: "#9CA3AF",
                                                }}
                                            >
                                                {item.statLabel}
                                            </span>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ── TRUST SECTION ── */}
                <div style={{ marginBottom: 100 }}>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 2fr",
                            gap: 48,
                            alignItems: "center",
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, x: -24 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.55 }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    marginBottom: 18,
                                }}
                            >
                                <span
                                    style={{
                                        display: "block",
                                        width: 28,
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
                                    Trust & Safety
                                </span>
                            </div>
                            <h2
                                className="syne"
                                style={{
                                    fontSize: "clamp(28px, 3.5vw, 44px)",
                                    fontWeight: 800,
                                    color: "#0A0E27",
                                    letterSpacing: "-0.03em",
                                    lineHeight: 1.1,
                                    margin: "0 0 18px",
                                }}
                            >
                                Why People Trust Auctify
                            </h2>
                            <p
                                style={{
                                    fontSize: 14,
                                    color: "#6B7280",
                                    lineHeight: 1.75,
                                    margin: 0,
                                }}
                            >
                                We've built every layer of Auctify with security and transparency at
                                the core — so you can bid and sell with complete confidence.
                            </p>
                        </motion.div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                            {[
                                {
                                    icon: ShieldCheck,
                                    title: "Verified Sellers",
                                    desc: "Every seller goes through identity checks before listing anything on our platform.",
                                },
                                {
                                    icon: Zap,
                                    title: "Real-time Bidding",
                                    desc: "All bids are visible the instant they're placed. No delays, no hidden activity.",
                                },
                                {
                                    icon: Lock,
                                    title: "Secure Payments",
                                    desc: "Transactions are protected with 256-bit encryption and trusted payment gateways.",
                                },
                                {
                                    icon: Users,
                                    title: "Active Moderation",
                                    desc: "Our team actively monitors listings and resolves disputes to protect every user.",
                                },
                            ].map((pt, i) => {
                                const Icon = pt.icon;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 18 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.09, duration: 0.45 }}
                                        style={{
                                            background: "#fff",
                                            border: "1px solid #E9ECF5",
                                            borderRadius: 16,
                                            padding: "24px 22px",
                                            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                                            transition: "box-shadow 0.2s, border-color 0.2s",
                                        }}
                                        whileHover={{
                                            y: -4,
                                            boxShadow: "0 12px 36px rgba(45,71,230,0.1)",
                                            borderColor: "rgba(45,71,230,0.25)",
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 10,
                                                background: "rgba(45,71,230,0.08)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginBottom: 16,
                                            }}
                                        >
                                            <Icon size={18} color="#2D47E6" />
                                        </div>
                                        <h4
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 800,
                                                color: "#0A0E27",
                                                letterSpacing: "-0.01em",
                                                margin: "0 0 8px",
                                            }}
                                        >
                                            {pt.title}
                                        </h4>
                                        <p
                                            style={{
                                                fontSize: 12,
                                                color: "#9CA3AF",
                                                lineHeight: 1.7,
                                                margin: 0,
                                            }}
                                        >
                                            {pt.desc}
                                        </p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* ── FAQ ── */}
                <div style={{ maxWidth: 740, margin: "0 auto 100px" }}>
                    <div style={{ textAlign: "center", marginBottom: 48 }}>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                                marginBottom: 16,
                            }}
                        >
                            <span
                                style={{
                                    display: "block",
                                    width: 24,
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
                                FAQ
                            </span>
                            <span
                                style={{
                                    display: "block",
                                    width: 24,
                                    height: 2,
                                    background: "#2D47E6",
                                    borderRadius: 2,
                                }}
                            />
                        </div>
                        <h2
                            className="syne"
                            style={{
                                fontSize: "clamp(26px, 3.5vw, 42px)",
                                fontWeight: 800,
                                color: "#0A0E27",
                                letterSpacing: "-0.03em",
                                margin: 0,
                            }}
                        >
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {faqs.map((faq, i) => (
                            <motion.div
                                key={i}
                                className="faq-item"
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.06 }}
                                style={{
                                    background: "#fff",
                                    border: `1px solid ${openFaq === i ? "rgba(45,71,230,0.3)" : "#E9ECF5"}`,
                                    borderRadius: 14,
                                    overflow: "hidden",
                                    boxShadow:
                                        openFaq === i
                                            ? "0 6px 24px rgba(45,71,230,0.09)"
                                            : "0 1px 3px rgba(0,0,0,0.04)",
                                    transition: "border-color 0.2s, box-shadow 0.2s",
                                }}
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    style={{
                                        width: "100%",
                                        padding: "20px 24px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        textAlign: "left",
                                        gap: 16,
                                    }}
                                >
                                    <span
                                        style={{
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color: "#0A0E27",
                                            letterSpacing: "-0.01em",
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        {faq.q}
                                    </span>
                                    <motion.div
                                        animate={{ rotate: openFaq === i ? 180 : 0 }}
                                        transition={{ duration: 0.22 }}
                                        style={{
                                            width: 30,
                                            height: 30,
                                            borderRadius: "50%",
                                            background: openFaq === i ? "#2D47E6" : "#F3F4F6",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <ChevronDown
                                            size={14}
                                            color={openFaq === i ? "#fff" : "#6B7280"}
                                        />
                                    </motion.div>
                                </button>

                                <AnimatePresence>
                                    {openFaq === i && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.28, ease: "easeInOut" }}
                                            style={{ overflow: "hidden" }}
                                        >
                                            <div
                                                style={{
                                                    padding: "0 24px 22px",
                                                    borderTop: "1px solid #F1F3FA",
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        fontSize: 13,
                                                        color: "#6B7280",
                                                        lineHeight: 1.8,
                                                        margin: "16px 0 0",
                                                        fontWeight: 400,
                                                    }}
                                                >
                                                    {faq.a}
                                                </p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
