import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import defaultUp from "@/assets/default.png";
import { getMyAuctions, getMyBids, myOrders, updateUserProfile } from "../userAPI";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
    { key: "info", label: "My Profile" },
    { key: "overview", label: "Overview" },
    { key: "orders", label: "My Orders" },
    { key: "bids", label: "My Bids" },
    { key: "auctions", label: "My Auctions" },
];

const fadeUp = {
    hidden: { opacity: 0, y: 14 },
    show: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] },
    }),
};

/* ── Icons ── */
const PencilIcon = () => (
    <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
);

const XIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
    >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
);

const UploadIcon = () => (
    <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
);

export default function Profile() {
    const { Loading, User, setUser } = useAuth();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("info");
    const [editSection, setEditSection] = useState(null);
    const [form, setForm] = useState({});
    const [profileFile, setProfileFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [preview, setPreview] = useState("");
    const [bids, setBids] = useState([]);
    const [auctions, setAuctions] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [bidsRes, auctionsRes, ordersRes] = await Promise.all([
                    getMyBids(),
                    getMyAuctions(),
                    myOrders(),
                ]);

                setBids(bidsRes?.data || []);
                setAuctions(auctionsRes?.data || []);
                setOrders(ordersRes || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingData(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (User) setForm(User);
    }, [User]);

    useEffect(() => {
        if (!profileFile) return setPreview("");
        const url = URL.createObjectURL(profileFile);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [profileFile]);

    const displayName = useMemo(
        () => `${User?.firstName || ""} ${User?.lastName || ""}`.trim() || User?.username,
        [User],
    );

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleAddressChange = (e) =>
        setForm((p) => ({ ...p, address: { ...p.address, [e.target.name]: e.target.value } }));

    const buildFormData = (form, file) => {
        const fd = new FormData();
        ["username", "email", "firstName", "lastName"].forEach((k) => {
            if (form[k] !== undefined && form[k] !== null) fd.append(k, form[k]);
        });
        if (form.address) fd.append("address", JSON.stringify(form.address));
        if (file) fd.append("profile", file);
        return fd;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setErrors({});
            const res = await updateUserProfile(buildFormData(form, profileFile));
            setUser(res.data);
            setEditSection(null);
        } catch (err) {
            console.error(err);
            const backendErrors = err?.response?.data?.errors;
            if (backendErrors?.length) {
                const mappedErrors = {};
                backendErrors.forEach((error) => {
                    const key = error.path?.[error.path.length - 1];
                    if (key) mappedErrors[key] = error.message;
                });
                setErrors(mappedErrors);
                return;
            }
            setErrors({ general: err?.response?.data?.message || "Something went wrong" });
        }
    };

    if (Loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-white rounded-2xl border border-gray-200 px-8 py-5 shadow flex items-center gap-3">
                    <div className="h-4 w-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
                    <span className="text-sm font-medium text-gray-600">Loading profile…</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ── Mobile: heading + underline tab bar ── */}
            <div className="md:hidden bg-white border-b border-gray-200">
                {/* Page heading */}
                <div className="px-4 pt-4 pb-2">
                    <h1 className="text-lg font-bold text-gray-900 tracking-tight">
                        Profile Settings
                    </h1>
                </div>

                {/* Underline tab bar */}
                <style>{`.mobile-tabs::-webkit-scrollbar { display: none; }`}</style>
                <div
                    className="mobile-tabs flex overflow-x-auto"
                    style={{ scrollbarWidth: "none" }}
                >
                    {NAV_ITEMS.map(({ key, label }) => {
                        const isActive = activeTab === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setActiveTab(key)}
                                className="relative flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors duration-150 whitespace-nowrap"
                                style={{ color: isActive ? "#2563eb" : "#9ca3af" }}
                            >
                                {label}
                                {isActive && (
                                    <motion.span
                                        layoutId="mobile-tab-underline"
                                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-600"
                                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* ── Page layout ── */}
            <div className="px-4 py-4 md:px-10 md:py-8">
                <h1 className="hidden md:block text-xl font-semibold text-gray-900 mb-6 max-w-6xl mx-auto">
                    Account Settings
                </h1>

                <div className="max-w-6xl mx-auto flex gap-8 items-start">
                    {/* ── Desktop sidebar ── */}
                    <motion.aside
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="hidden md:block w-48 flex-shrink-0"
                    >
                        <nav className="flex flex-col gap-0.5">
                            {NAV_ITEMS.map(({ key, label }) => {
                                const isActive = activeTab === key;
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={`relative text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                                            ${
                                                isActive
                                                    ? "text-blue-600 bg-blue-50"
                                                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                                            }`}
                                    >
                                        {isActive && (
                                            <motion.span
                                                layoutId="nav-pill"
                                                className="absolute inset-0 bg-blue-50 rounded-xl -z-10"
                                                transition={{
                                                    type: "spring",
                                                    stiffness: 400,
                                                    damping: 32,
                                                }}
                                            />
                                        )}
                                        {label}
                                    </button>
                                );
                            })}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <button className="text-left px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-colors">
                                    Delete Account
                                </button>
                            </div>
                        </nav>
                    </motion.aside>

                    {/* ── Main content ── */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                                className="space-y-4"
                            >
                                {/* ── MY PROFILE TAB ── */}
                                {activeTab === "info" && (
                                    <>
                                        <p className="hidden md:block text-base font-semibold text-gray-900 mb-4">
                                            My Profile
                                        </p>

                                        {/* Profile card */}
                                        <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 md:gap-4">
                                                    <img
                                                        src={User?.profile || defaultUp}
                                                        className="h-12 w-12 md:h-14 md:w-14 rounded-full object-cover ring-2 ring-gray-100"
                                                    />
                                                    <div>
                                                        <p className="text-sm md:text-base font-semibold text-gray-900">
                                                            {displayName}
                                                        </p>
                                                        <p className="text-xs md:text-sm text-gray-400 mt-0.5">
                                                            {[
                                                                User?.address?.city,
                                                                User?.address?.country,
                                                            ]
                                                                .filter(Boolean)
                                                                .join(", ") || "No location set"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <EditBtn
                                                    onClick={() => setEditSection("profile")}
                                                />
                                            </div>
                                        </div>

                                        {/* Personal Information card */}
                                        <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
                                            <div className="flex items-center justify-between mb-4 md:mb-5">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    Personal Information
                                                </p>
                                                <EditBtn
                                                    onClick={() => setEditSection("personal")}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 md:gap-y-5">
                                                <InfoField
                                                    label="First Name"
                                                    value={User?.firstName}
                                                />
                                                <InfoField
                                                    label="Last Name"
                                                    value={User?.lastName}
                                                />
                                                <InfoField
                                                    label="Email Address"
                                                    value={User?.email}
                                                />
                                                <InfoField
                                                    label="Username"
                                                    value={`@${User?.username}`}
                                                />
                                                <InfoField
                                                    label="Account Status"
                                                    value={User?.status || "Active"}
                                                    valueClass="text-emerald-600 font-semibold"
                                                />
                                            </div>
                                        </div>

                                        {/* Address card */}
                                        <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
                                            <div className="flex items-center justify-between mb-4 md:mb-5">
                                                <p className="text-sm font-semibold text-gray-800">
                                                    Address
                                                </p>
                                                <EditBtn
                                                    onClick={() => setEditSection("address")}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 md:gap-y-5">
                                                <InfoField
                                                    label="Country"
                                                    value={User?.address?.country}
                                                />
                                                <InfoField
                                                    label="City / State"
                                                    value={[
                                                        User?.address?.city,
                                                        User?.address?.state,
                                                    ]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                />
                                                <InfoField
                                                    label="Street"
                                                    value={User?.address?.street}
                                                />
                                                <InfoField
                                                    label="Postal Code"
                                                    value={User?.address?.pin}
                                                />
                                            </div>
                                        </div>

                                        {/* Meta + delete */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5">
                                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                                                    Member Since
                                                </p>
                                                <p className="text-sm font-semibold text-gray-800">
                                                    {User?.createdAt
                                                        ? new Date(
                                                              User.createdAt,
                                                          ).toLocaleDateString("en-GB", {
                                                              day: "numeric",
                                                              month: "long",
                                                              year: "numeric",
                                                          })
                                                        : "—"}
                                                </p>
                                            </div>
                                            <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-5">
                                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                                                    Verified
                                                </p>
                                                <p
                                                    className={`text-sm font-semibold ${User?.isVerified ? "text-emerald-600" : "text-red-500"}`}
                                                >
                                                    {User?.isVerified
                                                        ? "Verified Account"
                                                        : "Not Verified"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Mobile-only delete account */}
                                        <div className="md:hidden">
                                            <button className="w-full text-center py-3 rounded-2xl border border-red-100 bg-red-50 text-sm font-medium text-red-500 hover:bg-red-100 transition-colors">
                                                Delete Account
                                            </button>
                                        </div>
                                    </>
                                )}

                                {/* ── OVERVIEW TAB ── */}
                                {activeTab === "overview" && (
                                    <>
                                        <p className="hidden md:block text-base font-semibold text-gray-900 mb-4">
                                            Overview
                                        </p>
                                        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4">
                                            {[
                                                {
                                                    label: "Total Auctions",
                                                    val: User?.auctionCount || 0,
                                                },
                                                { label: "Total Bids", val: User?.bidCount || 0 },
                                                { label: "Status", val: User?.status || "Active" },
                                            ].map((s, i) => (
                                                <motion.div
                                                    key={s.label}
                                                    variants={fadeUp}
                                                    custom={i}
                                                    initial="hidden"
                                                    animate="show"
                                                    className="bg-white rounded-2xl border border-gray-200 p-3 md:p-5"
                                                >
                                                    <p className="text-xl md:text-2xl font-bold text-blue-600">
                                                        {s.val}
                                                    </p>
                                                    <p className="text-[10px] md:text-xs text-gray-400 font-medium mt-1 uppercase tracking-wider leading-tight">
                                                        {s.label}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                        <div className="bg-white rounded-2xl border border-gray-200 p-4 md:p-6">
                                            <p className="text-sm font-semibold text-gray-800 mb-4">
                                                Recent Bids
                                            </p>
                                            {loadingData ? (
                                                <Skeleton />
                                            ) : bids.length === 0 ? (
                                                <Empty msg="No recent activity" />
                                            ) : (
                                                bids.slice(0, 3).map((bid, i) => (
                                                    <motion.div
                                                        key={bid._id}
                                                        variants={fadeUp}
                                                        custom={i}
                                                        initial="hidden"
                                                        animate="show"
                                                        className="flex items-center justify-between py-3.5 border-b border-gray-100 last:border-0"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800">
                                                                {bid.auction?.title}
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-0.5">
                                                                Recent bid
                                                            </p>
                                                        </div>
                                                        <span className="text-sm font-bold text-blue-600">
                                                            ₹{bid.amount}
                                                        </span>
                                                    </motion.div>
                                                ))
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* ── ORDERS TAB ── */}
                                {activeTab === "orders" && (
                                    <>
                                        <p className="hidden md:block text-base font-semibold text-gray-900 mb-4">
                                            My Orders
                                        </p>

                                        {loadingData ? (
                                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                                <Skeleton />
                                            </div>
                                        ) : orders.length === 0 ? (
                                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                                <Empty msg="No orders found" />
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {orders.map((order, i) => {
                                                    const auction = order?.auctionId;

                                                    const image =
                                                        auction?.media?.[0]?.[0] ||
                                                        auction?.media?.[0] ||
                                                        defaultUp;

                                                    const statusColor =
                                                        order?.orderStatus === "delivered"
                                                            ? "text-emerald-600"
                                                            : order?.orderStatus === "cancelled"
                                                              ? "text-red-600"
                                                              : order?.orderStatus === "shipped"
                                                                ? "text-blue-600"
                                                                : "text-amber-600";

                                                    return (
                                                        <motion.div
                                                            key={order._id}
                                                            variants={fadeUp}
                                                            custom={i}
                                                            initial="hidden"
                                                            animate="show"
                                                            whileHover={{ y: -2 }}
                                                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
                                                        >
                                                            <img
                                                                src={image}
                                                                alt={auction?.name}
                                                                className="h-40 w-full object-cover"
                                                            />

                                                            <div className="p-4">
                                                                <p className="font-semibold text-gray-800 text-sm line-clamp-1">
                                                                    {auction?.name ||
                                                                        "Auction Item"}
                                                                </p>

                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    ₹
                                                                    {Number(
                                                                        order?.finalPrice || 0,
                                                                    ).toLocaleString("en-IN")}
                                                                </p>

                                                                <p
                                                                    className={`mt-2 text-xs font-semibold capitalize ${statusColor}`}
                                                                >
                                                                    {order?.orderStatus}
                                                                </p>

                                                                <button
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/orders/${order._id}`,
                                                                        )
                                                                    }
                                                                    className="mt-3 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                                                                >
                                                                    View Details
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* ── BIDS TAB ── */}
                                {activeTab === "bids" && (
                                    <>
                                        <p className="hidden md:block text-base font-semibold text-gray-900 mb-4">
                                            My Bids
                                        </p>
                                        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
                                            {loadingData ? (
                                                <div className="p-4 md:p-6">
                                                    <Skeleton />
                                                </div>
                                            ) : bids.length === 0 ? (
                                                <div className="p-4 md:p-6">
                                                    <Empty msg="No bids placed yet" />
                                                </div>
                                            ) : (
                                                bids.map((bid, i) => (
                                                    <motion.div
                                                        key={bid._id}
                                                        variants={fadeUp}
                                                        custom={i}
                                                        initial="hidden"
                                                        animate="show"
                                                        className="flex items-center justify-between px-4 md:px-6 py-3.5 md:py-4 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-800">
                                                                {bid.auction?.title ||
                                                                    "Auction Item"}
                                                            </p>
                                                            <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                                                                Active
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-bold text-orange-500">
                                                            ₹{bid.amount}
                                                        </span>
                                                    </motion.div>
                                                ))
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* ── AUCTIONS TAB ── */}
                                {activeTab === "auctions" && (
                                    <>
                                        <p className="hidden md:block text-base font-semibold text-gray-900 mb-4">
                                            My Auctions
                                        </p>
                                        <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
                                            {loadingData ? (
                                                <div className="p-4 md:p-6">
                                                    <Skeleton />
                                                </div>
                                            ) : auctions.length === 0 ? (
                                                <div className="p-4 md:p-6">
                                                    <Empty msg="No auctions created yet" />
                                                </div>
                                            ) : (
                                                auctions.map((auction, i) => {
                                                    const image = auction?.media?.[0]?.[0];
                                                    console.log(
                                                        auction.name,
                                                        "currentHighestBid:",
                                                        auction.currentHighestBid,
                                                        "startPrice:",
                                                        auction.startPrice,
                                                    );
                                                    return (
                                                        <motion.div
                                                            key={auction._id}
                                                            variants={fadeUp}
                                                            custom={i}
                                                            initial="hidden"
                                                            animate="show"
                                                            whileHover={{
                                                                backgroundColor: "#F9FAFB",
                                                            }}
                                                            onClick={() =>
                                                                navigate(`/auction/${auction._id}`)
                                                            }
                                                            className="flex items-center justify-between gap-3 px-4 md:px-6 py-3.5 md:py-4 cursor-pointer transition-colors"
                                                        >
                                                            <div className="flex items-center gap-3 md:gap-4 min-w-0">
                                                                {image ? (
                                                                    <img
                                                                        src={image}
                                                                        className="h-10 w-10 md:h-12 md:w-12 rounded-xl object-cover flex-shrink-0"
                                                                    />
                                                                ) : (
                                                                    <div className="h-10 w-10 md:h-12 md:w-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                                                                        <svg
                                                                            width="18"
                                                                            height="18"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="#93C5FD"
                                                                            strokeWidth="1.5"
                                                                        >
                                                                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                                                                        </svg>
                                                                    </div>
                                                                )}
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-semibold text-gray-800 truncate">
                                                                        {auction.name}
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                                                                        {auction.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 md:gap-5 flex-shrink-0">
                                                                <span
                                                                    className={`hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border
                                                                    ${
                                                                        auction.status === "live"
                                                                            ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                                                            : auction.status ===
                                                                                "draft"
                                                                              ? "text-gray-500 bg-gray-100 border-gray-200"
                                                                              : "text-red-600 bg-red-50 border-red-200"
                                                                    }`}
                                                                >
                                                                    {auction.status}
                                                                </span>
                                                                <div className="text-right">
                                                                    <p className="text-sm font-bold text-blue-600">
                                                                        ₹
                                                                        {Number(
                                                                            auction?.currentHighestBid ||
                                                                                0,
                                                                        ) > 0
                                                                            ? fmt(
                                                                                  Number(
                                                                                      auction.currentHighestBid,
                                                                                  ),
                                                                              )
                                                                            : fmt(
                                                                                  Number(
                                                                                      auction?.startPrice ||
                                                                                          auction?.startingPrice ||
                                                                                          auction?.basePrice ||
                                                                                          0,
                                                                                  ),
                                                                              )}
                                                                    </p>

                                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                                        {Number(
                                                                            auction?.currentHighestBid ||
                                                                                0,
                                                                        ) > 0
                                                                            ? "Highest Bid"
                                                                            : "Starting Price"}
                                                                    </p>

                                                                    <p className="text-xs text-gray-400">
                                                                        {auction?.bidCount || 0}{" "}
                                                                        bids
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* ── Edit Modal ── */}
            <AnimatePresence>
                {editSection && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px] flex items-end sm:items-center justify-center sm:px-4"
                        onClick={(e) => e.target === e.currentTarget && setEditSection(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ type: "spring", stiffness: 360, damping: 30 }}
                            className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl border border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto"
                        >
                            {/* drag handle on mobile */}
                            <div className="sm:hidden flex justify-center pt-3 pb-1">
                                <div className="w-10 h-1 rounded-full bg-gray-200" />
                            </div>

                            {/* Modal header */}
                            <div className="flex items-center justify-between px-5 md:px-6 pt-4 md:pt-6 pb-4 border-b border-gray-100">
                                <div>
                                    <h3 className="text-base font-semibold text-gray-900">
                                        {editSection === "profile" && "Edit Profile"}
                                        {editSection === "personal" && "Edit Personal Information"}
                                        {editSection === "address" && "Edit Address"}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        Update your information below
                                    </p>
                                </div>
                                <button
                                    onClick={() => setEditSection(null)}
                                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <XIcon />
                                </button>
                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="px-5 md:px-6 py-4 md:py-5 space-y-4"
                            >
                                {/* Profile section */}
                                {editSection === "profile" && (
                                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <img
                                            src={preview || User?.profile || defaultUp}
                                            className="h-14 w-14 rounded-full object-cover ring-2 ring-white shadow"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-gray-700 mb-1">
                                                Profile photo
                                            </p>
                                            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                                                <UploadIcon /> Upload Photo
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        setProfileFile(e.target.files[0])
                                                    }
                                                />
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Personal section */}
                                {editSection === "personal" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FieldInput
                                            label="First Name"
                                            name="firstName"
                                            value={form.firstName || ""}
                                            onChange={handleChange}
                                            error={errors.firstName}
                                        />
                                        <FieldInput
                                            label="Last Name"
                                            name="lastName"
                                            value={form.lastName || ""}
                                            onChange={handleChange}
                                            error={errors.lastName}
                                        />
                                        {/* <FieldInput
                                                    label="Email"
                                                    name="email"
                                                    value={form.email || ""}
                                                    onChange={handleChange}
                                                    type="email"
                                                    error={errors.email}
                                                /> */}
                                        <div className="sm:col-span-2">
                                            <FieldInput
                                                label="Username"
                                                name="username"
                                                value={form.username || ""}
                                                onChange={handleChange}
                                                error={errors.username}
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Address section */}
                                {editSection === "address" && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FieldInput
                                            label="Country"
                                            name="country"
                                            value={form.address?.country || ""}
                                            onChange={handleAddressChange}
                                            error={errors.country}
                                        />
                                        <FieldInput
                                            label="City"
                                            name="city"
                                            value={form.address?.city || ""}
                                            onChange={handleAddressChange}
                                            error={errors.city}
                                        />
                                        <FieldInput
                                            label="State"
                                            name="state"
                                            value={form.address?.state || ""}
                                            onChange={handleAddressChange}
                                            error={errors.state}
                                        />
                                        <FieldInput
                                            label="Postal Code"
                                            name="pin"
                                            value={form.address?.pin || ""}
                                            onChange={handleAddressChange}
                                            error={errors.pin}
                                        />
                                        <div className="sm:col-span-2">
                                            <FieldInput
                                                label="Street Address"
                                                name="street"
                                                value={form.address?.street || ""}
                                                onChange={handleAddressChange}
                                                error={errors.street}
                                            />
                                        </div>
                                    </div>
                                )}

                                {errors.general && (
                                    <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                                        {errors.general}
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-2 pb-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditSection(null)}
                                        className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <motion.button
                                        type="submit"
                                        whileHover={{ y: -1 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium shadow-sm hover:bg-blue-700 transition-colors"
                                    >
                                        Save Changes
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ── Sub-components ── */

function EditBtn({ onClick }) {
    return (
        <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-600 hover:border-gray-300 hover:text-gray-900 hover:shadow-sm transition-all"
        >
            Edit <PencilIcon />
        </motion.button>
    );
}

function InfoField({ label, value, valueClass = "" }) {
    return (
        <div>
            <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
            <p className={`text-sm font-medium text-gray-800 ${valueClass}`}>{value || "—"}</p>
        </div>
    );
}

function FieldInput({ label, name, value, onChange, type = "text", error }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all duration-150
                    ${
                        error
                            ? "border border-red-500 bg-red-50"
                            : "border border-gray-200 bg-gray-50 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 focus:bg-white"
                    }`}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
}

function Skeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />
            ))}
        </div>
    );
}

function Empty({ msg }) {
    return (
        <div className="rounded-xl border border-dashed border-gray-200 py-12 text-center">
            <p className="text-sm text-gray-400 font-medium">{msg}</p>
        </div>
    );
}
