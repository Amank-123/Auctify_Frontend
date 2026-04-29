import { useEffect, useMemo, useState } from "react";
import {
    Bell,
    CheckCheck,
    Filter,
    Search,
    Trash2,
    Trophy,
    Gavel,
    AlertCircle,
    Megaphone,
    Clock3,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";

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

export default function NotificationPage() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("all");

    const fetchNotifications = async () => {
        try {
            setLoading(true);

            const res = await api.get(API_ENDPOINTS.Notification.GET_NOTIFICATION);

            setNotifications(res.data?.data || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const unreadCount = notifications.filter((item) => !item.isRead).length;

    const markOneRead = async (item) => {
        try {
            if (!item.isRead) {
                await api.post(`/api/notify/${item._id}`);
            }

            setNotifications((prev) =>
                prev.map((n) =>
                    n._id === item._id
                        ? {
                              ...n,
                              isRead: true,
                          }
                        : n,
                ),
            );
        } catch (error) {
            console.log(error);
        }
    };

    const markAllRead = async () => {
        try {
            await api.post(`/api/notify/readAll`);

            setNotifications((prev) =>
                prev.map((n) => ({
                    ...n,
                    isRead: true,
                })),
            );
        } catch (error) {
            console.log(error);
        }
    };

    const removeItem = (id) => {
        setNotifications((prev) => prev.filter((item) => item._id !== id));
    };

    const filtered = useMemo(() => {
        let list = [...notifications];

        if (filter === "unread") {
            list = list.filter((n) => !n.isRead);
        }

        if (filter !== "all" && filter !== "unread") {
            list = list.filter((n) => n.type === filter);
        }

        if (query.trim()) {
            const q = query.toLowerCase();

            list = list.filter(
                (n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q),
            );
        }

        return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }, [notifications, filter, query]);

    return (
        <div className="min-h-screen bg-[#F8FAFC]">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                            Notifications
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Stay updated with bids, wins, alerts and account activity.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm">
                            {unreadCount} unread
                        </div>

                        <button
                            onClick={markAllRead}
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
                        >
                            <CheckCheck size={16} />
                            Mark all read
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="mb-6 grid gap-3 md:grid-cols-[1fr_auto_auto]">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search notifications..."
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-slate-400"
                        />
                    </div>

                    <div className="relative">
                        <Filter className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="h-11 rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm outline-none"
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

                    <Link
                        to="/explore"
                        className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                        Explore Auctions
                    </Link>
                </div>

                {/* Content */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    {loading ? (
                        <div className="space-y-4 p-6">
                            {Array.from({
                                length: 6,
                            }).map((_, i) => (
                                <div
                                    key={i}
                                    className="h-20 animate-pulse rounded-xl bg-slate-100"
                                />
                            ))}
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                                <Bell className="h-6 w-6 text-slate-400" />
                            </div>

                            <h3 className="text-lg font-semibold text-slate-900">
                                No notifications
                            </h3>

                            <p className="mt-1 max-w-md text-sm text-slate-500">
                                You’re all caught up. New updates will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100">
                            {filtered.map((item, index) => {
                                const Icon = iconMap[item.type] || Bell;

                                return (
                                    <motion.div
                                        key={item._id}
                                        initial={{
                                            opacity: 0,
                                            y: 8,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        transition={{
                                            delay: index * 0.02,
                                        }}
                                        className={`group flex gap-4 px-5 py-5 transition hover:bg-slate-50 ${
                                            !item.isRead ? "bg-blue-50/30" : ""
                                        }`}
                                    >
                                        <div
                                            className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                                                toneMap[item.type]
                                            }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                        </div>

                                        <button
                                            onClick={() => markOneRead(item)}
                                            className="flex-1 text-left"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h4 className="text-sm font-semibold text-slate-900">
                                                        {item.title}
                                                    </h4>

                                                    <p className="mt-1 text-sm leading-6 text-slate-600">
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
                                                </div>
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
            </div>
        </div>
    );
}
