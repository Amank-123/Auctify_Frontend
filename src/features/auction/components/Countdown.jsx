import { useEffect, useState } from "react";

export function Countdown({ endTime }) {
    const getTime = () => {
        const diff = Math.max(0, Math.floor((new Date(endTime) - new Date()) / 1000));

        const days = Math.floor(diff / 86400);
        const hours = Math.floor((diff % 86400) / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;

        return {
            d: String(days).padStart(2, "0"),
            h: String(hours).padStart(2, "0"),
            m: String(minutes).padStart(2, "0"),
            s: String(seconds).padStart(2, "0"),
        };
    };

    const [time, setTime] = useState(getTime());

    useEffect(() => {
        const id = setInterval(() => setTime(getTime()), 1000);
        return () => clearInterval(id);
    }, [endTime]); // ← subtle but important fix

    return (
        <div className="grid grid-cols-4 gap-3">
            {[
                [time.d, "Days"],
                [time.h, "Hours"],
                [time.m, "Minutes"],
                [time.s, "Seconds"],
            ].map(([value, label]) => (
                <div
                    key={label}
                    className="relative rounded-2xl bg-gradient-to-b from-blue-600 to-blue-700 p-4 text-center overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/5 rounded-2xl" />
                    <p className="relative text-3xl font-black text-white tabular-nums tracking-tight">
                        {value}
                    </p>
                    <p className="relative text-[10px] uppercase tracking-[2px] text-blue-200 mt-1 font-semibold">
                        {label}
                    </p>
                </div>
            ))}
        </div>
    );
}
