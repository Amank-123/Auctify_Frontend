import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/shared/services/axios";
import { getMyAuctions, getMyBids, updateUserProfile } from "../userAPI";

/* ── Fonts ─────────────────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("pf-fonts")) {
    const l = document.createElement("link");
    l.id = "pf-fonts";
    l.rel = "stylesheet";
    l.href =
        "https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Inter:wght@400;500;600&display=swap";
    document.head.appendChild(l);
}

/* ── Tokens ─────────────────────────────────────────────────────── */
const B = "#1A3BDB";
const BDK = "#0F28CC";
const BLT = "#EEF1FD";
const BML = "#D6DCFA";
const OR = "#FF6B2C";
const OLT = "#FFF2EC";
const GR = "#111827";
const SB = "#6B7280";
const BD = "#E8ECF8";
const BG = "#F0F2FB";
const WH = "#FFFFFF";

const TABS = [
    { key: "profile", label: "Profile" },
    { key: "orders", label: "Orders" },
    { key: "bids", label: "Bids" },
    { key: "auctions", label: "Auctions" },
];

const fmtDate = (d) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/* ════════════════════════════════════════════════════════════════ */
export default function ProfilePage() {
    const navigate = useNavigate();
    const { User, setUser, logout, Loading } = useAuth();

    const [tab, setTab] = useState("profile");
    const [orders, setOrders] = useState([]);
    const [bids, setBids] = useState([]);
    const [auctions, setAuctions] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [profileFile, setProfileFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [saved, setSaved] = useState(false);
    const [delConfirm, setDelConfirm] = useState(false);
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
    });

    useEffect(() => {
        if (User)
            setForm({
                firstName: User.firstName || "",
                lastName: User.lastName || "",
                username: User.username || "",
                email: User.email || "",
            });
    }, [User]);

    useEffect(() => {
        if (!profileFile) {
            setPreview("");
            return;
        }
        const url = URL.createObjectURL(profileFile);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [profileFile]);

    useEffect(() => {
        (async () => {
            try {
                setLoadingData(true);
                const [b, a, o] = await Promise.all([
                    getMyBids(),
                    getMyAuctions(),
                    api.get("/api/order/my"),
                ]);
                setBids(b?.data || []);
                setAuctions(a?.data || []);
                setOrders(o?.data?.data || []);
            } catch (e) {
                console.log(e);
            } finally {
                setLoadingData(false);
            }
        })();
    }, []);

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (profileFile) fd.append("profile", profileFile);
        try {
            const r = await updateUserProfile(fd);
            setUser(r.data.data);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (e) {
            console.log(e);
        }
    };
    const handleDelete = async () => {
        try {
            setDeleteLoading(true);
            await api.delete("/api/user/delete");
            await logout();
            localStorage.clear();
            navigate("/login");
        } catch (e) {
            console.log(e);
        } finally {
            setDeleteLoading(false);
        }
    };

    const displayName = useMemo(
        () => `${User?.firstName || ""} ${User?.lastName || ""}`.trim() || User?.username,
        [User],
    );
    const counts = { orders: orders.length, bids: bids.length, auctions: auctions.length };

    if (Loading)
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Spin />
            </div>
        );

    return (
        <div style={{ fontFamily: "Inter,sans-serif", background: BG, minHeight: "100vh" }}>
            <style>{`
            #pf-body { padding-bottom: calc(68px + env(safe-area-inset-bottom)); }
            @media (min-width: 640px) { #pf-body { padding-bottom: 0; } }
            #pf-tabbar { display: flex; }
            @media (min-width: 640px) { #pf-tabbar { display: none !important; } }
            #pf-desktoptabs { display: none; }
            @media (min-width: 640px) { #pf-desktoptabs { display: flex; } }
        `}</style>
            <div id="pf-body">
                {/* ══ HERO ══════════════════════════════════════════════════ */}
                <div
                    style={{
                        background: `linear-gradient(145deg, ${BDK} 0%, ${B} 55%, #2B4EF2 100%)`,
                        paddingTop: "20px",
                        paddingLeft: "20px",
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    {/* stat pills */}
                    <div
                        style={{
                            display: "flex",
                            gap: 8,
                            marginBottom: 4,
                            overflowX: "auto",
                            scrollbarWidth: "none",
                        }}
                    >
                        {[
                            { label: "Orders", val: counts.orders },
                            { label: "Bids", val: counts.bids },
                            { label: "Auctions", val: counts.auctions },
                        ].map((s, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    padding: "8px 20px",
                                    borderRadius: 12,
                                    background: "rgba(255,255,255,0.13)",
                                    border: "1px solid rgba(255,255,255,0.16)",
                                    flexShrink: 0,
                                    backdropFilter: "blur(8px)",
                                }}
                            >
                                <span
                                    style={{
                                        fontFamily: "Syne,sans-serif",
                                        fontSize: 22,
                                        fontWeight: 700,
                                        color: WH,
                                        lineHeight: 1,
                                    }}
                                >
                                    {s.val}
                                </span>
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 500,
                                        color: "rgba(180,205,255,0.85)",
                                        marginTop: 3,
                                        letterSpacing: "0.05em",
                                    }}
                                >
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* desktop tab bar (hidden mobile) */}
                    <div id="pf-desktoptabs" style={{ gap: 4, marginTop: 12 }}>
                        {TABS.map((t, i) => {
                            const a = tab === t.key;
                            return (
                                <motion.button
                                    key={t.key}
                                    onClick={() => setTab(t.key)}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + i * 0.04 }}
                                    style={{
                                        position: "relative",
                                        padding: "10px 22px",
                                        border: "none",
                                        borderRadius: "10px 10px 0 0",
                                        cursor: "pointer",
                                        fontFamily: "Syne,sans-serif",
                                        fontSize: 14,
                                        fontWeight: 600,
                                        background: a ? WH : "transparent",
                                        color: a ? B : "rgba(200,215,255,0.85)",
                                        transition: "all 0.15s",
                                    }}
                                >
                                    {t.label}
                                    {a && (
                                        <motion.span
                                            layoutId="dd"
                                            style={{
                                                position: "absolute",
                                                bottom: 7,
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                width: 4,
                                                height: 4,
                                                borderRadius: "50%",
                                                background: B,
                                                display: "block",
                                            }}
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ══ CONTENT ══════════════════════════════════════════════ */}
            <div style={{ maxWidth: 760, margin: "0 auto", padding: "14px 12px 0" }}>
                <AnimatePresence mode="wait">
                    {/* ── PROFILE TAB ─────────────────────────────────── */}
                    {tab === "profile" && (
                        <Fade key="profile">
                            {/* single scrollable form card — no separate avatar card */}
                            <div
                                style={{
                                    background: WH,
                                    borderRadius: 20,
                                    border: `1.5px solid ${BD}`,
                                    boxShadow: "0 2px 16px rgba(26,59,219,0.07)",
                                    overflow: "hidden",
                                }}
                            >
                                {/* avatar section — horizontal compact */}
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 14,
                                        padding: "16px 16px 14px",
                                        borderBottom: `1.5px solid ${BD}`,
                                    }}
                                >
                                    <div style={{ position: "relative", flexShrink: 0 }}>
                                        <img
                                            src={preview || User?.profile || "/default.png"}
                                            alt="avatar"
                                            style={{
                                                width: 60,
                                                height: 60,
                                                borderRadius: 14,
                                                objectFit: "cover",
                                                border: `2px solid ${BLT}`,
                                            }}
                                        />
                                        <label
                                            style={{
                                                position: "absolute",
                                                bottom: -6,
                                                right: -6,
                                                width: 24,
                                                height: 24,
                                                borderRadius: 8,
                                                background: B,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                boxShadow: `0 3px 8px ${B}55`,
                                            }}
                                        >
                                            <IcUpload />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                style={{ display: "none" }}
                                                onChange={(e) => setProfileFile(e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p
                                            style={{
                                                fontFamily: "Syne,sans-serif",
                                                fontWeight: 700,
                                                fontSize: 15,
                                                color: GR,
                                                margin: 0,
                                            }}
                                        >
                                            {displayName}
                                        </p>
                                        <p style={{ fontSize: 12, color: SB, marginTop: 2 }}>
                                            {User?.email}
                                        </p>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: 11,
                                            fontWeight: 600,
                                            padding: "4px 12px",
                                            borderRadius: 20,
                                            background: BLT,
                                            color: B,
                                            textTransform: "capitalize",
                                            flexShrink: 0,
                                        }}
                                    >
                                        {User?.role}
                                    </span>
                                </div>

                                {/* form body */}
                                <form onSubmit={handleSubmit} style={{ padding: "16px" }}>
                                    <p
                                        style={{
                                            fontSize: 10,
                                            fontWeight: 700,
                                            letterSpacing: "0.18em",
                                            textTransform: "uppercase",
                                            color: SB,
                                            marginBottom: 14,
                                        }}
                                    >
                                        Personal Information
                                    </p>

                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: 10,
                                            marginBottom: 10,
                                        }}
                                    >
                                        <Fld
                                            label="First Name"
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleChange}
                                        />
                                        <Fld
                                            label="Last Name"
                                            name="lastName"
                                            value={form.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "1fr 1fr",
                                            gap: 10,
                                            marginBottom: 10,
                                        }}
                                    >
                                        <Fld
                                            label="Username"
                                            name="username"
                                            value={form.username}
                                            onChange={handleChange}
                                        />
                                        <Fld
                                            label="Email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            type="email"
                                        />
                                    </div>
                                    <div style={{ marginBottom: 16 }}>
                                        <label style={lbStyle}>Bio</label>
                                        <textarea
                                            name="bio"
                                            value={form.bio}
                                            onChange={handleChange}
                                            rows={3}
                                            placeholder="Something about you…"
                                            style={{
                                                width: "100%",
                                                borderRadius: 10,
                                                padding: "10px 12px",
                                                fontSize: 14,
                                                color: GR,
                                                border: `1.5px solid ${BD}`,
                                                background: "#FAFBFF",
                                                resize: "none",
                                                outline: "none",
                                                fontFamily: "Inter,sans-serif",
                                                boxSizing: "border-box",
                                                transition: "border-color 0.15s,box-shadow 0.15s",
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = B;
                                                e.target.style.boxShadow = `0 0 0 3px ${B}18`;
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = BD;
                                                e.target.style.boxShadow = "none";
                                            }}
                                        />
                                    </div>

                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 10,
                                        }}
                                    >
                                        <button
                                            type="submit"
                                            style={{
                                                height: 42,
                                                padding: "0 24px",
                                                borderRadius: 11,
                                                border: "none",
                                                background: B,
                                                color: WH,
                                                fontSize: 14,
                                                fontWeight: 600,
                                                fontFamily: "Syne,sans-serif",
                                                cursor: "pointer",
                                                boxShadow: `0 4px 14px ${B}40`,
                                                flexShrink: 0,
                                            }}
                                        >
                                            Save Changes
                                        </button>
                                        <AnimatePresence>
                                            {saved && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -6 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 6,
                                                        fontSize: 13,
                                                        fontWeight: 500,
                                                        color: "#059669",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            width: 18,
                                                            height: 18,
                                                            borderRadius: "50%",
                                                            background: "#D1FAE5",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: 10,
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        ✓
                                                    </span>
                                                    Saved!
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </form>

                                {/* danger zone — inline at bottom */}
                                <div
                                    style={{
                                        margin: "0 16px 16px",
                                        padding: "12px 14px",
                                        borderRadius: 12,
                                        background: "#FFF8F8",
                                        border: "1.5px solid #FFE4E4",
                                    }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 12,
                                            flexWrap: "wrap",
                                        }}
                                    >
                                        <div>
                                            <p
                                                style={{
                                                    fontSize: 10,
                                                    fontWeight: 700,
                                                    letterSpacing: "0.15em",
                                                    textTransform: "uppercase",
                                                    color: "#F87171",
                                                    marginBottom: 3,
                                                }}
                                            >
                                                Danger Zone
                                            </p>
                                            <p
                                                style={{
                                                    fontSize: 12,
                                                    color: SB,
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                This action is permanent and cannot be undone.
                                            </p>
                                        </div>
                                        {!delConfirm ? (
                                            <button
                                                onClick={() => setDelConfirm(true)}
                                                style={{
                                                    height: 36,
                                                    padding: "0 16px",
                                                    borderRadius: 9,
                                                    border: "1.5px solid #FCA5A5",
                                                    background: "transparent",
                                                    color: "#EF4444",
                                                    fontSize: 12,
                                                    fontWeight: 600,
                                                    cursor: "pointer",
                                                    flexShrink: 0,
                                                }}
                                            >
                                                Delete Account
                                            </button>
                                        ) : (
                                            <div style={{ display: "flex", gap: 8 }}>
                                                <button
                                                    onClick={() => setDelConfirm(false)}
                                                    style={{
                                                        height: 36,
                                                        padding: "0 14px",
                                                        borderRadius: 9,
                                                        border: `1.5px solid ${BD}`,
                                                        background: WH,
                                                        color: SB,
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleDelete}
                                                    disabled={deleteLoading}
                                                    style={{
                                                        height: 36,
                                                        padding: "0 14px",
                                                        borderRadius: 9,
                                                        border: "none",
                                                        background: "#EF4444",
                                                        color: WH,
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {deleteLoading ? "…" : "Confirm"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Fade>
                    )}

                    {/* ── ORDERS TAB ──────────────────────────────────── */}
                    {tab === "orders" && (
                        <Fade key="orders">
                            <SecHead title="Orders" count={counts.orders} />
                            {loadingData ? (
                                <Skel />
                            ) : counts.orders === 0 ? (
                                <Empty icon="🛍" label="No orders yet" />
                            ) : (
                                <List>
                                    {orders.map((o, i) => (
                                        <ACard
                                            key={o._id}
                                            index={i}
                                            image={o?.auctionId?.media?.flat()[0]}
                                            title={o?.auctionId?.name}
                                            badge={o.orderStatus}
                                            badgeColor="blue"
                                            rows={[
                                                ["Final Price", `₹${o.finalPrice}`],
                                                ["Payment", o.paymentStatus],
                                                [
                                                    "Seller",
                                                    o?.sellerId?.username ||
                                                        o?.sellerId?.email ||
                                                        "N/A",
                                                ],
                                            ]}
                                            cta="View Order"
                                            onClick={() => navigate(`/orders/${o._id}`)}
                                        />
                                    ))}
                                </List>
                            )}
                        </Fade>
                    )}

                    {/* ── BIDS TAB ────────────────────────────────────── */}
                    {tab === "bids" && (
                        <Fade key="bids">
                            <SecHead title="My Bids" count={counts.bids} />
                            {loadingData ? (
                                <Skel />
                            ) : counts.bids === 0 ? (
                                <Empty icon="📈" label="No bids placed yet" />
                            ) : (
                                <List>
                                    {bids.map((b, i) => {
                                        const leading =
                                            b.amount >= (b?.auctionId?.currentHighestBid || 0);
                                        return (
                                            <ACard
                                                key={b._id}
                                                index={i}
                                                image={b?.auctionId?.media?.[0]}
                                                title={b?.auctionId?.name}
                                                badge={b?.auctionId?.status}
                                                badgeColor="orange"
                                                extraBadge={
                                                    leading
                                                        ? {
                                                              label: "Leading ↑",
                                                              bg: "#D1FAE5",
                                                              color: "#059669",
                                                          }
                                                        : null
                                                }
                                                rows={[
                                                    ["Your Bid", `₹${b.amount}`],
                                                    [
                                                        "Highest",
                                                        `₹${b?.auctionId?.currentHighestBid || 0}`,
                                                    ],
                                                    [
                                                        "Ends",
                                                        b?.auctionId?.endTime
                                                            ? fmtDate(b.auctionId.endTime)
                                                            : "N/A",
                                                    ],
                                                ]}
                                                cta="View Auction"
                                                onClick={() =>
                                                    navigate(`/auction/${b?.auctionId?._id}`)
                                                }
                                            />
                                        );
                                    })}
                                </List>
                            )}
                        </Fade>
                    )}

                    {/* ── AUCTIONS TAB ────────────────────────────────── */}
                    {tab === "auctions" && (
                        <Fade key="auctions">
                            <SecHead title="My Auctions" count={counts.auctions} />
                            {loadingData ? (
                                <Skel />
                            ) : counts.auctions === 0 ? (
                                <Empty icon="🏷" label="No auctions created" />
                            ) : (
                                <List>
                                    {auctions.map((a, i) => (
                                        <ACard
                                            key={a._id}
                                            index={i}
                                            image={a?.media?.flat()[0]}
                                            title={a?.name}
                                            badge={a.status}
                                            badgeColor="blue"
                                            rows={[
                                                ["Start Price", `₹${a.startPrice}`],
                                                ["Highest Bid", `₹${a.currentHighestBid || 0}`],
                                                ["Ends", a?.endTime ? fmtDate(a.endTime) : "N/A"],
                                            ]}
                                            cta="Manage"
                                            onClick={() => navigate(`/auction/${a._id}`)}
                                        />
                                    ))}
                                </List>
                            )}
                        </Fade>
                    )}
                </AnimatePresence>
            </div>

            {/* ══ MOBILE BOTTOM TAB BAR — truly fixed, no Tailwind ════ */}
            <div
                id="pf-tabbar"
                style={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 9999,
                    background: WH,
                    borderTop: `1px solid ${BD}`,
                    boxShadow: "0 -4px 20px rgba(26,59,219,0.09)",
                    paddingBottom: "env(safe-area-inset-bottom)",
                }}
            >
                {TABS.map((t) => {
                    const a = tab === t.key;
                    return (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 4,
                                padding: "10px 4px",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                minHeight: 56,
                                WebkitTapHighlightColor: "transparent",
                                position: "relative",
                            }}
                        >
                            {a && (
                                <motion.div
                                    layoutId="mbl"
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: "20%",
                                        right: "20%",
                                        height: 2.5,
                                        borderRadius: 2,
                                        background: B,
                                    }}
                                />
                            )}
                            <TabIco name={t.key} active={a} />
                            <span
                                style={{
                                    fontSize: 10,
                                    fontWeight: a ? 600 : 500,
                                    color: a ? B : "#9CA3AF",
                                    letterSpacing: "0.01em",
                                }}
                            >
                                {t.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* ════════════════════════════════════════════════════════════════
   ACTION CARD — different layout mobile vs desktop
═══════════════════════════════════════════════════════════════════ */
function ACard({ index, image, title, badge, badgeColor, extraBadge, rows, cta, onClick }) {
    const [hov, setHov] = useState(false);

    const badgeStyle =
        badgeColor === "orange" ? { background: OLT, color: OR } : { background: BLT, color: B };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.04 }}
            onClick={onClick}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
            style={{
                background: WH,
                borderRadius: 16,
                overflow: "hidden",
                border: `1.5px solid ${hov ? `${B}28` : BD}`,
                boxShadow: hov ? "0 6px 24px rgba(26,59,219,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
                cursor: "pointer",
                transition: "all 0.18s",
                transform: hov ? "translateY(-1px)" : "none",
            }}
        >
            {/* ── Mobile: card layout ── */}
            <div className="sm:hidden">
                <div style={{ display: "flex", gap: 12, padding: "12px 12px 10px" }}>
                    {/* thumb */}
                    <div
                        style={{
                            width: 56,
                            height: 56,
                            borderRadius: 12,
                            overflow: "hidden",
                            flexShrink: 0,
                            background: BLT,
                        }}
                    >
                        {image ? (
                            <img
                                src={image}
                                alt={title}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    background: `linear-gradient(135deg,${BLT},${BML})`,
                                }}
                            />
                        )}
                    </div>
                    {/* title + badges */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                            style={{
                                fontFamily: "Syne,sans-serif",
                                fontWeight: 700,
                                fontSize: 14,
                                color: GR,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                marginBottom: 6,
                            }}
                        >
                            {title || "Untitled"}
                        </p>
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                            {badge && (
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: "2px 9px",
                                        borderRadius: 20,
                                        textTransform: "capitalize",
                                        ...badgeStyle,
                                    }}
                                >
                                    {badge}
                                </span>
                            )}
                            {extraBadge && (
                                <span
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 700,
                                        padding: "2px 9px",
                                        borderRadius: 20,
                                        background: extraBadge.bg,
                                        color: extraBadge.color,
                                    }}
                                >
                                    {extraBadge.label}
                                </span>
                            )}
                        </div>
                    </div>
                    {/* arrow */}
                    <div
                        style={{
                            flexShrink: 0,
                            width: 30,
                            height: 30,
                            borderRadius: 9,
                            background: hov ? B : BLT,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "background 0.15s",
                            alignSelf: "center",
                        }}
                    >
                        <IcArr color={hov ? WH : B} />
                    </div>
                </div>

                {/* stats row */}
                <div style={{ display: "flex", borderTop: `1px solid ${BD}` }}>
                    {rows.map(([lbl, val], i) => (
                        <div
                            key={i}
                            style={{
                                flex: 1,
                                padding: "8px 0 8px 12px",
                                borderRight: i < rows.length - 1 ? `1px solid ${BD}` : "none",
                            }}
                        >
                            <p
                                style={{
                                    fontSize: 9,
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    color: SB,
                                    marginBottom: 2,
                                }}
                            >
                                {lbl}
                            </p>
                            <p
                                style={{
                                    fontSize: 12.5,
                                    fontWeight: 600,
                                    color: GR,
                                    textTransform: "capitalize",
                                }}
                            >
                                {val}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Desktop: row layout ── */}
            <div className="hidden sm:flex" style={{ alignItems: "center", gap: 14, padding: 14 }}>
                <div
                    style={{
                        width: 68,
                        height: 68,
                        borderRadius: 12,
                        overflow: "hidden",
                        flexShrink: 0,
                        background: BLT,
                    }}
                >
                    {image ? (
                        <img
                            src={image}
                            alt={title}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                height: "100%",
                                background: `linear-gradient(135deg,${BLT},${BML})`,
                            }}
                        />
                    )}
                </div>
                <div style={{ flexShrink: 0, width: 150 }}>
                    <p
                        style={{
                            fontFamily: "Syne,sans-serif",
                            fontWeight: 600,
                            fontSize: 14,
                            color: GR,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            marginBottom: 6,
                        }}
                    >
                        {title || "Untitled"}
                    </p>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {badge && (
                            <span
                                style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    padding: "2px 9px",
                                    borderRadius: 20,
                                    textTransform: "capitalize",
                                    ...badgeStyle,
                                }}
                            >
                                {badge}
                            </span>
                        )}
                        {extraBadge && (
                            <span
                                style={{
                                    fontSize: 10,
                                    fontWeight: 700,
                                    padding: "2px 9px",
                                    borderRadius: 20,
                                    background: extraBadge.bg,
                                    color: extraBadge.color,
                                }}
                            >
                                {extraBadge.label}
                            </span>
                        )}
                    </div>
                </div>
                <div style={{ width: 1, height: 40, background: BD, flexShrink: 0 }} />
                <div
                    style={{
                        flex: 1,
                        display: "grid",
                        gridTemplateColumns: "repeat(3,1fr)",
                        gap: "0 8px",
                    }}
                >
                    {rows.map(([lbl, val], i) => (
                        <div key={i}>
                            <p
                                style={{
                                    fontSize: 10,
                                    fontWeight: 600,
                                    textTransform: "uppercase",
                                    letterSpacing: "0.1em",
                                    color: SB,
                                    marginBottom: 2,
                                }}
                            >
                                {lbl}
                            </p>
                            <p
                                style={{
                                    fontSize: 13,
                                    fontWeight: 600,
                                    color: GR,
                                    textTransform: "capitalize",
                                }}
                            >
                                {val}
                            </p>
                        </div>
                    ))}
                </div>
                <div
                    style={{
                        flexShrink: 0,
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background: hov ? B : BLT,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "background 0.15s",
                    }}
                >
                    <IcArr color={hov ? WH : B} />
                </div>
            </div>
        </motion.div>
    );
}

