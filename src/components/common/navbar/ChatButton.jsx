import { useEffect, useState, useCallback } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { MessageCircleMore } from "lucide-react";

import { api } from "@/shared/services/axios";
import { socket } from "@/shared/services/socket";
import { useAuth } from "@/hooks/useAuth.js";

export default function ChatButton({ onClick, refreshKey }) {
    const { User } = useAuth();

    const [count, setCount] = useState(0);

    const bellControls = useAnimation();

    const glowControls = useAnimation();

    const badgeControls = useAnimation();

    /* ================= SOUND ================= */

    const playSound = useCallback(() => {
        const sound = new Audio("/notify.mp3");

        sound.volume = 0.6;

        sound.play().catch((err) => {
            console.warn("🔇 Audio blocked:", err);
        });
    }, []);

    /* ================= ANIMATION ================= */

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
                "0 0 0px 0px rgba(59,130,246,0)",

                "0 0 0px 8px rgba(59,130,246,0.25), 0 0 20px 4px rgba(59,130,246,0.15)",

                "0 0 0px 14px rgba(59,130,246,0.05)",

                "0 0 0px 0px rgba(59,130,246,0)",
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

    /* ================= FETCH UNREAD ================= */

    const fetchUnreadCount = useCallback(async () => {
        if (!User?._id) {
            setCount(0);

            return;
        }

        try {
            const res = await api.get("/api/Room/getRooms");

            const rooms = Array.isArray(res.data?.data) ? res.data.data : [];

            let totalUnread = 0;

            rooms.forEach((room) => {
                const lastMsg = room?.lastMessageId;

                if (!lastMsg) return;

                const isMine =
                    String(
                        typeof lastMsg.senderId === "object"
                            ? lastMsg.senderId?._id
                            : lastMsg.senderId,
                    ) === String(User?._id);

                const seen =
                    lastMsg?.seenBy?.some((id) => String(id) === String(User?._id)) || false;

                if (!isMine && !seen) {
                    totalUnread += 1;
                }
            });

            setCount(totalUnread);
        } catch (error) {
            console.log("❌ FETCH UNREAD ERROR:", error);

            setCount(0);
        }
    }, [User?._id]);

    /* ================= SOCKET ================= */

    useEffect(() => {
        if (!User?._id) {
            setCount(0);

            return;
        }

        console.log("🟢 JOINING USER SOCKET:", User._id);

        /* ================= REGISTER USER ================= */

        socket.emit("join_user", User._id);

        /* ================= INITIAL FETCH ================= */

        fetchUnreadCount();

        /* ================= NEW CHAT ================= */

        const handleRoomUpdate = async (data) => {
            console.log("🔥 ROOM UPDATED EVENT:", data);

            /* ================= IGNORE OWN MESSAGE ================= */

            if (String(data.senderId) === String(User?._id)) {
                console.log("⚠️ Ignoring own message");

                return;
            }

            /* ================= INCREMENT ================= */

            setCount((prev) => {
                console.log("🔴 PREV COUNT:", prev);

                return prev + 1;
            });

            /* ================= SOUND ================= */

            playSound();

            /* ================= ANIMATION ================= */

            triggerNotify();

            /* ================= BROWSER NOTIFICATION ================= */

            if ("Notification" in window) {
                if (Notification.permission === "default") {
                    await Notification.requestPermission();
                }

                if (Notification.permission === "granted") {
                    new Notification("New Chat Message", {
                        body: data.message || "You received a new message",

                        icon: "/logo.png",
                    });
                }
            }
        };

        /* ================= LISTENER ================= */

        socket.on("room_updated", handleRoomUpdate);

        console.log("👂 Listening for room_updated");

        return () => {
            console.log("❌ Removing room_updated listener");

            socket.off("room_updated", handleRoomUpdate);
        };
    }, [User?._id, fetchUnreadCount, playSound, triggerNotify]);

    /* ================= MANUAL REFRESH ================= */

    useEffect(() => {
        fetchUnreadCount();
    }, [refreshKey, fetchUnreadCount]);

    useEffect(() => {
        const handleSeen = ({ seenBy }) => {
            if (String(seenBy) !== String(User?._id)) {
                return;
            }

            fetchUnreadCount();
        };

        socket.on("message_seen", handleSeen);

        return () => {
            socket.off("message_seen", handleSeen);
        };
    }, [User?._id, fetchUnreadCount]);

    return (
        <button
            type="button"
            onClick={onClick}
            className="relative inline-flex items-center justify-center cursor-pointer"
        >
            {/* ================= GLOW ================= */}

            <motion.div
                animate={glowControls}
                className="absolute inset-0 rounded-xl pointer-events-none"
            />

            {/* ================= ICON ================= */}

            <motion.div
                animate={bellControls}
                style={{
                    transformOrigin: "top center",
                }}
                className="relative text-2xl text-slate-800 hover:text-blue-600 transition-colors"
            >
                <MessageCircleMore size={25} />

                {/* ================= BADGE ================= */}

                <AnimatePresence>
                    {count > 0 && (
                        <motion.span
                            key={count}
                            animate={badgeControls}
                            initial={{
                                scale: 0,
                            }}
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
