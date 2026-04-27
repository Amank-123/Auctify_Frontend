import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { HiOutlineBell } from "react-icons/hi";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";
import { socket } from "@/shared/services/socket";
import { useAuth } from "@/hooks/useAuth.js";

export default function NotificationBell() {
    const { User } = useAuth();
    const [count, setCount] = useState(0);

    const fetchUnreadCount = useCallback(async () => {
        if (!User?._id) {
            setCount(0);
            return;
        }

        try {
            const res = await api.get(API_ENDPOINTS.Notification.GET_NOTIFICATION);
            const unread = (res.data?.data || []).filter((item) => !item.isRead).length;
            setCount(unread);
        } catch (error) {
            console.error("Failed to fetch unread count:", error);
            setCount(0);
        }
    }, [User?._id]);

    const playSound = useCallback(() => {
        try {
            const audio = new Audio("/notify.mp3");
            audio.volume = 0.6;
            audio.play().catch(() => console.log("🔇 Audio blocked"));
        } catch (err) {
            console.log("Notification sound error");
        }
    }, []);

    useEffect(() => {
        if (!User?._id) {
            setCount(0);
            return;
        }

        fetchUnreadCount();

        socket.emit("joinRoom", User._id);
        console.log(`🛎 Joined notification room for user: ${User._id}`);

        const handleNewNotification = (data) => {
            console.log("🛎 Real-time notification received:", data);
            setCount((prev) => prev + 1);
            playSound();
        };

        socket.on("newNotification", handleNewNotification);

        return () => {
            socket.off("newNotification", handleNewNotification);
        };
    }, [User?._id, fetchUnreadCount, playSound]);

    return (
        <Link to="/notifications" className="relative">
            <HiOutlineBell className="text-2xl" />

            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-medium min-w-[18px] h-[18px] flex items-center justify-center rounded-full">
                    {count > 99 ? "99+" : count}
                </span>
            )}
        </Link>
    );
}