/* ════════════════════════════════════════════════════════════════
   SMALL REUSABLES
═══════════════════════════════════════════════════════════════════ */
const lbStyle = {
    display: "block",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: "0.13em",
    textTransform: "uppercase",
    color: SB,
    marginBottom: 6,
};

function Fld({ label, name, value, onChange, type = "text" }) {
    const [f, setF] = useState(false);
    return (
        <div>
            <label style={lbStyle}>{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setF(true)}
                onBlur={() => setF(false)}
                style={{
                    height: 42,
                    width: "100%",
                    borderRadius: 10,
                    padding: "0 12px",
                    fontSize: 16,
                    color: GR,
                    border: `1.5px solid ${f ? B : BD}`,
                    boxShadow: f ? `0 0 0 3px ${B}18` : "none",
                    background: "#FAFBFF",
                    outline: "none",
                    fontFamily: "Inter,sans-serif",
                    boxSizing: "border-box",
                    transition: "border-color 0.15s,box-shadow 0.15s",
                }}
            />
        </div>
    );
}

function Fade({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
        >
            {children}
        </motion.div>
    );
}

function SecHead({ title, count }) {
    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <h2
                style={{
                    fontFamily: "Syne,sans-serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: GR,
                    margin: 0,
                }}
            >
                {title}
            </h2>
            <span
                style={{
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 9px",
                    borderRadius: 20,
                    background: B,
                    color: WH,
                }}
            >
                {count}
            </span>
        </div>
    );
}

