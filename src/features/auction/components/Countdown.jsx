import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Countdown({ endTime }) {
    const getTime = () => {
        const diff = Math.max(0, Math.floor((new Date(endTime) - new Date()) / 1000));

        const days = Math.floor(diff / 86400);
        const hours = Math.floor((diff % 86400) / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;

        return {
            total: diff,
            d: days,
            h: hours,
            m: minutes,
            s: seconds,
        };
    };

    const [time, setTime] = useState(getTime());

    useEffect(() => {
        const id = setInterval(() => setTime(getTime()), 1000);
        return () => clearInterval(id);
    }, [endTime]);

    const unitsRaw = [
        { label: "DAYS", value: time.d },
        { label: "HOURS", value: time.h },
        { label: "MINUTES", value: time.m },
        { label: "SECONDS", value: time.s },
    ];

    // 🎯 PRECEDENCE LOGIC (this is what you were missing)
    const firstVisibleIndex = unitsRaw.findIndex((u) => u.value > 0);
    const startIndex = firstVisibleIndex === -1 ? 3 : firstVisibleIndex;

    const units = unitsRaw.slice(startIndex);

    // 🎨 COLOR LOGIC
    let theme = {
        bg: "bg-green-50",
        border: "border-green-200",
        text: "text-green-600",
    };

    if (time.total <= 86400) {
        theme = {
            bg: "bg-yellow-50",
            border: "border-yellow-200",
            text: "text-yellow-600",
        };
    }

    if (time.total <= 3600) {
        theme = {
            bg: "bg-red-50",
            border: "border-red-200",
            text: "text-red-600",
        };
    }

    return (
        <div className="flex items-center gap-3">
            {units.map((unit, i) => (
                <div
                    key={unit.label}
                    className={`relative flex flex-col items-center justify-center px-5 py-4 rounded-2xl border shadow-sm min-w-[75px] overflow-hidden ${theme.bg} ${theme.border}`}
                >
                    {/* 🔥 URGENCY GLOW */}
                    {time.total <= 3600 && (
                        <div className="absolute inset-0 bg-red-400/10 animate-pulse" />
                    )}

                    {/* ⏱ NUMBER ANIMATION */}
                    <AnimatePresence mode="popLayout">
                        <motion.span
                            key={unit.value}
                            initial={{ y: 12, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -12, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className={`text-3xl font-semibold tabular-nums ${theme.text}`}
                        >
                            {String(unit.value).padStart(2, "0")}
                        </motion.span>
                    </AnimatePresence>

                    {/* LABEL */}
                    <span className="text-xs font-semibold tracking-wide mt-1 text-slate-600">
                        {unit.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
