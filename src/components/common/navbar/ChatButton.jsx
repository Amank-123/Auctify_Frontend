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

    // Plays notification sound
    const playSound = useCallback(() => {
        const sound = new Audio("/notify.mp3");

        sound.volume = 0.6;

        sound.play().catch(() => {});
    }, []);

    // Runs bell and glow animations
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

    // Fetches unread room count
    const fetchUnreadCount = useCallback(async () => {
        if (!User?._id) {
            setCount(0);

            return;
        }

        try {
            const res = await api.get("/api/room/getrooms");

            const rooms = Array.isArray(res.data?.data) ? res.data.data : [];

            let totalUnread = 0;

            rooms.forEach((room) => {
                const lastMsg = room?.lastMessageId;

                if (!lastMsg) return;

                const senderId =
                    typeof lastMsg.senderId === "object" ? lastMsg.senderId?._id : lastMsg.senderId;

                const isMine = String(senderId) === String(User?._id);

                const seen =
                    lastMsg?.seenBy?.some((item) => {
                        const id = typeof item === "object" ? item?._id : item;

                        return String(id) === String(User?._id);
                    }) || false;

                if (!isMine && !seen) {
                    totalUnread += 1;
                }
            });

            setCount(totalUnread);
        } catch {
            setCount(0);
        }
    }, [User?._id]);

    // Connects socket and listens for realtime room updates
    useEffect(() => {
        if (!User?._id) {
            setCount(0);

            return;
        }

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("join_user", User._id);

        const timeout = setTimeout(async () => {
            await fetchUnreadCount();
        }, 2000);

        const handleRoomUpdate = async (data) => {
            // Ignore messages sent by current user
            if (String(data.senderId) === String(User?._id)) {
                return;
            }

            await fetchUnreadCount();

            playSound();

            triggerNotify();

            // Browser notification
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

        socket.on("room_updated", handleRoomUpdate);

        return () => {
            clearTimeout(timeout);

            socket.off("room_updated", handleRoomUpdate);
        };
    }, [User?._id, fetchUnreadCount, playSound, triggerNotify]);

    // Refetches when refresh key changes
    useEffect(() => {
        fetchUnreadCount();
    }, [refreshKey, fetchUnreadCount]);

    // Updates unread count when messages become seen
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
            {/* Glow effect */}
            <motion.div
                animate={glowControls}
                className="absolute inset-0 rounded-xl pointer-events-none"
            />

            {/* Chat icon */}
            <motion.div
                animate={bellControls}
                style={{
                    transformOrigin: "top center",
                }}
                className="relative text-2xl text-slate-800 hover:text-blue-600 transition-colors"
            >
                <MessageCircleMore size={25} />

                {/* Unread badge */}
                <AnimatePresence>
                    {count > 0 && (
                        <motion.span
                            key={count}
                            initial={{
                                scale: 0,
                                opacity: 0,
                            }}
                            animate={{
                                scale: 1,
                                opacity: 1,
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