function List({ children }) {
    return <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>;
}

function Skel() {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1, 2, 3].map((i) => (
                <div
                    key={i}
                    style={{
                        height: 90,
                        borderRadius: 16,
                        background: WH,
                        border: `1.5px solid ${BD}`,
                        opacity: 0.6,
                        animation: "pu 1.4s ease-in-out infinite",
                    }}
                >
                    <style>{`@keyframes pu{0%,100%{opacity:.6}50%{opacity:.3}}`}</style>
                </div>
            ))}
        </div>
    );
}

function Empty({ icon, label }) {
    return (
        <div
            style={{
                textAlign: "center",
                padding: "44px 20px",
                background: WH,
                borderRadius: 18,
                border: `2px dashed ${BML}`,
            }}
        >
            <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
            <p style={{ fontSize: 14, color: SB }}>{label}</p>
        </div>
    );
}

function Spin() {
    return (
        <div
            style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                border: `2px solid ${BLT}`,
                borderTopColor: B,
                animation: "sp 0.7s linear infinite",
            }}
        >
            <style>{`@keyframes sp{to{transform:rotate(360deg)}}`}</style>
        </div>
    );
}

/* ── Icons ─────────────────────────────────────────────────────── */
function IcArr({ color = B }) {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </svg>
    );
}
function IcUpload() {
    return (
        <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
    );
}
function TabIco({ name, active }) {
    const c = active ? B : "#9CA3AF";
    const sw = 1.9;
    if (name === "profile")
        return (
            <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke={c}
                strokeWidth={sw}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
        );
    if (name === "orders")
        return (
            <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke={c}
                strokeWidth={sw}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M9 8h6M9 12h6M9 16h4" />
            </svg>
        );
    if (name === "bids")
        return (
            <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke={c}
                strokeWidth={sw}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                <polyline points="16 7 22 7 22 13" />
            </svg>
        );
    if (name === "auctions")
        return (
            <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke={c}
                strokeWidth={sw}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M15 3l6 6-10 10-6-6z" />
                <path d="M3 21l4-4" />
                <line x1="9.5" y1="9.5" x2="14.5" y2="14.5" />
            </svg>
        );
    return null;
}
