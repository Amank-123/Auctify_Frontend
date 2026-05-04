import { useEffect, useState, useCallback } from "react";
import { HiChatAlt } from "react-icons/hi";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { socket } from "@/shared/services/socket";
import { useAuth } from "@/hooks/useAuth.js";
import { MessageCircleMore } from "lucide-react";

export default function ChatButton({ onClick, refreshKey }) {
    const { User } = useAuth();
    const [count, setCount] = useState(0);

    const bellControls = useAnimation();
    const glowControls = useAnimation();
    const badgeControls = useAnimation();

    const playSound = useCallback(() => {
        const sound = new Audio("/notify.mp3");
        sound.volume = 0.6;

        sound.play().catch((err) => {
            console.warn("🔇 Play blocked:", err);
        });
    }, []);

    const triggerNotify = useCallback(async () => {
        await bellControls.start({
            rotate: [0, 18, -16, 14, -10, 7, -4, 2, -1, 0],
            transition: {
                duration: 0.7,
                ease: "easeOut",
            },
        });

        glowControls.start({
            boxShadow: [
                "0 0 0px 0px rgba(239,68,68,0)",
                "0 0 0px 8px rgba(239,68,68,0.25), 0 0 20px 4px rgba(239,68,68,0.15)",
                "0 0 0px 14px rgba(239,68,68,0.05)",
                "0 0 0px 0px rgba(239,68,68,0)",
            ],
            transition: {
                duration: 0.9,
                ease: "easeOut",
            },
        });

        badgeControls.start({
            scale: [0.8, 1.45, 0.9, 1],
            transition: {
                duration: 0.4,
                ease: "easeOut",
            },
        });
    }, [bellControls, glowControls, badgeControls]);

    const fetchUnreadCount = useCallback(async () => {
        if (!User?._id) {
            setCount(0);
            return;
        }

        try {
            const res = await api.get(API_ENDPOINTS.Notification.GET_NOTIFICATION);

            const unread = (res.data?.data || []).filter((item) => !item.isRead).length;

            setCount(unread);
        } catch {
            setCount(0);
        }
    }, [User?._id]);

    useEffect(() => {
        if (!User?._id) {
            setCount(0);
            return;
        }

        fetchUnreadCount();

        socket.emit("join_notification", User._id);

        const handleNewNotification = (data) => {
            console.log("🔥 Notification received:", data);

            setCount((prev) => prev + 1);

            playSound();
            triggerNotify();
        };

        socket.on("newNotification", handleNewNotification);

        return () => {
            socket.off("newNotification", handleNewNotification);
        };
    }, [User?._id, fetchUnreadCount, playSound, triggerNotify]);

    useEffect(() => {
        fetchUnreadCount();
    }, [refreshKey, fetchUnreadCount]);

    return (
        <button
            type="button"
            onClick={onClick}
            className="relative inline-flex items-center cursor-pointer justify-center"
        >
            {/* Glow Ring */}
            <motion.div
                animate={glowControls}
                className="absolute inset-0 rounded-xl pointer-events-none"
            />

            <motion.div
                animate={bellControls}
                style={{
                    transformOrigin: "top center",
                }}
                className="relative text-2xl text-slate-800 hover:text-blue-600 transition-colors"
            >
                <MessageCircleMore size={25} />

                {/* Badge */}
                <AnimatePresence>
                    {count > 0 && (
                        <motion.span
                            key={count}
                            animate={badgeControls}
                            initial={false}
                            exit={{
                                scale: 0,
                                opacity: 0,
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 px-[3px] rounded-full flex items-center justify-center border-2 border-white"
                        >
                            {count > 99 ? "99+" : count}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </button>
    );
}
