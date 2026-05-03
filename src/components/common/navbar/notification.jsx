import { X, Bell, ArrowRight, CheckCheck, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "../../../shared/constants/apiEndpoints";

const ITEMS_PER_PAGE = 7;

/* ---------- Avatar ---------- */
const Avatar = ({ title = "" }) => {
    const colors = [
        ["#EEF2FF", "#6366F1"],
        ["#FFF7ED", "#F97316"],
        ["#F0FDF4", "#22C55E"],
        ["#FFF1F2", "#F43F5E"],
    ];

    const [bg, text] = colors[(title?.charCodeAt?.(0) || 0) % colors.length];

    return (
        <div
            style={{ background: bg, color: text }}
            className="h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
        >
            {title.slice(0, 2).toUpperCase()}
        </div>
    );
};

const typeAction = {
    won: "You won",
    outbid: "Outbid on",
    newBid: "New bid on",
    sponsored: "Sponsored",
    general: "Update on",
};

export default function NotificationDrawer({ open, onClose, onMarkedAllRead }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);

    const navigate = useNavigate();

    /* ---------- FETCH ---------- */
    useEffect(() => {
        if (!open) return;

        const fetch = async () => {
            setLoading(true);
            try {
                const res = await api.get(
                    `${API_ENDPOINTS.Notification.GET_NOTIFICATION}?limit=50`,
                );
                setData(res.data?.data || []);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, [open]);

    /* ---------- RESET PAGE ---------- */
    useEffect(() => {
        if (open) setPage(1);
    }, [open]);

    /* ---------- SORT ---------- */
    const sorted = useMemo(() => {
        return [...data].sort((a, b) => {
            if (a.isRead !== b.isRead) return a.isRead ? 1 : -1;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }, [data]);

    const items = sorted.slice(0, page * ITEMS_PER_PAGE);
    const hasMore = items.length < sorted.length;
    const unread = data.filter((n) => !n.isRead).length;

    /* ---------- ACTIONS ---------- */
    const markRead = async (item) => {
        await api.post(`/api/notify/${item._id}`);

        setData((prev) => prev.map((n) => (n._id === item._id ? { ...n, isRead: true } : n)));

        onMarkedAllRead?.();

        if (item.auctionId) {
            navigate(`/auction/${item.auctionId}`);
            onClose();
        }
    };

    const markAll = async () => {
        await api.post(`/api/notify/readAll`);
        setData((prev) => prev.map((n) => ({ ...n, isRead: true })));
        onMarkedAllRead?.();
    };

    const formatTime = (d) => {
        const diff = Math.floor((Date.now() - new Date(d)) / 1000);
        if (diff < 60) return "now";
        if (diff < 3600) return `${Math.floor(diff / 60)}m`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
        return `${Math.floor(diff / 86400)}d`;
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* BACKDROP */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0  z-40"
                    />

                    {/* DRAWER */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white z-50 flex flex-col"
                    >
                        {/* HEADER */}
                        <div className="sticky top-0 bg-white border-b px-4 py-4 flex items-center justify-between z-10">
                            <div className="flex items-center gap-3">
                                <button onClick={onClose}>
                                    <X size={18} />
                                </button>

                                <div>
                                    <p className="font-semibold text-sm">Notifications</p>
                                    <p className="text-xs text-gray-500">{unread} unread</p>
                                </div>
                            </div>

                            {unread > 0 && (
                                <button
                                    onClick={markAll}
                                    className="text-xs text-blue-600 flex items-center gap-1"
                                >
                                    <CheckCheck size={14} />
                                    Read all
                                </button>
                            )}
                        </div>

                        {/* BODY */}
                        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                            {loading ? (
                                <div className="text-center text-sm text-gray-500 py-10">
                                    Loading...
                                </div>
                            ) : items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center">
                                    <Bell className="text-gray-400 mb-3" />
                                    <p className="text-sm font-medium">Nothing here</p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <motion.button
                                        key={item._id}
                                        onClick={() => markRead(item)}
                                        whileTap={{ scale: 0.98 }}
                                        className={`
                                            w-full flex gap-3 text-left
                                            p-3 rounded-xl
                                            transition
                                            ${item.isRead ? "bg-white" : "bg-blue-50"}
                                            hover:bg-gray-50
                                        `}
                                    >
                                        <Avatar title={item.title} />

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-700">
                                                <span className="font-semibold">{item.title} </span>
                                                <span className="text-xs text-gray-500">
                                                    {typeAction[item.type]}
                                                </span>
                                            </p>

                                            <p className="text-xs text-gray-400 mt-1">
                                                {formatTime(item.createdAt)}
                                            </p>
                                        </div>
                                    </motion.button>
                                ))
                            )}
                        </div>

                        {/* LOAD MORE (MODERN) */}
                        {hasMore && (
                            <div className="flex justify-center py-3">
                                <button
                                    onClick={() => setPage((p) => p + 1)}
                                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
                                >
                                    <span>Show more </span>
                                    <ChevronDown size={16} />
                                </button>
                            </div>
                        )}

                        {/* FOOTER */}
                        <div className=" px-2 pb-3">
                            <Link
                                to="/notifications"
                                onClick={onClose}
                                className="w-full flex items-center justify-center gap-2 border rounded-xl py-3 text-sm hover:bg-gray-50 transition"
                            >
                                View all notifications
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
