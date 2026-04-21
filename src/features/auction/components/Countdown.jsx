import { useEffect, useState } from "react";

export function Countdown({ endTime }) {
    const getTime = () => {
        const diff = Math.max(0, Math.floor((new Date(endTime) - new Date()) / 1000));
        return {
            h: String(Math.floor(diff / 3600)).padStart(2, "0"),
            m: String(Math.floor((diff % 3600) / 60)).padStart(2, "0"),
            s: String(diff % 60).padStart(2, "0"),
        };
    };
    const [time, setTime] = useState(getTime());
    useEffect(() => {
        const id = setInterval(() => setTime(getTime()), 1000);
        return () => clearInterval(id);
    }, []);

    return (
        <div className="grid grid-cols-3 gap-3">
            {[
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
