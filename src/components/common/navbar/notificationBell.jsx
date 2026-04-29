import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { HiOutlineBell } from "react-icons/hi";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { socket } from "@/shared/services/socket";
import { useAuth } from "@/hooks/useAuth.js";

export default function NotificationBell() {
    const { User } = useAuth();
    const [count, setCount] = useState(0);

    const bellControls = useAnimation();
    const glowControls = useAnimation();
    const badgeControls = useAnimation();

    const playSound = useCallback(() => {
        const sound = new Audio("/notify.mp3"); // fresh instance every time
        sound.volume = 0.6;
        sound.play().catch((err) => console.warn("🔇 Play blocked:", err));
    }, []);

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

    const triggerNotify = useCallback(async () => {
        // Bell shake
        await bellControls.start({
            rotate: [0, 18, -16, 14, -10, 7, -4, 2, -1, 0],
            transition: { duration: 0.7, ease: "easeOut" },
        });

        // Glow pulse (runs in parallel with shake)
        glowControls.start({
            boxShadow: [
                "0 0 0px 0px rgba(239,68,68,0)",
                "0 0 0px 8px rgba(239,68,68,0.25), 0 0 20px 4px rgba(239,68,68,0.15)",
                "0 0 0px 14px rgba(239,68,68,0.05)",
                "0 0 0px 0px rgba(239,68,68,0)",
            ],
            transition: { duration: 0.9, ease: "easeOut" },
        });

        // Badge pop (runs in parallel)
        badgeControls.start({
            scale: [0.8, 1.45, 0.9, 1],
            transition: { duration: 0.4, ease: "easeOut" },
        });
    }, [bellControls, glowControls, badgeControls]);

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
        return () => socket.off("newNotification", handleNewNotification);
    }, [User?._id, fetchUnreadCount, playSound, triggerNotify]);

    return (
        <Link to="/notifications" className="relative inline-flex items-center justify-center">
            {/* Glow ring */}
            <motion.div
                animate={glowControls}
                className="absolute inset-0 rounded-xl pointer-events-none"
            />

            {/* Bell icon */}
            <motion.div
                animate={bellControls}
                style={{ transformOrigin: "top center" }}
                className="relative text-2xl"
            >
                <HiOutlineBell />

                {/* Badge */}
                <AnimatePresence>
                    {count > 0 && (
                        <motion.span
                            key={count}
                            animate={badgeControls}
                            initial={false}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[16px] h-4 flex items-center justify-center rounded-full px-[3px] border-2 border-background"
                        >
                            {count > 99 ? "99+" : count}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </Link>
    );
}
