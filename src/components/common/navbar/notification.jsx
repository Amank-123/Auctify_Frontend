import { X, Bell, ArrowRight, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "../../../shared/constants/apiEndpoints";

// Generates a consistent avatar color
const getAvatarColor = (str = "") => {
    const colors = [
        ["#EEF2FF", "#6366F1"],
        ["#FFF7ED", "#F97316"],
        ["#F0FDF4", "#22C55E"],
        ["#FFF1F2", "#F43F5E"],
        ["#EFF6FF", "#3B82F6"],
        ["#FEFCE8", "#EAB308"],
        ["#F5F3FF", "#8B5CF6"],
        ["#ECFDF5", "#10B981"],
    ];

    const i = (str?.charCodeAt?.(0) || 0) % colors.length;

    return colors[i];
};

const Avatar = ({ title = "", size = 38 }) => {
    const [bg, text] = getAvatarColor(title);

    const initials = title.slice(0, 2).toUpperCase();

    return (
        <div
            style={{
                width: size,
                height: size,
                background: bg,
                color: text,
                fontSize: size * 0.36,
            }}
            className="rounded-full flex items-center justify-center font-bold shrink-0 select-none"
        >
            {initials}
        </div>
    );
};

const typeAction = {
    won: "You won the auction",
    outbid: "You've been outbid on",
    newBid: "New bid placed on",
    sponsored: "Sponsored",
    general: "Update on",
};

export default function NotificationDrawer({ open = false, onClose, onMarkedAllRead }) {
    const [notificationsDB, setNotificationsDB] = useState([]);

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (!open) return;

        const fetchNotifications = async () => {
            try {
                setLoading(true);

                const res = await api.get(
                    `${API_ENDPOINTS.Notification.GET_NOTIFICATION}?limit=20`,
                );

                setNotificationsDB(res.data?.data || []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, [open]);

    const unreadCount = notificationsDB.filter((n) => !n.isRead).length;

    const markRead = async (item) => {
        try {
            await api.post(`/api/notify/${item._id}`);

            setNotificationsDB((prev) =>
                prev.map((n) =>
                    n._id === item._id
                        ? {
                              ...n,
                              isRead: true,
                          }
                        : n,
                ),
            );

            onMarkedAllRead?.();

            if (
                (item.type === "won" || item.type === "outbid" || item.type === "newBid") &&
                item.auctionId
            ) {
                navigate(`/auction/${item.auctionId}`);

                onClose();
            }
        } catch (error) {
            console.log(error);
        }
    };

    const markAllRead = async () => {
        try {
            await api.post(`/api/notify/readAll`);

            setNotificationsDB((prev) =>
                prev.map((n) => ({
                    ...n,
                    isRead: true,
                })),
            );

            // refresh bell badge
            onMarkedAllRead?.();
        } catch (error) {
            console.log(error);
        }
    };

    const formatTime = (date) => {
        const diff = Math.floor((new Date() - new Date(date)) / 1000);

        if (diff < 60) return "Just now";

        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;

        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;

        if (diff < 172800) return "1 day ago";

        return `${Math.floor(diff / 86400)} days ago`;
    };

    const items = [...notificationsDB]
        .sort((a, b) => {
            // unread first
            if (a.isRead !== b.isRead) {
                return a.isRead ? 1 : -1;
            }

            // priority
            const p = {
                outbid: 1,
                newBid: 1,
                won: 2,
                general: 3,
                sponsored: 4,
            };

            const pA = p[a.type] || 3;

            const pB = p[b.type] || 3;

            if (pA !== pB) return pA - pB;

            // latest first
            return new Date(b.createdAt) - new Date(a.createdAt);
        })
        .slice(0, 10);

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{
                            x: "100%",
                        }}
                        animate={{
                            x: 0,
                        }}
                        exit={{
                            x: "100%",
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 320,
                            damping: 32,
                        }}
                        className="fixed top-0 right-0 h-screen w-full sm:w-[390px] bg-white z-50 flex flex-col shadow-2xl border-l border-slate-200"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={onClose}
                                    className="text-slate-400 hover:text-slate-700 transition"
                                >
                                    <X size={18} />
                                </button>

                                <div>
                                    <h2 className="text-[17px] font-semibold tracking-tight text-slate-900">
                                        Notifications
                                    </h2>

                                    <p className="text-[12px] text-slate-500 mt-0.5">
                                        {unreadCount} unread
                                    </p>
                                </div>
                            </div>

                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-[13px] font-medium text-slate-500 hover:text-blue-600 transition flex items-center gap-1"
                                >
                                    <CheckCheck size={14} />
                                    Read all
                                </button>
                            )}
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto">
                            {loading ? (
                                <div className="p-5 text-sm text-slate-500">Loading...</div>
                            ) : items.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center px-10 text-center">
                                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                                        <Bell size={20} className="text-slate-400" />
                                    </div>

                                    <p className="text-[14px] font-semibold text-slate-700">
                                        No notifications
                                    </p>

                                    <p className="text-[12px] text-slate-400 mt-1">
                                        We'll let you know when something happens.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {items.map((item, index) => (
                                        <motion.button
                                            key={item._id}
                                            initial={{
                                                opacity: 0,
                                                y: 6,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            transition={{
                                                delay: index * 0.03,
                                            }}
                                            whileTap={{
                                                scale: 0.995,
                                            }}
                                            onClick={() => markRead(item)}
                                            className="w-full text-left px-5 py-4 hover:bg-slate-50 transition relative"
                                        >
                                            {!item.isRead && (
                                                <span className="absolute top-5 right-4 w-2 h-2 rounded-full bg-blue-500" />
                                            )}

                                            <div className="flex gap-3 pr-5">
                                                <Avatar title={item.title} />

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[14px] text-slate-600 leading-[1.45]">
                                                        <span className="text-[13px] text-slate-500">
                                                            {typeAction[item.type] ||
                                                                "Update on"}{" "}
                                                        </span>

                                                        <span className="font-semibold text-slate-900">
                                                            {item.title}
                                                        </span>
                                                    </p>

                                                    <p className="text-[12px] text-slate-400 mt-1 tracking-tight">
                                                        {formatTime(item.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-4 border-t border-slate-100">
                            <Link
                                to="/notifications"
                                onClick={onClose}
                                className="w-full h-11 rounded-xl border border-slate-200 text-slate-700 text-[14px] font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition"
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
