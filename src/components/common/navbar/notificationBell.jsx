import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineBell } from "react-icons/hi";
import { api } from "@/shared/services/axios";
import { API_ENDPOINTS } from "@/shared/constants/apiEndpoints";

export default function NotificationBell() {
    const [count, setCount] = useState(0);

    useEffect(() => {
        fetchUnreadCount();
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const res = await api.get(API_ENDPOINTS.Notification.GET_NOTIFICATION);

            const notifications = res.data.data || [];

            const unread = notifications.filter((item) => !item.isRead).length;

            setCount(unread);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Link
            to="/notifications"
            className="relative text-[#1F2937] transition hover:text-[#2563EB]"
        >
            <HiOutlineBell className="text-2xl" />

            {count > 0 && (
                <span className="absolute -top-1 -right-1 rounded-full bg-[#C2410C] px-1.5 py-0.5 text-xs text-white">
                    {count}
                </span>
            )}
        </Link>
    );
}
