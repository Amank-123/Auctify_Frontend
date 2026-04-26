import { X, Bell, Clock3, Megaphone, Trophy, Gavel } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINTS } from "../../../shared/constants/apiEndpoints";
import { useEffect, useState } from "react";

import { api } from "@/shared/services/axios";
export default function NotificationDrawer({ open = true }) {
    const navigate = useNavigate();
    const onClose = (e) => {
        navigate("/");
    };
    const [notificationsDB, setNotificationsDB] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const notification = await api.get(API_ENDPOINTS.Notification.GET_NOTIFICATION);
            setNotificationsDB(notification.data.data);
        };
        fetch();
    }, []);

    const unreadCount = notificationsDB.filter((item) => !item.isRead).length;

    const getIcon = (type) => {
        switch (type) {
            case "sponsored":
                return <Megaphone size={18} />;
            case "won":
                return <Trophy size={18} />;
            case "outbid":
            case "newBid":
                return <Gavel size={18} />;
            default:
                return <Bell size={18} />;
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            damping: 28,
                            stiffness: 220,
                        }}
                        className="fixed top-0 right-0 h-screen w-full sm:w-[430px] bg-white z-50 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="px-5 py-4 border-b flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
                                <p className="text-sm text-slate-500 mt-1">{unreadCount} unread</p>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/`);
                                }}
                                className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex-1 overflow-y-auto">
                            {notificationsDB.map((item) => (
                                <button
                                    key={item._id}
                                    className={`w-full text-left px-5 py-4 border-b hover:bg-slate-50 transition ${
                                        !item.isRead ? "bg-blue-50/50" : ""
                                    }`}
                                >
                                    <div className="flex gap-3">
                                        {/* Icon */}
                                        <div
                                            className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center ${
                                                item.type === "sponsored"
                                                    ? "bg-orange-100 text-orange-600"
                                                    : "bg-blue-100 text-blue-600"
                                            }`}
                                        >
                                            {getIcon(item.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <h3 className="font-semibold text-slate-900 text-sm">
                                                    {item.title}
                                                </h3>

                                                {!item.isRead && (
                                                    <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                                                )}
                                            </div>

                                            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                                {item.message}
                                            </p>

                                            <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                                                <Clock3 size={12} />
                                                {new Date(item.createdAt).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
