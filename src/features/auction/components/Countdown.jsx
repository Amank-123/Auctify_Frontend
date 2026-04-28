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
    }, [endTime]);

    const units = [
        [time.d, "DAYS"],
        [time.h, "HOURS"],
        [time.m, "MINUTES"],
        [time.s, "SECONDS"],
    ];

    return (
        <div className="flex items-center gap-1">
            {units.map(([value, label], i) => (
                <div key={label} className="flex items-center gap-1">
                    <div className="text-center">
                        <p className="text-2xl font-black text-blue-600 tabular-nums leading-none">
                            {value}
                        </p>
                        <p className="text-[9px] uppercase tracking-[1.5px] text-slate-400 font-semibold mt-0.5">
                            {label}
                        </p>
                    </div>
                    {i < units.length - 1 && (
                        <span className="text-xl font-bold text-slate-300 pb-3 mx-0.5">:</span>
                    )}
                </div>
            ))}
        </div>
    );
}
