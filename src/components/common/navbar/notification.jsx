import {
    X,
    Bell,
    ArrowRight,
    CheckCheck,
    Search,
    Filter,
    Trash2,
    Trophy,
    Gavel,
    AlertCircle,
    Megaphone,
    Clock3,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "../../../shared/constants/apiEndpoints";

const iconMap = {
    won: Trophy,
    outbid: AlertCircle,
    newBid: Gavel,
    endingSoon: Clock3,
    sponsored: Megaphone,
    system: Bell,
};

const toneMap = {
    won: "bg-emerald-50 text-emerald-600 border-emerald-100",
    outbid: "bg-red-50 text-red-600 border-red-100",
    newBid: "bg-blue-50 text-blue-600 border-blue-100",
    endingSoon: "bg-amber-50 text-amber-600 border-amber-100",
    sponsored: "bg-violet-50 text-violet-600 border-violet-100",
    system: "bg-slate-50 text-slate-600 border-slate-100",
};

function timeAgo(date) {
    const diff = Math.floor((Date.now() - new Date(date)) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    return new Date(date).toLocaleDateString();
}

export default function NotificationDrawer({ open = false, onClose, onMarkedAllRead }) {
    const [notificationsDB, setNotificationsDB] = useState([]);
    const [loading, setLoading] = useState(false);

    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");

    const navigate = useNavigate();

    /* ---------- FETCH ---------- */
    useEffect(() => {
        if (!open) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await api.get(
                    `${API_ENDPOINTS.Notification.GET_NOTIFICATION}?limit=50`,
                );
                setNotificationsDB(res.data?.data || []);
            } catch (e) {
                console.log(e);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [open]);

    /* ---------- DERIVED ---------- */
    const unreadCount = useMemo(() => {
        return notificationsDB.filter((n) => !n.isRead).length;
    }, [notificationsDB]);

    const filteredItems = useMemo(() => {
        let list = [...notificationsDB];

        if (filter === "unread") {
            list = list.filter((n) => !n.isRead);
        }

        if (filter !== "all" && filter !== "unread") {
            list = list.filter((n) => n.type === filter);
        }

        if (query.trim()) {
            const q = query.toLowerCase();

            list = list.filter(
                (n) => n.title?.toLowerCase().includes(q) || n.message?.toLowerCase().includes(q),
            );
        }

        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 20);
    }, [notificationsDB, query, filter]);

    /* ---------- ACTIONS ---------- */
    const markRead = async (item) => {
        try {
            if (!item.isRead) {
                await api.post(`/api/notify/${item._id}`);
            }

            setNotificationsDB((prev) =>
                prev.map((n) => (n._id === item._id ? { ...n, isRead: true } : n)),
            );

            navigate(`${item.ctaLink}`);
            onClose();
        } catch (error) {
            console.log(error);
        }
    };

    const markAllRead = async () => {
        try {
            await api.post(`/api/notify/readAll`);

            setNotificationsDB((prev) => prev.map((n) => ({ ...n, isRead: true })));

            onMarkedAllRead?.();
        } catch (error) {
            console.log(error);
        }
    };

    const removeItem = async (id) => {
        try {
            await api.post(`/api/notify/delete/${id}`);
        } catch (error) {
            console.log(error);
        }

        setNotificationsDB((prev) => prev.filter((item) => item._id !== id));
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 320,
                            damping: 32,
                        }}
                        className="fixed right-0 top-0 z-50 flex h-screen w-full flex-col border-l border-slate-200 bg-white shadow-2xl sm:w-[430px]"
                    >
                        {/* Header */}
                        <div className="border-b border-slate-100 px-5 py-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={onClose}
                                        className="text-slate-400 hover:text-slate-700"
                                    >
                                        <X size={18} />
                                    </button>

                                    <div>
                                        <h2 className="text-[17px] font-semibold text-slate-900">
                                            Notifications
                                        </h2>
                                        <p className="text-xs text-slate-500">
                                            {unreadCount} unread
                                        </p>
                                    </div>
                                </div>

                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllRead}
                                        className="flex items-center gap-1 text-[13px] font-medium text-slate-500 hover:text-blue-600"
                                    >
                                        <CheckCheck size={14} />
                                        Read all
                                    </button>
                                )}
                            </div>

                            {/* Search + Filter */}
                            <div className="mt-4 grid gap-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                    <input
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        placeholder="Search..."
                                        className="h-11 w-full rounded-xl border border-slate-200 pl-10 pr-4 text-sm outline-none"
                                    />
                                </div>

                                <div className="relative">
                                    <Filter className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                    <select
                                        value={filter}
                                        onChange={(e) => setFilter(e.target.value)}
                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none"
                                    >
                                        <option value="all">All</option>
                                        <option value="unread">Unread</option>
                                        <option value="won">Won</option>
                                        <option value="outbid">Outbid</option>
                                        <option value="newBid">New Bid</option>
                                        <option value="endingSoon">Ending Soon</option>
                                        <option value="system">System</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* BODY */}
                        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
                            {loading ? (
                                <div className="space-y-3 p-5">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="h-20 animate-pulse rounded-xl bg-slate-100"
                                        />
                                    ))}
                                </div>
                            ) : filteredItems.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center px-8 text-center">
                                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                                        <Bell className="h-6 w-6 text-slate-400" />
                                    </div>

                                    <h3 className="text-lg font-semibold text-slate-900">
                                        No notifications
                                    </h3>

                                    <p className="mt-1 text-sm text-slate-500">
                                        You're all caught up.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {filteredItems.map((item, index) => {
                                        const Icon = iconMap[item.type] || Bell;
                                        const image = item.image;

                                        return (
                                            <motion.div
                                                key={item._id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.02 }}
                                                className={`group flex gap-3 px-5 py-4 hover:bg-slate-50 ${
                                                    !item.isRead ? "bg-blue-50/30" : ""
                                                }`}
                                            >
                                                <div
                                                    className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border ${
                                                        toneMap[item.type]
                                                    }`}
                                                >
                                                    {image ? (
                                                        <img
                                                            src={image}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <Icon className="h-4 w-4" />
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => markRead(item)}
                                                    className="flex-1 text-left"
                                                >
                                                    <h4 className="text-sm font-semibold text-slate-900">
                                                        {item.title}
                                                    </h4>

                                                    <p className="mt-1 text-sm text-slate-600">
                                                        {item.message}
                                                    </p>

                                                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-400">
                                                        <span>{timeAgo(item.createdAt)}</span>

                                                        {!item.isRead && (
                                                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                                                                New
                                                            </span>
                                                        )}
                                                    </div>
                                                </button>

                                                <button
                                                    onClick={() => removeItem(item._id)}
                                                    className="opacity-0 transition group-hover:opacity-100"
                                                >
                                                    <Trash2 className="h-4 w-4 text-slate-400 hover:text-red-500" />
                                                </button>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-100 px-5 py-4">
                            <Link className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                                get more
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
