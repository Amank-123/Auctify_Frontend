import { useEffect, useState, useCallback } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";

import { api } from "@/shared/services/axios";
import { socket } from "@/shared/services/socket";
import { useAuth } from "../../../hooks/useAuth";

const OrderButton = ({ refreshKey }) => {
    const navigate = useNavigate();

    const { User } = useAuth();

    const [orderCount, setOrderCount] = useState(0);

    const bagControls = useAnimation();
    const glowControls = useAnimation();
    const badgeControls = useAnimation();

    const triggerOrderAnimation = useCallback(async () => {
        await bagControls.start({
            rotate: [0, 12, -10, 8, -6, 4, -2, 0],
            transition: {
                duration: 0.6,
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
    }, [bagControls, glowControls, badgeControls]);

    const fetchOrders = useCallback(async () => {
        try {
            const endpoint = User?.role === "seller" ? "/api/order/seller" : "/api/order/my";

            const res = await api.get(endpoint);

            const activeOrders = res.data.data.filter(
                (order) => order.orderStatus !== "delivered" && order.orderStatus !== "cancelled",
            );

            setOrderCount(activeOrders.length);
        } catch (error) {
            console.log(error);
        }
    }, [User]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders, refreshKey]);

    useEffect(() => {
        const incrementHandler = async () => {
            setOrderCount((prev) => prev + 1);

            await triggerOrderAnimation();
        };

        const decrementHandler = async () => {
            setOrderCount((prev) => Math.max(prev - 1, 0));

            await triggerOrderAnimation();
        };

        socket.on("ORDER_COUNT_INCREMENT", incrementHandler);

        socket.on("ORDER_COUNT_DECREMENT", decrementHandler);

        return () => {
            socket.off("ORDER_COUNT_INCREMENT", incrementHandler);

            socket.off("ORDER_COUNT_DECREMENT", decrementHandler);
        };
    }, [triggerOrderAnimation]);

    return (
        <button
            onClick={() => navigate("/orders")}
            className="relative inline-flex items-center justify-center cursor-pointer"
        >
            {/* Glow Ring */}
            <motion.div
                animate={glowControls}
                className="absolute inset-0 rounded-xl pointer-events-none"
            />

            {/* Shopping Bag */}
            <motion.div
                animate={bagControls}
                style={{
                    transformOrigin: "top center",
                }}
                className="relative text-slate-800 hover:text-blue-600 transition-colors"
            >
                <HiOutlineShoppingBag size={24} />

                {/* Badge */}
                <AnimatePresence>
                    {orderCount > 0 && (
                        <motion.span
                            key={orderCount}
                            animate={badgeControls}
                            initial={false}
                            exit={{
                                scale: 0,
                                opacity: 0,
                            }}
                            className="
                            absolute -top-1 -right-1
                            bg-red-500 text-white text-[10px]
                            font-bold min-w-[16px] h-4 px-[3px]
                            rounded-full flex items-center
                            justify-center border-2 border-white
                            "
                        >
                            {orderCount > 99 ? "99+" : orderCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </button>
    );
};

export default OrderButton;
