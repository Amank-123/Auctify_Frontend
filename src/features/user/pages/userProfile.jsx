import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/shared/services/axios";
import { getMyAuctions, getMyBids, updateUserProfile } from "../userAPI";

/* ── Font injection ─────────────────────────────────────────────── */
if (typeof document !== "undefined" && !document.getElementById("pf-fonts")) {
    const l = document.createElement("link");
    l.id = "pf-fonts";
    l.rel = "stylesheet";
    l.href =
        "https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
}

const TABS = [
    { key: "profile", label: "Profile" },
    { key: "orders", label: "Orders" },
    { key: "bids", label: "Bids" },
    { key: "auctions", label: "Auctions" },
];

const BLUE = "#1A3BDB";
const ORANGE = "#FF6B2C";
const BLUE_LT = "#EEF1FD";

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
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        bio: "",
    });

    useEffect(() => {
        if (User)
            setForm({
                firstName: User.firstName || "",
                lastName: User.lastName || "",
                username: User.username || "",
                email: User.email || "",
                bio: User.bio || "",
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
            const res = await updateUserProfile(fd);
            setUser(res.data.data);
            setSaved(true);
            setTimeout(() => setSaved(false), 2500);
        } catch (e) {
            console.log(e);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Permanently delete your account?")) return;
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
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-8 h-8 rounded-full border-2 border-blue-100 border-t-blue-600 animate-spin" />
            </div>
        );

    return (
        <div className="min-h-screen bg-[#F5F7FF]" style={{ fontFamily: "Inter, sans-serif" }}>
            {/* ── HERO BANNER ─────────────────────────────────────────── */}
            <div
                className="relative overflow-hidden"
                style={{
                    background: `linear-gradient(125deg, #0F28CC 0%, #1A3BDB 45%, #2347E8 100%)`,
                }}
            >
                {/* Background shapes */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* Large blurred circle top-right */}
                    <div
                        className="absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full"
                        style={{ background: "rgba(255,255,255,0.05)", filter: "blur(2px)" }}
                    />
                    {/* Orange glow */}
                    <div
                        className="absolute right-[280px] top-6 w-[160px] h-[160px] rounded-full"
                        style={{ background: `${ORANGE}22`, filter: "blur(40px)" }}
                    />
                    {/* Subtle mesh lines */}
                    <svg
                        className="absolute inset-0 w-full h-full opacity-[0.07]"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path
                                    d="M 40 0 L 0 0 0 40"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="0.5"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                    {/* Bottom fade */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-16"
                        style={{
                            background:
                                "linear-gradient(to bottom, transparent, rgba(15,40,204,0.3))",
                        }}
                    />
                </div>

                <div className="relative max-w-[1200px] mx-auto px-8 pt-10 pb-0">
                    <div className="flex items-end gap-7">
                        {/* Avatar */}
                        <motion.div
                            initial={{ scale: 0.75, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.55, ease: [0.34, 1.4, 0.64, 1] }}
                            className="relative shrink-0 mb-1"
                        >
                            <div
                                className="w-[108px] h-[108px] rounded-[20px] overflow-hidden shadow-2xl"
                                style={{ border: "3px solid rgba(255,255,255,0.25)" }}
                            >
                                <img
                                    src={preview || User?.profile || "/default.png"}
                                    alt="avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Orange online dot */}
                            <span
                                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full shadow-lg"
                                style={{ background: ORANGE, border: `2.5px solid #1A3BDB` }}
                            />
                        </motion.div>

                        {/* Name block */}
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.45, delay: 0.12 }}
                            className="flex-1 pb-8"
                        >
                            <p
                                className="text-[10.5px] tracking-[0.22em] uppercase font-semibold mb-1.5"
                                style={{ color: "rgba(180,200,255,0.9)" }}
                            >
                                {User?.role}
                            </p>
                            <h1
                                className="text-[36px] font-bold text-white leading-none mb-1.5"
                                style={{ fontFamily: "Syne, sans-serif", letterSpacing: "-0.5px" }}
                            >
                                {displayName}
                            </h1>
                            <p
                                className="text-[13.5px]"
                                style={{ color: "rgba(180,200,255,0.85)" }}
                            >
                                {User?.email}
                            </p>
                        </motion.div>

                        {/* Stat pills */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: 0.2 }}
                            className="flex gap-2 mb-8 shrink-0"
                        >
                            {[
                                { label: "Orders", val: counts.orders },
                                { label: "Bids", val: counts.bids },
                                { label: "Auctions", val: counts.auctions },
                            ].map((s, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center justify-center px-7 py-3 rounded-2xl min-w-[88px]"
                                    style={{
                                        background: "rgba(255,255,255,0.12)",
                                        backdropFilter: "blur(12px)",
                                        border: "1px solid rgba(255,255,255,0.15)",
                                    }}
                                >
                                    <span
                                        className="text-[28px] font-bold text-white leading-none"
                                        style={{ fontFamily: "Syne, sans-serif" }}
                                    >
                                        {s.val}
                                    </span>
                                    <span
                                        className="text-[11px] font-medium mt-1"
                                        style={{ color: "rgba(180,200,255,0.85)" }}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Tab bar — sits on bottom edge of hero */}
                    <div className="flex gap-1 mt-1">
                        {TABS.map((t, i) => {
                            const active = tab === t.key;
                            return (
                                <motion.button
                                    key={t.key}
                                    onClick={() => setTab(t.key)}
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.25 + i * 0.05 }}
                                    className="relative px-6 py-3 text-[14px] font-semibold transition-colors duration-150 rounded-t-xl"
                                    style={{
                                        fontFamily: "Syne, sans-serif",
                                        background: active ? "white" : "transparent",
                                        color: active ? BLUE : "rgba(200,215,255,0.85)",
                                    }}
                                >
                                    {t.label}
                                    {/* active indicator dot */}
                                    {active && (
                                        <motion.span
                                            layoutId="tabDot"
                                            className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                                            style={{ background: BLUE }}
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* ── PAGE BODY ────────────────────────────────────────────── */}
            <div className="max-w-[1200px] mx-auto px-8 py-8">
                <AnimatePresence mode="wait">
                    {/* ── PROFILE TAB ─────────────────────────────── */}
                    {tab === "profile" && (
                        <motion.div
                            key="profile"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                            className="grid grid-cols-[300px_1fr] gap-6"
                        >
                            {/* Left column */}
                            <div className="flex flex-col gap-5">
                                {/* Avatar card */}
                                <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(26,59,219,0.07)] border border-blue-50 p-7 flex flex-col items-center text-center">
                                    <div className="relative mb-5">
                                        <img
                                            src={preview || User?.profile || "/default.png"}
                                            alt="avatar"
                                            className="w-24 h-24 rounded-[18px] object-cover shadow-md"
                                            style={{ border: `3px solid ${BLUE_LT}` }}
                                        />
                                        <label
                                            className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl flex items-center justify-center cursor-pointer shadow-lg transition-transform hover:scale-110"
                                            style={{ background: BLUE }}
                                        >
                                            <svg
                                                width="13"
                                                height="13"
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
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => setProfileFile(e.target.files[0])}
                                            />
                                        </label>
                                    </div>
                                    <h3
                                        className="font-bold text-gray-900 text-[16px]"
                                        style={{ fontFamily: "Syne,sans-serif" }}
                                    >
                                        {displayName}
                                    </h3>
                                    <p className="text-gray-400 text-[12.5px] mt-1">
                                        {User?.email}
                                    </p>
                                    <span
                                        className="mt-3 inline-block text-[11px] font-semibold px-3.5 py-1 rounded-full capitalize"
                                        style={{ background: BLUE_LT, color: BLUE }}
                                    >
                                        {User?.role}
                                    </span>
                                    <p className="mt-4 text-[11px] text-gray-300">
                                        JPG or PNG, max 5 MB
                                    </p>
                                </div>

                                {/* Danger zone card */}
                                <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(26,59,219,0.04)] border border-red-100 p-5">
                                    <p className="text-[10.5px] font-bold uppercase tracking-[0.15em] text-red-400 mb-2">
                                        Danger Zone
                                    </p>
                                    <p className="text-[12.5px] text-gray-400 leading-relaxed mb-4">
                                        Deleting your account is permanent and cannot be undone.
                                    </p>
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleteLoading}
                                        className="w-full h-10 rounded-xl text-[13px] font-semibold border transition-all duration-200 hover:bg-red-500 hover:text-white hover:border-red-500"
                                        style={{ borderColor: "#fca5a5", color: "#ef4444" }}
                                    >
                                        {deleteLoading ? "Deleting…" : "Delete Account"}
                                    </button>
                                </div>
                            </div>

                            {/* Right — form */}
                            <div className="bg-white rounded-2xl shadow-[0_2px_20px_rgba(26,59,219,0.07)] border border-blue-50 p-8">
                                {/* Section title */}
                                <div className="flex items-center gap-3 mb-7">
                                    <div
                                        className="w-1 h-7 rounded-full"
                                        style={{ background: BLUE }}
                                    />
                                    <h2
                                        className="text-[21px] font-bold text-gray-900"
                                        style={{ fontFamily: "Syne,sans-serif" }}
                                    >
                                        Personal Information
                                    </h2>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-2 gap-4">
                                        <FField
                                            label="First Name"
                                            name="firstName"
                                            value={form.firstName}
                                            onChange={handleChange}
                                        />
                                        <FField
                                            label="Last Name"
                                            name="lastName"
                                            value={form.lastName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FField
                                            label="Username"
                                            name="username"
                                            value={form.username}
                                            onChange={handleChange}
                                        />
                                        <FField
                                            label="Email Address"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            type="email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-[0.13em] text-gray-400 mb-2">
                                            Bio
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={form.bio}
                                            onChange={handleChange}
                                            rows={4}
                                            placeholder="Write something about yourself…"
                                            className="w-full rounded-xl px-4 py-3 text-[14px] text-gray-800 placeholder:text-gray-300 resize-none transition-all duration-150 outline-none"
                                            style={{
                                                fontFamily: "Inter,sans-serif",
                                                border: "1.5px solid #E8ECF8",
                                                background: "#FAFBFF",
                                            }}
                                            onFocus={(e) => {
                                                e.target.style.borderColor = BLUE;
                                                e.target.style.boxShadow = `0 0 0 3px ${BLUE}18`;
                                            }}
                                            onBlur={(e) => {
                                                e.target.style.borderColor = "#E8ECF8";
                                                e.target.style.boxShadow = "none";
                                            }}
                                        />
                                    </div>

                                    <div className="flex items-center gap-4 pt-1">
                                        <button
                                            type="submit"
                                            className="h-11 px-8 text-white text-[14px] font-semibold rounded-xl transition-all duration-200"
                                            style={{
                                                fontFamily: "Syne,sans-serif",
                                                background: BLUE,
                                                boxShadow: `0 4px 16px ${BLUE}45`,
                                            }}
                                            onMouseEnter={(e) =>
                                                (e.currentTarget.style.transform =
                                                    "translateY(-1px)")
                                            }
                                            onMouseLeave={(e) =>
                                                (e.currentTarget.style.transform = "translateY(0)")
                                            }
                                        >
                                            Save Changes
                                        </button>
                                        <AnimatePresence>
                                            {saved && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-[11px] font-bold">
                                                        ✓
                                                    </span>
                                                    <span className="text-[13px] font-medium text-emerald-600">
                                                        Changes saved
                                                    </span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    )}

                    {/* ── ORDERS TAB ──────────────────────────────── */}
                    {tab === "orders" && (
                        <motion.div
                            key="orders"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                        >
                            <TabRows
                                title="Orders"
                                count={orders.length}
                                loadingData={loadingData}
                                empty="No orders yet"
                            >
                                {orders.map((o, i) => (
                                    <ItemRow
                                        key={o._id}
                                        index={i}
                                        image={o?.auctionId?.media?.[0]}
                                        title={o?.auctionId?.name}
                                        tag={o.orderStatus}
                                        tagVariant="blue"
                                        fields={[
                                            { label: "Final Price", value: `₹${o.finalPrice}` },
                                            { label: "Payment", value: o.paymentStatus },
                                            {
                                                label: "Seller",
                                                value:
                                                    o?.sellerId?.username ||
                                                    o?.sellerId?.email ||
                                                    "N/A",
                                            },
                                        ]}
                                        cta="View Order"
                                        onClick={() => navigate(`/orders/${o._id}`)}
                                    />
                                ))}
                            </TabRows>
                        </motion.div>
                    )}

                    {/* ── BIDS TAB ────────────────────────────────── */}
                    {tab === "bids" && (
                        <motion.div
                            key="bids"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                        >
                            <TabRows
                                title="My Bids"
                                count={bids.length}
                                loadingData={loadingData}
                                empty="No bids placed yet"
                            >
                                {bids.map((b, i) => (
                                    <ItemRow
                                        key={b._id}
                                        index={i}
                                        image={b?.auctionId?.media?.[0]}
                                        title={b?.auctionId?.name}
                                        tag={b?.auctionId?.status}
                                        tagVariant="orange"
                                        fields={[
                                            { label: "Your Bid", value: `₹${b.amount}` },
                                            {
                                                label: "Highest Bid",
                                                value: `₹${b?.auctionId?.currentHighestBid || 0}`,
                                            },
                                            {
                                                label: "Ends",
                                                value: b?.auctionId?.endTime
                                                    ? new Date(
                                                          b.auctionId.endTime,
                                                      ).toLocaleDateString()
                                                    : "N/A",
                                            },
                                        ]}
                                        cta="View Auction"
                                        onClick={() => navigate(`/auction/${b?.auctionId?._id}`)}
                                    />
                                ))}
                            </TabRows>
                        </motion.div>
                    )}

                    {/* ── AUCTIONS TAB ────────────────────────────── */}
                    {tab === "auctions" && (
                        <motion.div
                            key="auctions"
                            initial={{ opacity: 0, y: 14 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.28, ease: "easeOut" }}
                        >
                            <TabRows
                                title="My Auctions"
                                count={auctions.length}
                                loadingData={loadingData}
                                empty="No auctions created"
                            >
                                {auctions.map((a, i) => (
                                    <ItemRow
                                        key={a._id}
                                        index={i}
                                        image={a?.media?.[0]}
                                        title={a?.name}
                                        tag={a.status}
                                        tagVariant="blue"
                                        fields={[
                                            { label: "Starting Price", value: `₹${a.startPrice}` },
                                            {
                                                label: "Highest Bid",
                                                value: `₹${a.currentHighestBid || 0}`,
                                            },
                                            {
                                                label: "Ends",
                                                value: a?.endTime
                                                    ? new Date(a.endTime).toLocaleDateString()
                                                    : "N/A",
                                            },
                                        ]}
                                        cta="Manage"
                                        onClick={() => navigate(`/auction/${a._id}`)}
                                    />
                                ))}
                            </TabRows>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

/* ─── Components ─────────────────────────────────────────────────── */

function FField({ label, name, value, onChange, type = "text" }) {
    const [focused, setFocused] = useState(false);
    return (
        <div>
            <label className="block text-[11px] font-semibold uppercase tracking-[0.13em] text-gray-400 mb-2">
                {label}
            </label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                style={{
                    fontFamily: "Inter,sans-serif",
                    border: `1.5px solid ${focused ? BLUE : "#E8ECF8"}`,
                    boxShadow: focused ? `0 0 0 3px ${BLUE}18` : "none",
                    background: "#FAFBFF",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                }}
                className="h-11 w-full rounded-xl px-4 text-[14px] text-gray-800 outline-none"
            />
        </div>
    );
}

function TabRows({ title, count, loadingData, empty, children }) {
    return (
        <div>
            <div className="flex items-center gap-3 mb-6">
                <h2
                    className="text-[26px] font-bold text-gray-900"
                    style={{ fontFamily: "Syne,sans-serif" }}
                >
                    {title}
                </h2>
                <span
                    className="text-[12px] font-bold px-2.5 py-0.5 rounded-full text-white"
                    style={{ background: BLUE }}
                >
                    {count}
                </span>
            </div>

            {loadingData ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-[100px] rounded-2xl bg-white animate-pulse"
                            style={{ border: "1.5px solid #E8ECF8" }}
                        />
                    ))}
                </div>
            ) : count === 0 ? (
                <div
                    className="py-24 text-center rounded-2xl bg-white"
                    style={{ border: "2px dashed #D6DCFA" }}
                >
                    <div
                        className="w-12 h-12 rounded-2xl mx-auto mb-4"
                        style={{ background: BLUE_LT }}
                    />
                    <p className="text-gray-400 text-[14px]">{empty}</p>
                </div>
            ) : (
                <div className="space-y-3">{children}</div>
            )}
        </div>
    );
}

function ItemRow({ index, image, title, tag, tagVariant, fields, cta, onClick }) {
    const [hovered, setHovered] = useState(false);

    const tagStyle =
        tagVariant === "orange"
            ? { background: "#FFF2EC", color: ORANGE }
            : { background: BLUE_LT, color: BLUE };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, delay: index * 0.045, ease: "easeOut" }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onClick={onClick}
            className="group flex items-center gap-5 p-4 rounded-2xl bg-white cursor-pointer transition-all duration-200"
            style={{
                border: `1.5px solid ${hovered ? `${BLUE}30` : "#EEF0FA"}`,
                boxShadow: hovered ? `0 8px 32px ${BLUE}12` : "0 1px 6px rgba(0,0,0,0.04)",
                transform: hovered ? "translateX(4px)" : "translateX(0)",
            }}
        >
            {/* Thumbnail */}
            <div
                className="w-[76px] h-[76px] rounded-xl overflow-hidden shrink-0"
                style={{ background: BLUE_LT }}
            >
                {image ? (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div
                        className="w-full h-full"
                        style={{
                            background: `linear-gradient(135deg, ${BLUE_LT} 0%, #D6DCFA 100%)`,
                        }}
                    />
                )}
            </div>

            {/* Title + badge */}
            <div className="shrink-0 w-44">
                <p
                    className="text-[14.5px] font-semibold text-gray-900 truncate leading-snug"
                    style={{ fontFamily: "Syne,sans-serif" }}
                >
                    {title || "Untitled"}
                </p>
                {tag && (
                    <span
                        className="inline-block mt-1.5 text-[10.5px] font-semibold px-2.5 py-0.5 rounded-full capitalize"
                        style={tagStyle}
                    >
                        {tag}
                    </span>
                )}
            </div>

            {/* Separator */}
            <div className="w-px h-10 shrink-0 rounded-full" style={{ background: "#EEF0FA" }} />

            {/* Data fields */}
            <div className="flex-1 grid grid-cols-3 gap-3">
                {fields.map((f, i) => (
                    <div key={i}>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-gray-400 mb-0.5">
                            {f.label}
                        </p>
                        <p className="text-[13.5px] font-semibold text-gray-800 capitalize">
                            {f.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Arrow button */}
            <div
                className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                style={{
                    background: hovered ? BLUE : "#F0F2FA",
                }}
            >
                <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={hovered ? "white" : "#9CA3AF"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transition: "stroke 0.2s" }}
                >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                </svg>
            </div>
        </motion.div>
    );
}
